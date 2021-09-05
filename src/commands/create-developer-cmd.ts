import { DeveloperEntity } from "../types";
import { BaseCommand, CommandContext } from "./base-command";

export type CreateDeveloperCmdInput = DeveloperEntity;

export class CreateDeveloperCmd extends BaseCommand {
  private logger: CommandContext["logger"];
  private models: CommandContext["models"];
  constructor(ctx: CommandContext) {
    super();
    this.logger = ctx.logger;
    this.models = ctx.models;
  }

  public async execute(input: CreateDeveloperCmdInput) {
    this.logger.info(
      `[CreateDeveloperCmd] Executing cmd: ${JSON.stringify(input)}`
    );
    const developer = await this.models.developers.create(input);
    return {
      developerId: developer.developerId,
    };
  }
}
