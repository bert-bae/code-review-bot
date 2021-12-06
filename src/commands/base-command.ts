import { DevelopersModel, PullRequestsModel } from "../models";

export type CommandContext = {
  logger: {
    info: (message) => void;
    warn: (message, data) => void;
    error: (message, data) => void;
  };
  models: {
    developers: DevelopersModel;
    pullRequests: PullRequestsModel;
  };
};

export abstract class BaseCommand {
  public async execute(input): Promise<any> {}
}
