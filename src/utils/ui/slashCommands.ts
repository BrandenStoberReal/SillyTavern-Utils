import {Logger} from '../logging/logger';

/**
 * Slash Commands utility for registering and managing SillyTavern slash commands
 */
export class SlashCommandsUtil {
    private static _instance: SlashCommandsUtil;
    private logger: Logger;

    private constructor() {
        this.logger = new Logger({
            prefix: 'SlashCommandsUtil',
            level: Logger.getDefaultLogLevel(),
        });
    }

    /**
     * Get the singleton instance of SlashCommandsUtil
     */
    public static getInstance(): SlashCommandsUtil {
        if (!SlashCommandsUtil._instance) {
            SlashCommandsUtil._instance = new SlashCommandsUtil();
        }
        return SlashCommandsUtil._instance;
    }

    /**
     * Register a new slash command
     * @param name The command name (without the slash)
     * @param callback The function to execute when the command is called
     * @param options Configuration options for the command
     */
    public registerSlashCommand(
        name: string,
        callback: (namedArgs: any, unnamedArgs: any, ...additionalArgs: any[]) => any,
        options?: {
            aliases?: string[];
            returns?: string;
            helpString?: string;
            helpStringShort?: string;
        }
    ): boolean {
        try {
            // Check if SillyTavern's slash command system is available
            if (
                typeof (globalThis as any).SlashCommandParser === 'undefined' ||
                typeof (globalThis as any).SlashCommand === 'undefined'
            ) {
                this.logger.warn(`Slash command system not available, cannot register: /${name}`);
                return false;
            }

            const command = (globalThis as any).SlashCommand.fromProps({
                name: name,
                callback: callback,
                aliases: options?.aliases || [],
                returns: options?.returns || `${name} command executed`,
                helpString: options?.helpString || `<div>/${name} command</div>`,
                helpStringShort: options?.helpStringShort || `/${name} command`,
            });

            (globalThis as any).SlashCommandParser.addCommandObject(command);
            this.logger.info(`Slash command registered: /${name}`);

            return true;
        } catch (error) {
            this.logger.error(`Failed to register slash command /${name}:`, error);
            return false;
        }
    }

    /**
     * Register multiple slash commands at once
     * @param commands Array of command configurations
     */
    public registerMultipleSlashCommands(
        commands: {
            name: string;
            callback: (namedArgs: any, unnamedArgs: any, ...additionalArgs: any[]) => any;
            options?: {
                aliases?: string[];
                returns?: string;
                helpString?: string;
                helpStringShort?: string;
            };
        }[]
    ): { success: number; failed: number; failedCommands: string[] } {
        let successCount = 0;
        const failedCommands: string[] = [];

        for (const command of commands) {
            const result = this.registerSlashCommand(
                command.name,
                command.callback,
                command.options
            );

            if (result) {
                successCount++;
            } else {
                failedCommands.push(command.name);
            }
        }

        this.logger.info(
            `Registered ${successCount} slash commands, ${failedCommands.length} failed: [${failedCommands.join(', ')}]`
        );

        return {
            success: successCount,
            failed: failedCommands.length,
            failedCommands,
        };
    }
}

// Export a singleton instance getter for convenience that ensures proper initialization
export const slashCommandsUtil = SlashCommandsUtil.getInstance();