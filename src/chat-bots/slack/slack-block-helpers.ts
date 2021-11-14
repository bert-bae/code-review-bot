import { BotkitMessage } from "botkit";
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
            text: "Assign Reviewer",
          },
          value: `${pullRequest.prOwner}::${pullRequest.prId}`,
          action_id: BlockCommands.AssignPrReviewer,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Review",
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

export const updatePrBlocks = (
  blocks: Record<string, any>[],
  actionId: BlockCommands,
  updatedBlock: Record<string, any>
) => {
  const blockCopy = [...blocks];
  const updateIndex = blockCopy.findIndex(
    (block) => block.action_id === actionId
  );
  console.log(JSON.stringify(blocks, null, 2));
  if (updateIndex === -1) {
    throw new Error(`Block with action ${actionId} does not exist`);
  }

  blockCopy[updateIndex] = {
    ...blockCopy[updateIndex],
    ...updatedBlock,
  };

  return [...blockCopy];
};

export const updateAssignedReviewerBlock = (
  blocks: Record<string, any>[],
  developers: string
) => {
  const blockCopy = [...blocks];
  const lastIndex = blockCopy.length - 1;
  const blockToUpdate = blockCopy[lastIndex];
  blockToUpdate.elements = blockToUpdate.elements.map((b) => {
    if (b.action_id === BlockCommands.AssignPrReviewer) {
      return {
        ...b,
        text: {
          type: "plain_text",
          text: "Assigned",
        },
      };
    }
    return b;
  });

  return blockCopy;
};
