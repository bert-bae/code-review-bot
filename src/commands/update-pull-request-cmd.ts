import { PullRequestEntity, PullRequestProperties } from "../types";
import { BaseCommand, CommandContext } from "./base-command";

export type UpdatePullRequestCmdInput = Partial<
  Omit<PullRequestEntity, "prOwner">
> & {
  developerId: string;
  prId: string;
};

export class UpdatePullRequestCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private services: CommandContext["services"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.services = ctx.services;
  }

  public async execute(input: UpdatePullRequestCmdInput) {
    this.logger.info(
      `[UpdatePullRequestCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    const { developerId, prId, ...updateData } = input;
    const updated = await this.services.pullRequests.updateOne(
      {
        prOwner: developerId,
        prId,
      },
      updateData
    );
    return updated;
  }
}
