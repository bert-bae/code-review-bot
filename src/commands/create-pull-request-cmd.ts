import { BaseCommand, CommandContext } from "./base-command";

export type CreatePullRequestCmdInput = {
  developerId: string;
  link: string;
};

export class CreatePullRequestCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private models: CommandContext["models"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.models = ctx.models;
  }

  public async execute(input: CreatePullRequestCmdInput) {
    this.logger.info(
      `[CreatePullRequestCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    const prRecord = await this.models.pullRequests.create({
      prOwner: input.developerId,
      link: input.link,
    });
    return {
      prId: prRecord.prId,
      prOwner: prRecord.prOwner,
    };
  }
}
