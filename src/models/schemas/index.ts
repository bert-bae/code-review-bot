import dynamoose from "dynamoose";
import { v4 as uuidv4 } from "uuid";

const reviewScale = [1, 2, 3, 4, 5];
export const ReviewSchema = new dynamoose.Schema({
  complexity: {
    type: Number,
    enum: reviewScale,
  },
  tests: {
    type: Number,
    enum: reviewScale,
  },
  design: {
    type: Number,
    enum: reviewScale,
  },
  functionality: {
    type: Number,
    enum: reviewScale,
  },
  comments: {
    type: String,
  },
});

export const PullRequestSchema = new dynamoose.Schema(
  {
    prOwner: {
      type: String,
      required: true,
      hashKey: true,
    },
    prId: {
      type: String,
      default: uuidv4,
      rangeKey: true,
    },
    link: {
      type: String,
      required: true,
    },
    reviewerId: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    reviewSurvey: ReviewSchema,
  },
  { timestamps: true }
);

export const DevelopersSchema = new dynamoose.Schema(
  {
    developerId: {
      type: String,
      default: uuidv4,
      hashKey: true,
    },
    name: {
      type: String,
    },
    accessRoles: {
      type: String,
      default: "Developer",
      enum: ["Admin", "Manager", "Developer"],
    },
  },
  { timestamps: true }
);
