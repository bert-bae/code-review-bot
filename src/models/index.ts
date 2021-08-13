import { BaseDynamoDBModel } from "./base-dynamodb-model";

export const prModel = new BaseDynamoDBModel({
  tableName: "PullRequest_Table",
  primaryKey: "prOwnerId",
  secondaryIndices: ["prId", "reviewerId"],
});

export const devModel = new BaseDynamoDBModel({
  tableName: "Developer_Table",
  primaryKey: "developerId",
  secondaryIndices: [],
});
