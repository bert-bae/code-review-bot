export enum AccessRoles {
  Admin = "Admin",
  Manager = "Manager",
  Developer = "Developer",
}

export enum PullRequestStatus {
  Open = "Open",
  Closed = "Closed",
}

export interface IReviewSurvey {
  complexity?: number;
  tests?: number;
  design?: number;
  functionality?: number;
  comments?: string;
}

export type DeveloperEntity = {
  developerId: string;
  name?: string;
  accessRoles?: AccessRoles;
};

export type PullRequestEntity = {
  prOwner: string;
  prId: string;
  reviewerId?: string;
  link: string;
  status: PullRequestStatus;
  reviewSurvey?: IReviewSurvey;
  description: string;
};
