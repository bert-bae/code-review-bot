import log from "loglevel";
import { PullRequestModel, DeveloperModel } from "./models";
import { CommandContext } from "./commands";
import { BotContext } from "./chat-bots/base-bot";

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

export const createBotContext = (): BotContext => {
  return {
    logger: log,
    models: {
      developers: DeveloperModel,
      pullRequests: PullRequestModel,
    },
  };
};
