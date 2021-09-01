import dynamoose from "dynamoose";

const endpoint = process.env.DDB_ENDPOINT || "http://localhost:8000";
export const createDdbClient = () => {
  console.log(`[DynamoDB Client] Initiating connection to ${endpoint}`);
  const ddb = new dynamoose.aws.sdk.DynamoDB({
    region: process.env.AWS_REGION || "local",
    endpoint,
  });
  dynamoose.aws.ddb.set(ddb);
  console.log(`[DynamoDB Client] Connected to ${endpoint}`);
};
