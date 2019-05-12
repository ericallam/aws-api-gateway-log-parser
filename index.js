"use strict";

const groupBy = require("lodash.groupby");
const partialJSONParser = require("partial-json-parser");

const _parseType1 = data => {
  let result = {};

  if (!data) {
    return result;
  }

  let _objects = data.split(/\,\ /);

  _objects.forEach(object => {
    let _result = object.trim().split("=");
    if (_result[0] && _result[1] && _result[1].split(",").length === 1) {
      result[_result[0]] = _result[1];
    } else if (_result[0] && _result[1] && _result[1].split(",").length > 1) {
      result[_result[0]] = _result[1].split(",");
    }
  });

  return result;
};

const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

const _parseBody = data => {
  try {
    return JSON.parse(data);
  } catch (e) {
    try {
      const partialData = partialJSONParser(data);

      if (isEmpty(partialData)) {
        return data;
      }

      return partialData;
    } catch (e) {
      return data;
    }
  }
};

const _parseKeyThrottle = data => {
  const result = {};

  const limitMatches = data.match(/Limit:\s([0-9.]+)/);

  if (limitMatches) {
    result.limit = Number(limitMatches[1]);
  }

  const burstMatches = data.match(/Burst:\s([0-9.]+)/);

  if (burstMatches) {
    result.burst = Number(burstMatches[1]);
  }

  const methodMatches = data.match(/HttpMethod\s([A-Z]+)/);

  if (methodMatches) {
    result.http_method = methodMatches[1];
  }

  const resourceMatches = data.match(/Resource\s([A-Za-z0-9]+)/);

  if (resourceMatches) {
    result.resource = resourceMatches[1];
  }

  return result;
};

const parseSingleRequest = logEvents => {
  const parseExps = {
    api_stage: /API Stage: (.*)/,
    request_id: /Verifying Usage Plan for request: (.{36})/,
    http_method: /HTTP Method: (.*?),/,
    http_resource_path: /Resource Path: (.*)/,
    request_path: /Method request path: (.*)/,
    request_query_string: /request query string: {(.*)}/,
    method_request_headers: /Method request headers: {(.*)}?/,
    method_request_body: /Method request body before transformations: (.*)/,
    endpoint_request_uri: /Endpoint request URI: (.*)/,
    endpoint_request_headers: /Endpoint request headers: {(.*)}?/,
    endpoint_request_body: /Endpoint request body after transformations: (.*)/,
    integration_latency: /Received response. Integration latency: (.*) ms/,
    endpoint_response_body: /Endpoint response body before transformations: (.*)/,
    endpoint_response_headers: /Endpoint response headers: {(.*)}/,
    method_response_body: /Method response body after transformations: (.*)/,
    method_response_headers: /Method response headers: {(.*)}/,
    method_status: /Method completed with status: (.*)/,
    key_throttle: /Key throttle limit exceeded for RestApi (.*)/,
    execution_failure: /Execution failed due to configuration error: (.*)/,
    customer_function_error: /Lambda execution failed with status 200 due to customer function error: (.*)/
  };

  let result = {};
  let _captureGroup = null;

  for (let l of logEvents) {
    for (let exp in parseExps) {
      if (l.message.match(parseExps[exp])) {
        _captureGroup = l.message.match(parseExps[exp])[1];

        switch (exp) {
          case "request_query_string":
            result[exp] = _parseType1(_captureGroup);
            break;
          case "endpoint_request_headers":
          case "endpoint_response_headers":
          case "method_response_headers":
          case "method_request_headers":
            result[exp] = _parseType1(_captureGroup);
            break;

          case "endpoint_request_body":
          case "endpoint_response_body":
          case "method_response_body":
          case "method_request_body":
            result[exp] = _parseBody(_captureGroup);
            break;

          case "integration_latency":
          case "method_status":
            result[exp] = Number(_captureGroup);
            break;
          case "key_throttle":
            result[exp] = _parseKeyThrottle(_captureGroup);
            break;

          default:
            result[exp] = _captureGroup;
            break;
        }
      }
    }
  }

  result["request-start-time"] = new Date(logEvents[0].timestamp);
  result["request-end-time"] = new Date(
    logEvents[logEvents.length - 1].timestamp
  );
  result["request-execution-duration"] =
    result["request-end-time"].getTime() -
    result["request-start-time"].getTime();
  result["@timestamp"] = result["request-start-time"].toISOString();

  return result;
};

const parseLogs = logs => {
  if (!logs) {
    return null;
  }

  if (logs.messageType !== "DATA_MESSAGE") {
    return null;
  }

  if (!logs.logEvents || !logs.logEvents.length) {
    return null;
  }

  const logEventsByRequestId = groupBy(
    logs.logEvents,
    logEvent => logEvent.message.match(/\(([0-9a-zA-Z-]+)\)/)[1]
  );

  return Object.keys(logEventsByRequestId).map(requestId => {
    const logEvents = logEventsByRequestId[requestId];

    return parseSingleRequest(logEvents);
  });
};

module.exports = {
  parseLogs: parseLogs
};
