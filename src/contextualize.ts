import log from "loglevel";
import { PullRequestModel, DeveloperModel } from "./models";
import { CommandContext } from "./commands";
import { PullRequestService } from "./services";

log.setLevel(log.levels.INFO);

export const createContext = (): CommandContext => {
  return {
    logger: log,
    models: {
      developers: DeveloperModel,
      pullRequests: PullRequestModel,
    },
    services: {
      pullRequests: PullRequestService,
    },
  };
};
