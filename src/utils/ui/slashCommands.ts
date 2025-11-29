import {Logger} from '../logging';

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

    /**
     * Check if the slash command system is available
     */
    public isSlashCommandSystemAvailable(): boolean {
        return (
            typeof (globalThis as any).SlashCommandParser !== 'undefined' &&
            typeof (globalThis as any).SlashCommand !== 'undefined'
        );
    }

    /**
     * Unregister a slash command (if supported by SillyTavern)
     * @param name The command name to unregister
     */
    public unregisterSlashCommand(name: string): boolean {
        try {
            if (!this.isSlashCommandSystemAvailable()) {
                this.logger.warn(`Slash command system not available, cannot unregister: /${name}`);
                return false;
            }

            // Note: This functionality depends on SillyTavern's implementation
            // If SillyTavern doesn't support unregistering, this would be a no-op
            const result = (globalThis as any).SlashCommandParser.removeCommand
                ? (globalThis as any).SlashCommandParser.removeCommand(name)
                : false;

            if (result) {
                this.logger.info(`Slash command unregistered: /${name}`);
            } else {
                this.logger.warn(`Could not unregister slash command: /${name} (method may not be supported)`);
            }

            return result;
        } catch (error) {
            this.logger.error(`Failed to unregister slash command /${name}:`, error);
            return false;
        }
    }

    /**
     * Execute a slash command programmatically
     * @param commandString The full command string (e.g. "/help test")
     */
    public async executeSlashCommand(commandString: string): Promise<any> {
        try {
            if (!this.isSlashCommandSystemAvailable()) {
                throw new Error('Slash command system not available');
            }

            // Execute the command using SillyTavern's system
            const result = await (globalThis as any).SlashCommandParser.executeCommand(commandString);
            return result;
        } catch (error) {
            this.logger.error(`Failed to execute slash command "${commandString}":`, error);
            throw error;
        }
    }

    /**
     * Get list of currently registered commands (if supported by SillyTavern)
     */
    public getRegisteredCommands(): string[] {
        try {
            if (!this.isSlashCommandSystemAvailable()) {
                return [];
            }

            // This depends on SillyTavern's implementation
            if ((globalThis as any).SlashCommandParser.getCommands) {
                const commands = (globalThis as any).SlashCommandParser.getCommands();
                return Array.isArray(commands) ? commands.map((cmd: any) => cmd.name) : [];
            }

            return [];
        } catch (error) {
            this.logger.error('Failed to get registered commands:', error);
            return [];
        }
    }
}

// Export a singleton instance for convenience
export const slashCommandsUtil = SlashCommandsUtil.getInstance();