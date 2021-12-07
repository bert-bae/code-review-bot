import log from "loglevel";
import { CommandContext } from "../commands";
import { PullRequestsModel } from "../models/pull-requests-model";
import { DevelopersModel } from "../models/developers-model";

jest.mock("../models/developers-model");
jest.mock("../models/pull-requests-model");

jest.mock("loglevel");

export const mockPullRequestModel = new PullRequestsModel();
export const mockDevelopersModel = new DevelopersModel();

export const mockContext = (): CommandContext => {
  return {
    logger: log,
    models: {
      pullRequests: mockPullRequestModel,
      developers: mockDevelopersModel,
    },
  };
};
