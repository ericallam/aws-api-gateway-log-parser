const { parseLogs } = require("..");

test("parsing log events that is a key throttle log returns the correct results", () => {
  const logData = {
    messageType: "DATA_MESSAGE",
    owner: "958845080241",
    logGroup: "API-Gateway-Execution-Logs_uwe3g5jm54/Prod",
    logStream: "072b030ba126b2f4b2374f342be9ed44",
    subscriptionFilters: ["ship-logs"],
    logEvents: [
      {
        id: "34592803782802773986954514236420494137821591878455918592",
        timestamp: 1551194970161,
        message:
          "(4f3e3b0f-39db-11e9-9c2e-5bd7c2de5998) Extended Request Id: Vts2FFmArPEFh8g="
      },
      {
        id: "34592803782802773986954514236420494137821591878455918593",
        timestamp: 1551194970161,
        message:
          "(4f3e3b0f-39db-11e9-9c2e-5bd7c2de5998) Verifying Usage Plan for request: 4f3e3b0f-39db-11e9-9c2e-5bd7c2de5998. API Key:  API Stage: uwe3g5jm54/Prod"
      },
      {
        id: "34592803782825074732153044859562029856094240239961899010",
        timestamp: 1551194970162,
        message:
          "(4f3e3b0f-39db-11e9-9c2e-5bd7c2de5998) Key throttle limit exceeded for RestApi uwe3g5jm54, Stage Prod, Resource k0w8mc, HttpMethod POST. Limit: 1.00 Burst: 1"
      },
      {
        id: "34592803782825074732153044859562029856094240239961899011",
        timestamp: 1551194970162,
        message:
          "(4f3e3b0f-39db-11e9-9c2e-5bd7c2de5998) Method completed with status: 429"
      }
    ]
  };

  const results = parseLogs({}, logData);

  expect(results).toMatchSnapshot(results);
});
