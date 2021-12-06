import log from "loglevel";
import { PullRequestsModel, DevelopersModel } from "./models";
import { CommandContext } from "./commands";

log.setLevel(log.levels.INFO);

export const createContext = (): CommandContext => {
  return {
    logger: log,
    models: {
      developers: new DevelopersModel(),
      pullRequests: new PullRequestsModel(),
    },
  };
};
