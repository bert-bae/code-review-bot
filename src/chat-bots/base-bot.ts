import { DeveloperEntity, PullRequestEntity } from "../types";

export abstract class BaseBot {
  protected abstract initializeBot();
  protected abstract addCommands();

  protected abstract resolveDeveloper(
    id: string,
    name?: string
  ): Promise<DeveloperEntity>;

  protected abstract resolvePullRequest(
    developerId: string,
    prId: string
  ): Promise<PullRequestEntity>;

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

  protected abstract unassignReviewer(
    botCtx: any,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  ): Promise<void>;

  protected abstract openPullRequestReview(
    botCtx: any,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  );
}
