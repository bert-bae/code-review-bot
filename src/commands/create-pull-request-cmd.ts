import { PullRequestEntity } from "../types";
import { BaseCommand, CommandContext } from "./base-command";

export type CreatePullRequestCmdInput = {
  prOwner: string;
  link: string;
  description?: string;
};

export class CreatePullRequestCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private models: CommandContext["models"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.models = ctx.models;
  }

  public async execute(
    input: CreatePullRequestCmdInput
  ): Promise<PullRequestEntity> {
    this.logger.info(
      `[CreatePullRequestCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    return this.models.pullRequests.create({
      prOwner: input.prOwner,
      link: input.link,
    }) as any;
  }
}
