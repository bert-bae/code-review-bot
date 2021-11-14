import { DeveloperModel, PullRequestModel } from "../models";
import { DeveloperEntity } from "../types";

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
  protected abstract addCommands();

  protected abstract resolveDeveloper(
    id: string,
    name?: string
  ): Promise<DeveloperEntity>;

  protected abstract createPullRequest(
    ctx: any,
    developer: DeveloperEntity,
    optInput?: Record<string, any>
  ): Promise<void>;

  protected abstract listPullRequests(
    botCtx: any,
    developer: DeveloperEntity,
    optInput?: Record<string, any>
  ): Promise<void>;

  protected abstract assignReviewer(
    botCtx: any,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  ): Promise<void>;
}
