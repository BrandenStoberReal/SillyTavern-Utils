import {Logger} from '../logging/logger';
import type * as SillyTavern from '../../types/SillyTavern';

/**
 * Slash Commands utility for registering and managing SillyTavern slash commands
 */
export class SlashCommandsUtil {
    private logger: Logger;

    constructor(options?: { logger?: Logger; prefix?: string }) {
        this.logger = options?.logger ?? new Logger({
            prefix: options?.prefix ?? 'SlashCommandsUtil',
            level: Logger.getDefaultLogLevel(),
        });
    }

    /**
     * Register a new slash command
     * @param name The command name (without the slash)
     * @param callback The function to execute when the command is called
     * @param options Configuration options for the command
     */
    public registerSlashCommand(
        name: string,
        callback: (
            args: SillyTavern.NamedArguments,
            text: SillyTavern.UnnamedArguments,
        ) => string | Promise<string>,
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

            // Create the command object
            const command = (globalThis as any).SlashCommand.fromProps({
                name: name,
                callback: callback,
                aliases: options?.aliases || [],
                returns: options?.returns || `${name} command executed`,
                helpString: options?.helpString || `<div>/${name} command</div>`,
                helpStringShort: options?.helpStringShort || `/${name} command`,
            });

            // Add the command to the parser
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
            callback: (
                args: SillyTavern.NamedArguments,
                text: SillyTavern.UnnamedArguments,
            ) => string | Promise<string>;
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
     * Unregister a slash command
     * @param name The command name (without the slash) to unregister
     */
    public unregisterSlashCommand(name: string): boolean {
        try {
            // Check if SillyTavern's slash command system is available
            if (
                typeof (globalThis as any).SlashCommandParser === 'undefined' ||
                typeof (globalThis as any).SlashCommand === 'undefined'
            ) {
                this.logger.warn(`Slash command system not available, cannot unregister: /${name}`);
                return false;
            }

            // Remove the command from the parser
            const success = (globalThis as any).SlashCommandParser.removeCommand(name);

            if (success) {
                this.logger.info(`Slash command unregistered: /${name}`);
            } else {
                this.logger.warn(`Failed to unregister slash command: /${name} (not found)`);
            }

            return success;
        } catch (error) {
            this.logger.error(`Failed to unregister slash command /${name}:`, error);
            return false;
        }
    }

    /**
     * Unregister multiple slash commands at once
     * @param commandNames Array of command names to unregister
     */
    public unregisterMultipleSlashCommands(names: string[]): {
        success: number;
        failed: number;
        failedCommands: string[]
    } {
        let successCount = 0;
        const failedCommands: string[] = [];

        for (const name of names) {
            const result = this.unregisterSlashCommand(name);

            if (result) {
                successCount++;
            } else {
                failedCommands.push(name);
            }
        }

        this.logger.info(
            `Unregistered ${successCount} slash commands, ${failedCommands.length} failed: [${failedCommands.join(', ')}]`
        );

        return {
            success: successCount,
            failed: failedCommands.length,
            failedCommands,
        };
    }

    /**
     * Get all registered slash commands
     */
    public getAllCommands(): SillyTavern.SlashCommand[] {
        try {
            if (
                typeof (globalThis as any).SlashCommandParser === 'undefined' ||
                typeof (globalThis as any).SlashCommandParser.commands === 'undefined'
            ) {
                this.logger.warn('Slash command system not available');
                return [];
            }

            return (globalThis as any).SlashCommandParser.commands;
        } catch (error) {
            this.logger.error('Failed to get registered slash commands:', error);
            return [];
        }
    }
}

// Export a default instance for backward compatibility
export const slashCommandsUtil = new SlashCommandsUtil();