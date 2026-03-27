export const terminalTool = {
  type: "function",
  function: {
    name: "execute_command",
    description: "Executes a shell command in the terminal. This tool will always ask the user for manual confirmation before running the command.",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The full shell command to execute (e.g., 'ls -la', 'npm install').",
        },
      },
      required: ["command"],
    },
  },
  execute: async (args: { command: string }) => {
    console.log(`\n[Tool Request] The model wants to execute: \x1b[33m${args.command}\x1b[0m`);
    
    // Bun's built-in prompt for terminal interaction
    const answer = prompt("Do you want to execute this command? (y/N):", "n");

    if (answer?.toLowerCase() !== "y") {
      return JSON.stringify({
        success: false,
        message: "Command execution was rejected by the user.",
      });
    }

    try {
      console.log(`Executing: ${args.command}...`);
      
      // Using Bun's shell execution
      // @ts-ignore - Bun.$ handles strings/templates
      const result = await Bun.$`${{ raw: args.command }}`.quiet().nothrow();

      return JSON.stringify({
        success: result.exitCode === 0,
        exitCode: result.exitCode,
        stdout: result.stdout.toString(),
        stderr: result.stderr.toString(),
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        message: `Execution error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};
