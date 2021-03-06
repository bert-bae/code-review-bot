import { PullRequestEntity } from "../types";
import { BaseCommand, CommandContext } from "./base-command";

export type GetPullRequestsByDeveloperCmdInput = {
  developerId: string;
};

export class GetPullRequestsByDeveloperCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private models: CommandContext["models"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.models = ctx.models;
  }

  public async execute(
    input: GetPullRequestsByDeveloperCmdInput
  ): Promise<PullRequestEntity[]> {
    this.logger.info(
      `[GetPullRequestsByDeveloperCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    try {
      return this.models.pullRequests.query("prOwner", input.developerId);
    } catch (err) {
      console.log(err);
    }
  }
}
