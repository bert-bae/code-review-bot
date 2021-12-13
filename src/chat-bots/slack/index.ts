import axios from "axios";
import { Botkit, BotkitMessage } from "botkit";
import {
  SlackAdapter,
  SlackEventMiddleware,
  SlackMessageTypeMiddleware,
  SlackBotWorker,
} from "botbuilder-adapter-slack";
import { BaseBot } from "../base-bot";
import { CommandConstructor } from "../../utils/command-constructor";
import {
  CommandContext,
  CreatePullRequestCmd,
  GetDeveloperCmd,
  GetPullRequestsByDeveloperCmd,
  ResolveDeveloperCmd,
  UpdatePullRequestCmd,
} from "../../commands";
import { AccessRoles, DeveloperEntity, PullRequestStatus } from "../../types";
import {
  assignReviewerAction,
  SlackCommands,
  createPrBlocks,
  unassignReviewerAction,
  updateBlockActions,
} from "./slack-block-helpers";
import {
  createReviewDialog,
  SlackDialogSubmitPullRequestState,
} from "./slack-dialog-helpers";

type SlackBotContext = {
  message: BotkitMessage;
  bot: SlackBotWorker;
};

export type SlackCommandHandler = (
  botCtx: SlackBotContext,
  developer: DeveloperEntity,
  optInput?: Record<string, any>
) => Promise<any>;

export class SlackBot extends BaseBot {
  private ctx: CommandContext;
  private logger: CommandContext["logger"];
  private commands: CommandConstructor<SlackCommandHandler>;
  private bot: Botkit;
  private actionValueSeparator: string = "::";

