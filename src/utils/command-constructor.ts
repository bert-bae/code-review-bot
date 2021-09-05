type CliCommand = {
  description?: string;
  options: Record<
    string,
    {
      description?: string;
      trigger?: string;
    }
  >;
};

export class CommandConstructor {
  private commands: Record<string, CliCommand> = {};
  constructor() {}

  public addCommand(cmd, description) {
    const stripped = cmd.replace(/\-/g, "");
    this.commands[stripped] = {
      description,
      options: {},
    };
    return this;
  }

  public addOption(cmd, option, description) {
    const stripped = option.replace(/\-/g, "");
    if (!this.commands[cmd]) {
      throw new Error("Not found");
    }

    this.commands[cmd].options[stripped] = {
      description,
      trigger: `-${stripped}`,
    };
    return this;
  }

  public describeCommands() {
    for (const cmd in this.commands) {
      const cmdObj = this.commands[cmd];
      console.log("---------------------------");
      console.log(`Command: ${cmd}`);
      for (const option in cmdObj.options) {
        const cmdOption = cmdObj.options[option];
        console.log(cmdOption.trigger, ` ${cmdOption.description}`);
      }
    }
    return this;
  }

  public validateCommand(cmd: string, options: string) {
    const command = this.commands[cmd];
    if (!command) {
      throw new Error("Command not found");
    }
    options &&
      options
        .split("-")
        .filter((x) => !!x)
        .forEach((pair) => {
          const [trigger] = pair.split(" ");
          if (!command.options[trigger]) {
            throw new Error(`Command ${cmd} option ${trigger} is not valid`);
          }
        });
  }

  public extractOptionValues(options: string) {
    const result = {};
    options
      .split("-")
      .filter((x) => !!x)
      .forEach((pair) => {
        const [trigger, value] = pair.split(" ");
        result[trigger] = value;
      });

    return result;
  }
}
