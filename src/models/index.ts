import dynamoose from "dynamoose";
import { DevelopersSchema, PullRequestSchema } from "./schemas";

export const PullRequestModel = dynamoose.model(
  "ReviewBot_PullRequests",
  PullRequestSchema
);
export const DeveloperModel = dynamoose.model(
  "ReviewBot_Developers",
  DevelopersSchema
);
