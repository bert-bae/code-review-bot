import log from "loglevel";
import { PullRequestModel, DeveloperModel } from "./models";
import { CommandContext } from "./commands";

log.setLevel(log.levels.INFO);

export const createCommandContext = (): CommandContext => {
  return {
    logger: log,
    models: {
      developers: DeveloperModel,
      pullRequests: PullRequestModel,
    },
  };
};
