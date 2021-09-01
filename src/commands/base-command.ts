import { DeveloperModel, PullRequestModel } from "../models";

export type CommandContext = {
  logger: {
    info: (message) => void;
    warn: (message, data) => void;
    error: (message, data) => void;
  };
  models: {
    developers: typeof DeveloperModel;
    pullRequests: typeof PullRequestModel;
  };
};

export abstract class BaseCommand {
  public async execute(input): Promise<any> {}
}
