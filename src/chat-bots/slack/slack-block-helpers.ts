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
        text: `Pull request created by ${creator.name}. Current status is ${pullRequest.status}`,
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
          text: "View",
        },
        value: `${pullRequest.link}`,
        action_id: "button-action",
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
          value: "AssignPrReviewer",
          action_id: "AssignPrReviewer",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Review PR",
          },
          value: "ReviewPullRequest",
          action_id: "ReviewPullRequest",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: `Alert ${creator.name}`,
          },
          value: "AlertPrCreator",
          action_id: "AlertPrCreator",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Mark as Complete",
          },
          value: "MarkAsComplete",
          action_id: "MarkAsComplete",
        },
      ],
    },
  ],
});
