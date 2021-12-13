import {
  DeveloperEntity,
  PullRequestEntity,
  PullRequestKeys,
} from "../../types";

export enum SlackCommands {
  ViewPrLink = "ViewPrLink",
  AssignPrReviewer = "AssignPrReviewer",
  UnassignPrReviewer = "UnassignPrReviewer",
  ReviewPullRequest = "ReviewPullRequest",
  SubmitPullRequestReview = "SubmitPullRequestReview",
  AlertPrCreator = "AlertPrCreator",
  MarkAsComplete = "MarkAsComplete",
}

export const assignReviewerAction = (pr: PullRequestKeys) => {
  return {
    type: "button",
    text: {
      type: "plain_text",
      text: "Assign Reviewer",
    },
    value: `${pr.prOwner}::${pr.prId}`,
    action_id: SlackCommands.AssignPrReviewer,
  };
};

export const reviewPrAction = (pr: PullRequestKeys) => {
  return {
    type: "button",
    text: {
      type: "plain_text",
      text: "Review",
    },
    value: `${pr.prOwner}::${pr.prId}`,
    action_id: SlackCommands.ReviewPullRequest,
  };
};

export const alertPrOwnerAction = (
  pr: PullRequestKeys,
  creator: DeveloperEntity
) => {
  return {
    type: "button",
    text: {
      type: "plain_text",
      text: `Alert ${creator.name}`,
    },
    value: `${pr.prOwner}::${pr.prId}`,
    action_id: SlackCommands.AlertPrCreator,
  };
};

export const markAsCompleteAction = (pr: PullRequestKeys) => {
  return {
    type: "button",
    text: {
      type: "plain_text",
      text: "Mark as Complete",
    },
    value: `${pr.prOwner}::${pr.prId}`,
    action_id: SlackCommands.MarkAsComplete,
  };
};

export const unassignReviewerAction = (
  pr: PullRequestKeys,
  developer: DeveloperEntity
) => {
  return {
    type: "button",
    text: {
      type: "plain_text",
      text: `Assigned to ${developer.name || developer.developerId}`,
    },
    value: `${pr.prOwner}::${pr.prId}`,
    action_id: SlackCommands.UnassignPrReviewer,
  };
};

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
        action_id: SlackCommands.ViewPrLink,
      },
    },
    {
      type: "actions",
      elements: [
        assignReviewerAction(pullRequest),
        reviewPrAction(pullRequest),
        // alertPrOwnerAction(pullRequest, creator),
        // markAsCompleteAction(pullRequest),
      ],
    },
  ],
});

export const updateBlockActions = (
  blocks: Record<string, any>[],
  blockCommand: SlackCommands,
  newBlockProperties: Record<string, any>
) => {
  const blockCopy = [...blocks];
  const lastIndex = blockCopy.length - 1;
  const blockToUpdate = blockCopy[lastIndex];
  blockToUpdate.elements = blockToUpdate.elements.map((b) => {
    if (b.action_id === blockCommand) {
      return {
        ...b,
        ...newBlockProperties,
      };
    }
    return b;
  });

  return blockCopy;
};
