import { DeveloperEntity, PullRequestEntity } from "../../types";

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
        value: "ViewPrLink",
        url: `${pullRequest.link}`,
        action_id: "ViewPrLink",
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
          action_id: "AssignPrReviewer",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Review PR",
          },
          value: `${pullRequest.prOwner}::${pullRequest.prId}`,
          action_id: "ReviewPullRequest",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: `Alert ${creator.name}`,
          },
          value: `${pullRequest.prOwner}::${pullRequest.prId}`,
          action_id: "AlertPrCreator",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Mark as Complete",
          },
          value: `${pullRequest.prOwner}::${pullRequest.prId}`,
          action_id: "MarkAsComplete",
        },
      ],
    },
  ],
});
