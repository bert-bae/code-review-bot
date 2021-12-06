import { PullRequestEntity } from "../types";
import { BaseCommand, CommandContext } from "./base-command";

export type CreatePullRequestCmdInput = {
  prOwner: string;
  link: string;
  description?: string;
};

export class CreatePullRequestCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private services: CommandContext["services"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.services = ctx.services;
  }

  public async execute(
    input: CreatePullRequestCmdInput
  ): Promise<PullRequestEntity> {
    this.logger.info(
      `[CreatePullRequestCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    return this.services.pullRequests.create({
      prOwner: input.prOwner,
      link: input.link,
    }) as any;
  }
}
