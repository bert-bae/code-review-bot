import { DeveloperEntity } from "../types";
import { BaseCommand, CommandContext } from "./base-command";

export type ResolveDeveloperCmdInput = DeveloperEntity;

export class ResolveDeveloperCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private models: CommandContext["models"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.models = ctx.models;
  }

  public async execute(input: ResolveDeveloperCmdInput) {
    this.logger.info(
      `[ResolveDeveloperCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    if (!input.developerId) {
      throw new Error("Developer ID cannot be null or undefined");
    }

    let developer = await this.models.developers.get(input.developerId);

    if (!developer) {
      this.logger.info(
        `Developer with ${input.developerId} not found. Creating record...`
      );
      developer = await this.models.developers.create(input);
    }

    return developer;
  }
}
