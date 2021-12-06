import { PullRequestEntity } from "../types";
import { BaseCommand, CommandContext } from "./base-command";

export type GetPullRequestsByDeveloperCmdInput = {
  developerId: string;
};

export class GetPullRequestsByDeveloperCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private services: CommandContext["services"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.services = ctx.services;
  }

  public async execute(
    input: GetPullRequestsByDeveloperCmdInput
  ): Promise<PullRequestEntity[]> {
    this.logger.info(
      `[GetPullRequestsByDeveloperCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    try {
      return this.services.pullRequests.queryByOwner(input.developerId);
    } catch (err) {
      console.log(err);
    }
  }
}