  constructor(ctx: CommandContext) {
    super();
    this.ctx = ctx;
    this.logger = ctx.logger;
    this.initializeBot();
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

  protected addCommands() {
    this.commands = new CommandConstructor<SlackCommandHandler>()
      // Block commands
      .addCommand({
        name: SlackCommands.AssignPrReviewer,
        description: "Assign pull request reviewer",
        command: this.assignReviewer.bind(this),
      })
      .addCommand({
        name: SlackCommands.UnassignPrReviewer,
        description: "Unassign pull request reviewer",
        command: this.unassignReviewer.bind(this),
      })
      .addCommand({
        name: SlackCommands.ReviewPullRequest,
        description: "Start the pull request review process",
        command: this.openPullRequestReview.bind(this),
      })
      // Slash commands
      .addCommand({
        name: "create",
        description: "Create a new pull request",
        command: this.createPullRequest.bind(this),
      })
      .addOption("create", "-l", "Link to pull request")
      .addOption("create", "-d", "Description of pull request")
      .addCommand({
        name: "list",
        description: "List all pull requests that are currently active",
        command: this.listPullRequests.bind(this),
      })
      // Dialog commands
      .addCommand({
        name: SlackCommands.SubmitPullRequestReview,
        description: "Submit the review for the pull request",
        command: this.submitPullRequestReview.bind(this),
      });
    this.commands.describeCommands();

    this.bot.on("slash_command", async (bot, message) => {
      const [commandName, ...options] = message.text.split(" ");
      const opts = options.join(" ").trim();

      const optionValues = this.commands.extractOptionValues(opts);
      const developer = await this.resolveDeveloper(
        message.user_id,
        message.user_name
      );

      await this.executeCommand(
        commandName,
        { bot: bot as SlackBotWorker, message },
        developer,
        optionValues
      );
    });

    this.bot.on("block_actions", async (bot, message) => {
      const action = message.actions[0];
      const commandName = action.action_id;
      const developer = await this.resolveDeveloper(message.user);
      await this.executeCommand(
        commandName,
        { bot: bot as SlackBotWorker, message },
        developer
      );
    });

    this.bot.on("dialog_submission", async (bot, message) => {
      const developer = await this.resolveDeveloper(message.user);
      const { command } = JSON.parse(message.state);
      await this.executeCommand(
        command,
        { bot: bot as SlackBotWorker, message },
        developer
      );
    });
  }

  protected async resolveDeveloper(
    id: string,
    name?: string
  ): Promise<DeveloperEntity> {
    return new ResolveDeveloperCmd(this.ctx).execute({
      developerId: id,
      name,
      accessRoles: AccessRoles.Developer,
    }) as any;
  }

  protected async createPullRequest(
    botCtx: SlackBotContext,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  ) {
    const pr = await new CreatePullRequestCmd(this.ctx).execute({
      link: optInput["l"],
      description: optInput["d"] || "",
      prOwner: developer.developerId,
    });
    await botCtx.bot.reply(botCtx.message, createPrBlocks(developer, pr));
  }

  protected async listPullRequests(
    botCtx: SlackBotContext,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  ) {
    const prs = await new GetPullRequestsByDeveloperCmd(this.ctx).execute({
      developerId: developer.developerId,
    });
    await Promise.all(
      prs.map(async (pr) => {
        if (pr.status === PullRequestStatus.Closed) {
          return;
        }

        const reviewer = await new GetDeveloperCmd(this.ctx).execute({
          developerId: pr.reviewerId,
        });
        await botCtx.bot.reply(
          botCtx.message,
          `Pull request link: ${pr.link}. Status is currently ${
            pr.status
          }. Reviewer is currently ${
            reviewer ? reviewer.name || reviewer.developerId : "unassigned"
          }.`
        );
      })
    );
  }

  protected async assignReviewer(
    botCtx: SlackBotContext,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  ) {
    const { response_url } = botCtx.message;
    const [prOwnerId, prId] = this.getActionValue(botCtx.message);

    await new UpdatePullRequestCmd(this.ctx).execute({
      developerId: prOwnerId,
      prId,
      reviewerId: developer.developerId,
    });
    await this.updateMessageBlocks(
      response_url,
      updateBlockActions(
        botCtx.message.message.blocks,
        SlackCommands.AssignPrReviewer,
        unassignReviewerAction({ prOwner: prOwnerId, prId }, developer)
      )
    );
  }

  protected async unassignReviewer(
    botCtx: SlackBotContext,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  ) {
    const { response_url } = botCtx.message;
    const [prOwnerId, prId] = this.getActionValue(botCtx.message);

    await new UpdatePullRequestCmd(this.ctx).execute({
      developerId: prOwnerId,
      prId,
      reviewerId: "",
    });
    await this.updateMessageBlocks(
      response_url,
      updateBlockActions(
        botCtx.message.message.blocks,
        SlackCommands.UnassignPrReviewer,
        assignReviewerAction({ prOwner: prOwnerId, prId })
      )
    );
  }

  protected async openPullRequestReview(
    botCtx: SlackBotContext,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  ) {
    const [prOwnerId, prId] = this.getActionValue(botCtx.message);
    await botCtx.bot.replyWithDialog(botCtx.message, createReviewDialog(prId));
  }

  protected async submitPullRequestReview(
    botCtx: SlackBotContext,
    developer: DeveloperEntity,
    optInput: Record<string, any>
  ) {
    const state = this.getDialogSubmitState<SlackDialogSubmitPullRequestState>(
      botCtx.message
    );
    const submission = botCtx.message.submission;
    console.log("----> State");
    console.log(state);

    console.log("----> Submission");
    console.log(submission);
    // await botCtx.bot.replyWithDialog(botCtx.message, createReviewDialog(prId))
    // Save review and update the slack message to show Completed
  }

  private async executeCommand(
    command: string,
    botCtx: SlackBotContext,
    developer: DeveloperEntity,
    options?: Record<string, any>
  ) {
    try {
      const handler = this.commands.getHandler(command);
      this.logger.info(
        `Executing command ${command} for developer ${developer.developerId}`
      );

      await handler(botCtx, developer, options || {});
    } catch (err) {
      this.logger.error(`Error occurred executing ${command}`, err);
      await botCtx.bot.reply(
        botCtx.message,
        `${command} is not a valid command`
      );
    }
  }

  private async updateMessageBlocks(responseUrl: string, blocks: any[]) {
    await axios.post(responseUrl, {
      blocks,
    });
  }

  private getActionValue(message: BotkitMessage): [string, string] {
    const action = message.actions[0];
    return action.value.split(this.actionValueSeparator);
  }

  private getDialogSubmitState<T>(message: BotkitMessage): T {
    const state = JSON.parse(message.state);
    return state as T;
  }
}
