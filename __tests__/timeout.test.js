const { parseLogs } = require("..");

test("parsing log events where the lambda timed out", () => {
  const logData = {
    messageType: "DATA_MESSAGE",
    owner: "958845080241",
    logGroup: "API-Gateway-Execution-Logs_uwe3g5jm54/Prod",
    logStream: "e369853df766fa44e1ed0ff613f563bd",
    subscriptionFilters: ["ship-logs"],
    logEvents: [
      {
        id: "34594411449411532791988959220823609535420837773733789696",
        timestamp: 1551267060425,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Extended Request Id: Vwc2MGFUrPEFV_g="
      },
      {
        id: "34594411449411532791988959220823609535420837773733789697",
        timestamp: 1551267060425,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Verifying Usage Plan for request: 286364ab-3a83-11e9-8dc8-db3cf4c83204. API Key: API Stage: uwe3g5jm54/Prod"
      },
      {
        id: "34594411449478435027584551090248216690238782858251730946",
        timestamp: 1551267060428,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) API Key authorized because method 'GET /echo' does not require API Key. Request will not contribute to throttle or quota limits"
      },
      {
        id: "34594411449478435027584551090248216690238782858251730947",
        timestamp: 1551267060428,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Usage Plan check succeeded for API Key and API Stage uwe3g5jm54/Prod"
      },
      {
        id: "34594411449500735772783081713389752408511431219757711364",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Starting execution for request: 286364ab-3a83-11e9-8dc8-db3cf4c83204"
      },
      {
        id: "34594411449500735772783081713389752408511431219757711365",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) HTTP Method: GET, Resource Path: /echo"
      },
      {
        id: "34594411449500735772783081713389752408511431219757711366",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Method request path: {}"
      },
      {
        id: "34594411449500735772783081713389752408511431219757711367",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Method request query string: {}"
      },
      {
        id: "34594411449500735772783081713389752408511431219757711368",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Method request headers: {Accept=application/json, CloudFront-Viewer-Country=GB, CloudFront-Forwarded-Proto=https, CloudFront-Is-Tablet-Viewer=false, CloudFront-Is-Mobile-Viewer=false, User-Agent=Paw/3.1.8 (Macintosh; OS X/10.14.0) GCDHTTPRequest, X-Forwarded-Proto=https, CloudFront-Is-SmartTV-Viewer=false, Host=uwe3g5jm54.execute-api.eu-west-2.amazonaws.com, X-Forwarded-Port=443, X-Amzn-Trace-Id=Root=1-5c7674f4-a3491d0a9c8012c191821b83, Via=1.1 ddc96a08bf7ad89b0ed3c40b6e4e6d27.cloudfront.net (CloudFront), X-Amz-Cf-Id=Hcd55qxuXLG3Eyo00VI-2W4d-aP8JKgZ19O2-c1hIp4aqiDK77RSXw==, X-Forwarded-For=62.254.81.74, 52.46.38.85, CloudFront-Is-Desktop-Viewer=true}"
      },
      {
        id: "34594411449500735772783081713389752408511431219757711369",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Method request body before transformations: "
      },
      {
        id: "34594411449500735772783081713389752408511431219757711370",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Endpoint request URI: https://lambda.eu-west-2.amazonaws.com/2015-03-31/functions/arn:aws:lambda:eu-west-2:958845080241:function:log-test-1-EchoFunction-175HKORAF18IO/invocations"
      },
      {
        id: "34594411449500735772783081713389752408511431219757711371",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Endpoint request headers: {x-amzn-lambda-integration-tag=286364ab-3a83-11e9-8dc8-db3cf4c83204, Authorization=************************************************************************************************************************************************************************************************************************************************************************************************************************37c4d7, X-Amz-Date=20190227T113100Z, x-amzn-apigateway-api-id=uwe3g5jm54, X-Amz-Source-Arn=arn:aws:execute-api:eu-west-2:958845080241:uwe3g5jm54/Prod/GET/echo, Accept=application/json, User-Agent=AmazonAPIGateway_uwe3g5jm54, X-Amz-Security-Token=FQoGZXIvYXdzEMv//////////wEaDOCC3x/cRTJgXzZ9RiK3A4dtFJBCwcZIQqNgF4s1iuFe9KbpoBKV+2TbajT9rnnk+ru5jN1pacCfBCOqel3ZUJ1cE5WHs1ZkzDQWdUO8C9vEz9LHresBmXaDbOAVyS+9M5mNLvBW862+AMxB9N3vUKGlEizyxVEIL8lx771/Hj8Tt8LhUq2fcW/mouiNKaGu1tL6949xGcaCHLJtWG0jpaZiqGAiE9HYiSqcDVK70a5KrWKDe7MqtDfT+9/A/KN1308Q9rojxTbccIGr5nr9wbepIuvmtq9mBm6n5Lnzav6SLeJgwtqXbe3QvkwJav47PYzVhwgWL [TRUNCATED]"
      },
      {
        id: "34594411449500735772783081713389752408511431219757711372",
        timestamp: 1551267060429,
        message:
          '(286364ab-3a83-11e9-8dc8-db3cf4c83204) Endpoint request body after transformations: {"resource":"/echo","path":"/echo","httpMethod":"GET","headers":{"Accept":"application/json","CloudFront-Forwarded-Proto":"https","CloudFront-Is-Desktop-Viewer":"true","CloudFront-Is-Mobile-Viewer":"false","CloudFront-Is-SmartTV-Viewer":"false","CloudFront-Is-Tablet-Viewer":"false","CloudFront-Viewer-Country":"GB","Host":"uwe3g5jm54.execute-api.eu-west-2.amazonaws.com","User-Agent":"Paw/3.1.8 (Macintosh; OS X/10.14.0) GCDHTTPRequest","Via":"1.1 ddc96a08bf7ad89b0ed3c40b6e4e6d27.cloudfront.net (CloudFront)","X-Amz-Cf-Id":"Hcd55qxuXLG3Eyo00VI-2W4d-aP8JKgZ19O2-c1hIp4aqiDK77RSXw==","X-Amzn-Trace-Id":"Root=1-5c7674f4-a3491d0a9c8012c191821b83","X-Forwarded-For":"62.254.81.74, 52.46.38.85","X-Forwarded-Port":"443","X-Forwarded-Proto":"https"},"multiValueHeaders":{"Accept":["application/json"],"CloudFront-Forwarded-Proto":["https"],"CloudFront-Is-Desktop-Viewer":["true"],"CloudFront-Is-Mobile-Viewer":["false"],"CloudFront-Is-SmartTV-Viewer":["false"],"CloudFront-Is-Tablet-V [TRUNCATED]'
      },
      {
        id: "34594411449500735772783081713389752408511431219757711373",
        timestamp: 1551267060429,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Sending request to https://lambda.eu-west-2.amazonaws.com/2015-03-31/functions/arn:aws:lambda:eu-west-2:958845080241:function:log-test-1-EchoFunction-175HKORAF18IO/invocations"
      },
      {
        id: "34594411695455654567377324341387189237550210269215719438",
        timestamp: 1551267071458,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Received response. Integration latency: 11029 ms"
      },
      {
        id: "34594411695455654567377324341387189237550210269215719439",
        timestamp: 1551267071458,
        message:
          '(286364ab-3a83-11e9-8dc8-db3cf4c83204) Endpoint response body before transformations: {"errorMessage":"2019-02-27T11:31:11.456Z 71952965-d5cc-4974-ae08-6e2138b2275c Task timed out after 10.00 seconds"}'
      },
      {
        id: "34594411695455654567377324341387189237550210269215719440",
        timestamp: 1551267071458,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Endpoint response headers: {Date=Wed, 27 Feb 2019 11:31:11 GMT, Content-Type=application/json, Content-Length=115, Connection=keep-alive, x-amzn-RequestId=71952965-d5cc-4974-ae08-6e2138b2275c, X-Amz-Function-Error=Unhandled, x-amzn-Remapped-Content-Length=0, X-Amz-Executed-Version=$LATEST, X-Amzn-Trace-Id=root=1-5c7674f4-a3491d0a9c8012c191821b83;sampled=1}"
      },
      {
        id: "34594411695455654567377324341387189237550210269215719441",
        timestamp: 1551267071458,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Lambda execution failed with status 200 due to customer function error: 2019-02-27T11:31:11.456Z 71952965-d5cc-4974-ae08-6e2138b2275c Task timed out after 10.00 seconds. Lambda request id: 71952965-d5cc-4974-ae08-6e2138b2275c"
      },
      {
        id: "34594411695455654567377324341387189237550210269215719442",
        timestamp: 1551267071458,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) Method completed with status: 502"
      },
      {
        id: "34594411695455654567377324341387189237550210269215719443",
        timestamp: 1551267071458,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) AWS Integration Endpoint RequestId : 71952965-d5cc-4974-ae08-6e2138b2275c"
      },
      {
        id: "34594411695455654567377324341387189237550210269215719444",
        timestamp: 1551267071458,
        message:
          "(286364ab-3a83-11e9-8dc8-db3cf4c83204) X-ray Tracing ID : 1-5c7674f4-a3491d0a9c8012c191821b83"
      }
    ]
  };

  const results = parseLogs({}, logData);

  expect(results).toMatchSnapshot(results);
});
