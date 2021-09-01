import { DeveloperEntity } from "../types";
import { BaseCommand, CommandContext } from "./base-command";

export type GetDeveloperCmdInput = Pick<DeveloperEntity, "developerId">;

export class GetDeveloperCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private models: CommandContext["models"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.models = ctx.models;
  }

  public async execute(input: GetDeveloperCmdInput) {
    this.logger.info(
      `[GetDeveloperCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    const developer = await this.models.developers.get(input.developerId);
    return developer;
  }
}
