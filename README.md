# aws-api-gateway-log-parser

With logging enabled, API Gateway streams execution logs to a log group, one event at a time, as plaintext strings. This makes it very hard to search on a specific portion of the request while maintaining perspective of the whole request at the same time.

This module aims to solve this problem by parsing logs for a single request into a JSON object, which can then be analysed easily.

# Installation

`npm install aws-api-gateway-log-parser --save`

# Usage

Typically, this is used inside a lambda function which is triggered by API gateway's execution logs.

#### Note:

Sometimes, when the amount of data being written to the log stream is very large, AWS truncates the log stream abruptly. This usually happens for very large API response objects. In case of truncation, some data can still be salvaged.

For example, this method request headers log message:

```
"(515f1e99-39db-11e9-9e96-01e5c04505b9) Method request headers: {Accept=application/json, x-amz-date=20190511T093919Z, CloudFront-Viewer-Country=US, Debug-Log-Enabled=false, CloudFront-Forwarded-Proto=https, CloudFront-Is-Tablet-Viewer=false, CloudFront-Is-Mobile-Viewer=false, User-Agent=axios/0.18.0, X-Forwarded-Proto=https, CloudFront-Is-SmartTV-Viewer=false, x-correlation-id=f3d88489-f037-41bd-b8e5-85cc641cd798, Host=1xf1pqul21.execute-api.us-east-1.amazonaws.com, X-Forwarded-Port=443, X-Amzn-Trace-Id=Self=1-5cd69847-7d65b8a6fca911a4e79bb765;Root=1-5cd69847-c21c804d7409f05481ecb5f3;Parent=f576f7af007c02cd;Sampled=0, Via=1.1 c94378b36f8a40d65d0bb1c2edbb9c73.cloudfront.net (CloudFront), X-Amz-Security-Token=AgoJb3JpZ2luX2VjEJL//////////wEaCXVzLWVhc3QtMSJHMEUCIFN1dxmkxBL7GziWUXoMjRorbIwF7i5tjbr96N3unyksAiEAhy85vB35laoOipf8DIiCZDNywV9BlfMIwg5KcLl/QX8qtQIIi///////////ARAAGgw5NjgyMjM4ODI3NjUiDFesMF5/+pdWWKb+viqJArEZe8OkQH2zGZMvEzK7o4zL0y7SncIYE94UAl3dt/PyPhyJzBk+Nu0ZQhUbKCDil1NIXjcUhMvEqNkWIqBUkr9I02cWcQeLz1h7A2mP6plxF/iUL5BRdsqsJNJDHqzq2KpITS1Rw/zqvp [TRUNCATED]"
```

Will result in the following object:

```json
{
  "Accept": "application/json",
  "CloudFront-Forwarded-Proto": "https",
  "CloudFront-Is-Mobile-Viewer": "false",
  "CloudFront-Is-SmartTV-Viewer": "false",
  "CloudFront-Is-Tablet-Viewer": "false",
  "CloudFront-Viewer-Country": "US",
  "Debug-Log-Enabled": "false",
  "Host": "1xf1pqul21.execute-api.us-east-1.amazonaws.com",
  "User-Agent": "axios/0.18.0",
  "Via": "1.1 c94378b36f8a40d65d0bb1c2edbb9c73.cloudfront.net (CloudFront)",
  "X-Amz-Security-Token": "AgoJb3JpZ2luX2VjEJL//////////wEaCXVzLWVhc3QtMSJHMEUCIFN1dxmkxBL7GziWUXoMjRorbIwF7i5tjbr96N3unyksAiEAhy85vB35laoOipf8DIiCZDNywV9BlfMIwg5KcLl/QX8qtQIIi///////////ARAAGgw5NjgyMjM4ODI3NjUiDFesMF5/+pdWWKb+viqJArEZe8OkQH2zGZMvEzK7o4zL0y7SncIYE94UAl3dt/PyPhyJzBk+Nu0ZQhUbKCDil1NIXjcUhMvEqNkWIqBUkr9I02cWcQeLz1h7A2mP6plxF/iUL5BRdsqsJNJDHqzq2KpITS1Rw/zqvp [TRUNCATED]",
  "X-Amzn-Trace-Id": "Self",
  "X-Forwarded-Port": "443",
  "X-Forwarded-Proto": "https",
  "x-amz-date": "20190511T093919Z",
  "x-correlation-id": "f3d88489-f037-41bd-b8e5-85cc641cd798"
}
```

