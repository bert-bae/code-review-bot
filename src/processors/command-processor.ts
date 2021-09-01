import { BaseCommand, CommandContext } from "../commands";

export const commandProcessor =
  (context: CommandContext) =>
  (command: BaseCommand) =>
  async (req, res, next) => {
    const { body, params, query, headers } = req;
    try {
      const providerResult = await command.execute({
        ...(query || {}),
        ...(params || {}),
        ...(body || {}),
      });
      res.status(200).json({ success: true, data: providerResult || {} });
    } catch (error) {
      context.logger.error("Server error", error);
      res.status(500).json({ success: false, error });
    }
  };
