import {
  GetPullRequestCmd,
  GetPullRequestCmdInput,
} from "../get-pull-request-cmd";
import { mockContext, mockPullRequestModel } from "../../test-utils";
import { PullRequestEntity, PullRequestStatus } from "../../types";

const mockCtx = mockContext();
const cmd = new GetPullRequestCmd(mockCtx);

describe("[Command] CreatePullRequestCmd", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create developer with entity", async () => {
    const input: GetPullRequestCmdInput = {
      prId: "prId1",
      developerId: "devId1",
    };

    const expected: PullRequestEntity = {
      prId: input.prId,
      prOwner: input.developerId,
      description: "Example description",
      link: "http://crbot.ca",
      status: PullRequestStatus.Open,
    };
    jest.spyOn(mockPullRequestModel, "getOne").mockResolvedValue(expected);

    const result = await cmd.execute(input);
    expect(result).toMatchObject(expected);
  });
});