Large request and response body fields work the same way, but can be trickier to parse. This library now uses `partial-json-parser` to attempt to parse truncated JSON body log messages. For example, this log message:

```
(515f1e99-39db-11e9-9e96-01e5c04505b9) Endpoint request body after transformations: {"resource":"/verifyReceipt","path":"/verifyReceipt","httpMethod":"POST","headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=utf-8","Debug-Log-Enabled":"false","Host":"h733q2j6gb.execute-api.eu-west-2.amazonaws.com","User-Agent":"python-requests/2.20.0","X-Amzn-Trace-Id":"Self=1-5c755b5d-6cdced0b55e7998bc0251bcb;Root=1-5c755b5d-07b29b94e632d3da19d88789;Parent=61e6466ca210cdf8;Sampled=1","x-correlation-id":"f82097ed-5302-4a98-8200-dad186b419be","x-correlation-span-id":"LUUMyTw58JG0vhnGfa","X-Forwarded-For":"18.130.162.42","X-Forwarded-Port":"443","X-Forwarded-Proto":"https"},"multiValueHeaders":{"Accept":["application/json, text/plain, */*"],"Content-Type":["application/json;charset=utf-8"],"Debug-Log-Enabled":["false"],"Host":["h733q2j6gb.execute-api.eu-west-2.amazonaws.com"],"User-Agent":["python-requests/2.20.0"],"X-Amzn-Trace-Id":["Self=1-5c755b5d-6cdced0b55e7998bc0251bcb;Root=1-5c755b5d-07b29b94e632d3da19d88789;Paren [TRUNCATED]
```

Will result in the following object:

```json
{
  "headers": {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=utf-8",
    "Debug-Log-Enabled": "false",
    "Host": "h733q2j6gb.execute-api.eu-west-2.amazonaws.com",
    "User-Agent": "python-requests/2.20.0",
    "X-Amzn-Trace-Id": "Self=1-5c755b5d-6cdced0b55e7998bc0251bcb;Root=1-5c755b5d-07b29b94e632d3da19d88789;Parent=61e6466ca210cdf8;Sampled=1",
    "X-Forwarded-For": "18.130.162.42",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https",
    "x-correlation-id": "f82097ed-5302-4a98-8200-dad186b419be",
    "x-correlation-span-id": "LUUMyTw58JG0vhnGfa"
  },
  "httpMethod": "POST",
  "multiValueHeaders": {
    "Accept": ["application/json, text/plain, */*"],
    "Content-Type": ["application/json;charset=utf-8"],
    "Debug-Log-Enabled": ["false"],
    "Host": ["h733q2j6gb.execute-api.eu-west-2.amazonaws.com"],
    "User-Agent": ["python-requests/2.20.0"],
    "X-Amzn-Trace-Id": []
  },
  "path": "/verifyReceipt",
  "resource": "/verifyReceipt"
}
```

Previously in version `1.0.5` of this library used a configuration object that allowed library users to pass in a `TRUNCATED_RESPONSE_KEYS` option, but this option is no longer supported as `aws-api-gateway-log-parser` now attempt to parse all truncated fields in all log messages.

# License

- The MIT License.

# Author

- [Sahil Narain](https://github.com/sahilnarain)

# Credits

- With very helpful insights from [Manu Rana](https://github.com/manurana) and [Rabi Shah](https://github.com/rabishah)
- Inspired by [rotemtam's serverless-aws-logs-parser](https://github.com/rotemtam/serverless-aws-logs-parser).
