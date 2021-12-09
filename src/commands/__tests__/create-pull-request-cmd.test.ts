import {
  CreatePullRequestCmd,
  CreatePullRequestCmdInput,
} from "../create-pull-request-cmd";
import { mockContext, mockPullRequestModel } from "../../test-utils";

const mockCtx = mockContext();
const cmd = new CreatePullRequestCmd(mockCtx);

describe("[Command] CreatePullRequestCmd", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create developer with entity", async () => {
    const input: CreatePullRequestCmdInput = {
      prOwner: "1",
      description: "Test",
      link: "http://crbot.ca",
    };

    jest.spyOn(mockPullRequestModel, "create").mockResolvedValue(input);

    const result = await cmd.execute(input);
    expect(mockCtx.models.pullRequests.create).toHaveBeenCalledWith(input);
    expect(result).toMatchObject(input);
  });
});
