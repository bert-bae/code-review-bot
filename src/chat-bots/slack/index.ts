import { Botkit, BotkitMessage, BotWorker } from "botkit";
import {
  SlackAdapter,
  SlackEventMiddleware,
  SlackMessageTypeMiddleware,
} from "botbuilder-adapter-slack";
import { BaseBot, BotContext } from "../base-bot";
import { CommandConstructor } from "../../utils/command-constructor";
import {
  CreatePullRequestCmd,
  GetDeveloperCmd,
  GetPullRequestsByDeveloperCmd,
  ResolveDeveloperCmd,
} from "../../commands";
import { AccessRoles, DeveloperEntity, PullRequestStatus } from "../../types";
import { createPrBlocks } from "./slack-block-helpers";

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
      .addOption("create", "-d", "Description of pull request")
      .addCommand("list", "List all pull requests that are currently active");

    this.botCommands.describeCommands();
    this.bot.on("block_actions", async (bot, message) => {
      console.log("wtf");
      console.log(JSON.stringify(message, null, 2));
    });

    this.bot.on("slash_command", async (bot, message) => {
      const [root, ...options] = message.text.split(" ");
      const opts = options.join(" ").trim();
      this.botCommands.validateCommand(root, opts);
      const optionValues = this.botCommands.extractOptionValues(opts);

      const developer = await this.resolveDeveloper(message);
      switch (root) {
        case "create":
          await this.createPullRequest(optionValues, developer, {
            message,
            bot,
          });
          break;
        case "list":
          await this.listPullRequests(optionValues, developer, {
            message,
            bot,
          });
          break;
        default:
          await bot.reply(message, `${root} is not a valid command`);
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
    optInput: Record<string, any>,
    developer: DeveloperEntity,
    botCtx: {
      message: BotkitMessage;
      bot: BotWorker;
    }
  ) {
    const pr = await new CreatePullRequestCmd(this.ctx).execute({
      link: optInput["l"],
      description: optInput["d"] || "",
      prOwner: developer.developerId,
    });
    await botCtx.bot.reply(botCtx.message, createPrBlocks(developer, pr));
  }

  private async listPullRequests(
    optInput: Record<string, any>,
    developer: DeveloperEntity,
    botCtx: {
      message: BotkitMessage;
      bot: BotWorker;
    }
  ) {
    const prs = await new GetPullRequestsByDeveloperCmd(this.ctx).execute({
      developerId: developer.developerId,
    });
    await Promise.all(
      prs.map(async (pr) => {
        if (pr.status === PullRequestStatus.Closed) {
          return;
        }

        const reviewer =
          pr.reviewerId &&
          (await new GetDeveloperCmd(this.ctx).execute({
            developerId: pr.reviewerId,
          }));
        await botCtx.bot.reply(
          botCtx.message,
          `Pull request link: ${pr.link}. Status is currently ${
            pr.status
          }. Reviewer is currently ${reviewer ? reviewer.name : "unassigned"}.`
        );
      })
    );
  }
}
