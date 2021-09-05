import { DeveloperModel, PullRequestModel } from "../models";

export type BotContext = {
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

export abstract class BaseBot {
  protected abstract initializeBot();
  protected abstract addListeners();
  protected abstract addCommands();
}
