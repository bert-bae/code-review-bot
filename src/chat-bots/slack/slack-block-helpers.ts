import { DeveloperEntity, PullRequestEntity } from "../../types";

export enum BlockCommands {
  ViewPrLink = "ViewPrLink",
  AssignPrReviewer = "AssignPrReviewer",
  ReviewPullRequest = "ReviewPullRequest",
  AlertPrCreator = "AlertPrCreator",
  MarkAsComplete = "MarkAsComplete",
}

export const createPrBlocks = (
  creator: DeveloperEntity,
  pullRequest: PullRequestEntity
) => ({
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Pull request created by ${creator.name}. Current status is ${
          pullRequest.status
        }.${pullRequest.description ? ` ${pullRequest.description}.` : ""}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Link to pull request",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "View pull request",
        },
        value: `${pullRequest.prOwner}::${pullRequest.prId}`,
        url: `${pullRequest.link}`,
        action_id: BlockCommands.ViewPrLink,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Pick-up PR",
          },
          value: `${pullRequest.prOwner}::${pullRequest.prId}`,
          action_id: BlockCommands.AssignPrReviewer,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Review PR",
          },
          value: `${pullRequest.prOwner}::${pullRequest.prId}`,
          action_id: BlockCommands.ReviewPullRequest,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: `Alert ${creator.name}`,
          },
          value: `${pullRequest.prOwner}::${pullRequest.prId}`,
          action_id: BlockCommands.AlertPrCreator,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Mark as Complete",
          },
          value: `${pullRequest.prOwner}::${pullRequest.prId}`,
          action_id: BlockCommands.MarkAsComplete,
        },
      ],
    },
  ],
});
