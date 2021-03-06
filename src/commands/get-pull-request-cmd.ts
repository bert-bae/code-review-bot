import { BaseCommand, CommandContext } from "./base-command";

export type GetPullRequestCmdInput = {
  developerId: string;
  prId: string;
};

export class GetPullRequestCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private models: CommandContext["models"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.models = ctx.models;
  }

  public async execute(input: GetPullRequestCmdInput) {
    this.logger.info(
      `[GetPullRequestCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    const prRecord = await this.models.pullRequests.getOne({
      prOwner: input.developerId,
      prId: input.prId,
    });
    return prRecord;
  }
}
