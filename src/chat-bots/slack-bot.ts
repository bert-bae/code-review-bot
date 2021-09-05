import { Botkit, BotkitMessage, BotWorker } from "botkit";
import {
  SlackAdapter,
  SlackEventMiddleware,
  SlackMessageTypeMiddleware,
} from "botbuilder-adapter-slack";
import { BaseBot, BotContext } from "./base-bot";
import { CommandConstructor } from "../utils/command-constructor";
import { CreatePullRequestCmd, ResolveDeveloperCmd } from "../commands";
import { AccessRoles, DeveloperEntity, PullRequestEntity } from "../types";
import { CreatePullRequestCmdInput } from "../commands/create-pull-request-cmd";

export class SlackBot extends BaseBot {
  private ctx: BotContext;
  private logger: BotContext["logger"];
  private models: BotContext["models"];
  private botCommands: CommandConstructor;
  private bot: Botkit;

  constructor(ctx: BotContext) {
    super();
    this.ctx = ctx;
    this.logger = ctx.logger;
    this.models = ctx.models;
    this.initializeBot();
    this.addListeners();
    this.addCommands();
  }

  protected initializeBot() {
    const slackAdapter = new SlackAdapter({
      clientSigningSecret: process.env.SLACK_SIGNING_SECRET,
      botToken: process.env.SLACK_BOT_TOKEN,
      oauthVersion: "v2",
    });
    slackAdapter.use(new SlackEventMiddleware());
    slackAdapter.use(new SlackMessageTypeMiddleware());

    this.bot = new Botkit({
      adapter: slackAdapter,
    });
  }

  protected addListeners() {
    this.logger.info("Not Implemented");
  }

  protected addCommands() {
    this.botCommands = new CommandConstructor();
    this.botCommands
      .addCommand("create", "Create a new pull request")
      .addOption("create", "-l", "Link to pull request")
      .addOption("create", "-d", "Description of pull request");

    this.botCommands.describeCommands();
    this.bot.on("slash_command", async (bot, message) => {
      const [root, ...options] = message.text.split(" ");
      const opts = options.join(" ").trim();
      this.botCommands.validateCommand(root, opts);

      const developer = await this.resolveDeveloper(message);
      switch (root) {
        case "create":
          await this.createPullRequest(developer, {
            message,
            bot,
          });
      }
    });
  }

  private async resolveDeveloper(message): Promise<DeveloperEntity> {
    return new ResolveDeveloperCmd(this.ctx).execute({
      developerId: message.user_id,
      name: message.user_name,
      accessRoles: AccessRoles.Developer,
    }) as any;
  }

  private async createPullRequest(
    developer: DeveloperEntity,
    botCtx: {
      message: BotkitMessage;
      bot: BotWorker;
    }
  ) {
    const [root, ...options] = botCtx.message.text.split(" ");
    const opts = options.join(" ").trim();
    const optionValues = this.botCommands.extractOptionValues(opts);
    const pr = await new CreatePullRequestCmd(this.ctx).execute({
      link: optionValues["l"],
      prOwner: developer.developerId,
    });
    console.log(pr);
    await botCtx.bot.reply(
      botCtx.message,
      `PR created for ${developer.name} at link ${pr.link}. Current status: ${pr.status}`
    );
  }
}
