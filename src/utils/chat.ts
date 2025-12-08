import {ISillyTavernContext} from '../types';
import {contextUtil} from './context';
import {logError} from './logging/logger';

/**
 * Chat utility for managing chat-related operations in SillyTavern
 */
export class ChatUtil {
    /**
     * Create a new instance of ChatUtil
     */
    constructor() {
        // No initialization needed
    }

    /**
     * Get the current chat metadata
     * @returns Promise resolving to the chat metadata object, or null if unavailable
     */
    public async getChatMetadata(): Promise<any> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();
            if (context.chatMetadata === undefined) {
                logError('Chat metadata is not available in the current context');
                return null;
            }
            return context.chatMetadata;
        } catch (error) {
            logError('Failed to get chat metadata:', error);
            return null;
        }
    }

    /**
     * Set a value in chat metadata
     * @param key The metadata key to set
     * @param value The value to set
     * @returns Promise that resolves when the metadata is set, or false if failed
     */
    public async setChatMetadata(key: string, value: any): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (context.chatMetadata === undefined) {
                logError('Chat metadata is not available in the current context');
                return false;
            }

            context.chatMetadata[key] = value;
            return true;
        } catch (error) {
            logError('Failed to set chat metadata:', error);
            return false;
        }
    }

    /**
     * Get a value from chat metadata
     * @param key The metadata key to retrieve
     * @returns The value stored at the key, or null if not found
     */
    public async getChatMetadataValue(key: string): Promise<any> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (context.chatMetadata === undefined) {
                logError('Chat metadata is not available in the current context');
                return null;
            }

            return context.chatMetadata[key] || null;
        } catch (error) {
            logError('Failed to get chat metadata value:', error);
            return null;
        }
    }

    /**
     * Remove a value from chat metadata
     * @param key The metadata key to remove
     * @returns Promise that resolves when the metadata is removed, or false if failed
     */
    public async removeChatMetadata(key: string): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (context.chatMetadata === undefined) {
                logError('Chat metadata is not available in the current context');
                return false;
            }

            delete context.chatMetadata[key];
            return true;
        } catch (error) {
            logError('Failed to remove chat metadata:', error);
            return false;
        }
    }

    /**
     * Update multiple values in chat metadata
     * @param updates An object with key-value pairs to update in metadata
     * @returns Promise that resolves when the metadata is updated, or false if failed
     */
    public async updateChatMetadata(updates: Record<string, any>): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (context.chatMetadata === undefined) {
                logError('Chat metadata is not available in the current context');
                return false;
            }

            for (const [key, value] of Object.entries(updates)) {
                context.chatMetadata[key] = value;
            }

            return true;
        } catch (error) {
            logError('Failed to update chat metadata:', error);
            return false;
        }
    }

    /**
     * Clear all chat metadata
     * @returns Promise that resolves when the metadata is cleared, or false if failed
     */
    public async clearChatMetadata(): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (context.chatMetadata === undefined) {
                logError('Chat metadata is not available in the current context');
                return false;
            }

            // Reset chat metadata to an empty object
            for (const key in context.chatMetadata) {
                if (context.chatMetadata.hasOwnProperty(key)) {
                    delete context.chatMetadata[key];
                }
            }

            return true;
        } catch (error) {
            logError('Failed to clear chat metadata:', error);
            return false;
        }
    }

    /**
     * Check if a key exists in chat metadata
     * @param key The metadata key to check
     * @returns Promise resolving to true if the key exists, false otherwise
     */
    public async hasChatMetadataKey(key: string): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (context.chatMetadata === undefined) {
                logError('Chat metadata is not available in the current context');
                return false;
            }

            return context.chatMetadata.hasOwnProperty(key);
        } catch (error) {
            logError('Failed to check chat metadata key:', error);
            return false;
        }
    }

    /**
     * Get the current chat ID
     * @returns Promise resolving to the current chat ID, or null if unavailable
     */
    public async getChatId(): Promise<string | null> {
        try {
            return await contextUtil.getChatId();
        } catch (error) {
            logError('Failed to get chat ID:', error);
            return null;
        }
    }

    /**
     * Get the current chat messages
     * @returns Promise resolving to the array of chat messages, or empty array if unavailable
     */
    public async getChatMessages(): Promise<ISillyTavernContext['chat']> {
        try {
            return await contextUtil.getChat();
        } catch (error) {
            logError('Failed to get chat messages:', error);
            return [];
        }
    }

    /**
     * Get the last chat message
     * @returns Promise resolving to the last chat message or undefined if no messages exist
     */
    public async getLastMessage(): Promise<ISillyTavernContext['chat'][0] | undefined> {
        try {
            return await contextUtil.getLastMessage();
        } catch (error) {
            logError('Failed to get last chat message:', error);
            return undefined;
        }
    }

    /**
     * Get the number of chat messages
     * @returns Promise resolving to the number of chat messages, or 0 if unavailable
     */
    public async getChatMessageCount(): Promise<number> {
        try {
            const chat = await this.getChatMessages();
            return chat.length;
        } catch (error) {
            logError('Could not get chat message count:', error);
            return 0;
        }
    }

    /**
     * Get a specific chat message by index
     * @param index The index of the message to retrieve
     * @returns Promise resolving to the chat message or undefined if not found
     */
    public async getChatMessage(index: number): Promise<ISillyTavernContext['chat'][0] | undefined> {
        try {
            return await contextUtil.getChatMessage(index);
        } catch (error) {
            logError(`Could not get chat message at index ${index}:`, error);
            return undefined;
        }
    }

    /**
     * Add a new message to the chat
     * @param message The message object to add
     * @returns Promise that resolves when the message is added, or false if failed
     */
    public async addMessage(message: ISillyTavernContext['chat'][0]): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (typeof context.addOneMessage !== 'function') {
                logError('addOneMessage function is not available in the current context');
                return false;
            }

            context.addOneMessage(message);
            return true;
        } catch (error) {
            logError('Failed to add message to chat:', error);
            return false;
        }
    }

    /**
     * Delete the last message from the chat
     * @returns Promise that resolves when the last message is deleted, or false if failed
     */
    public async deleteLastMessage(): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (typeof context.deleteLastMessage !== 'function') {
                logError('deleteLastMessage function is not available in the current context');
                return false;
            }

            await context.deleteLastMessage();
            return true;
        } catch (error) {
            logError('Failed to delete last message:', error);
            return false;
        }
    }

    /**
     * Get user messages from the chat
     * @returns Promise resolving to an array of user messages, or empty array if unavailable
     */
    public async getUserMessages(): Promise<ISillyTavernContext['chat'][0][]> {
        try {
            const chat = await this.getChatMessages();
            return chat.filter(message => message.is_user);
        } catch (error) {
            logError('Could not get user messages:', error);
            return [];
        }
    }

    /**
     * Get character messages from the chat
     * @returns Promise resolving to an array of character messages, or empty array if unavailable
     */
    public async getCharacterMessages(): Promise<ISillyTavernContext['chat'][0][]> {
        try {
            const chat = await this.getChatMessages();
            return chat.filter(message => !message.is_user && !message.is_system);
        } catch (error) {
            logError('Could not get character messages:', error);
            return [];
        }
    }

    /**
     * Get system messages from the chat
     * @returns Promise resolving to an array of system messages, or empty array if unavailable
     */
    public async getSystemMessages(): Promise<ISillyTavernContext['chat'][0][]> {
        try {
            const chat = await this.getChatMessages();
            return chat.filter(message => message.is_system === true);
        } catch (error) {
            logError('Could not get system messages:', error);
            return [];
        }
    }

    /**
     * Count user messages in the chat
     * @returns Promise resolving to the number of user messages, or 0 if unavailable
     */
    public async getUserMessageCount(): Promise<number> {
        try {
            const userMessages = await this.getUserMessages();
            return userMessages.length;
        } catch (error) {
            logError('Could not get user message count:', error);
            return 0;
        }
    }

    /**
     * Count character messages in the chat
     * @returns Promise resolving to the number of character messages, or 0 if unavailable
     */
    public async getCharacterMessageCount(): Promise<number> {
        try {
            const characterMessages = await this.getCharacterMessages();
            return characterMessages.length;
        } catch (error) {
            logError('Could not get character message count:', error);
            return 0;
        }
    }

    /**
     * Save the current chat
     * @returns Promise that resolves when the chat is saved, or false if failed
     */
    public async saveChat(): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (typeof context.saveChat !== 'function') {
                logError('saveChat function is not available in the current context');
                return false;
            }

            await context.saveChat();
            return true;
        } catch (error) {
            logError('Failed to save chat:', error);
            return false;
        }
    }

    /**
     * Reload the current chat
     * @returns Promise that resolves when the chat is reloaded, or false if failed
     */
    public async reloadCurrentChat(): Promise<boolean> {
        try {
            await contextUtil.reloadCurrentChat();
            return true;
        } catch (error) {
            logError('Failed to reload current chat:', error);
            return false;
        }
    }

    /**
     * Clear the current chat
     * @returns Promise that resolves when the chat is cleared, or false if failed
     */
    public async clearChat(): Promise<boolean> {
        try {
            await contextUtil.clearChat();
            return true;
        } catch (error) {
            logError('Failed to clear chat:', error);
            return false;
        }
    }

    /**
     * Get the current max context length
     * @returns Promise resolving to the max context length, or 0 if unavailable
     */
    public async getMaxContextLength(): Promise<number> {
        try {
            return await contextUtil.getMaxContext();
        } catch (error) {
            logError('Failed to get max context length:', error);
            return 0;
        }
    }

    /**
     * Get token count for a string
     * @param str The string to count tokens for
     * @param padding Optional padding value
     * @returns Promise resolving to the token count, or 0 if unavailable
     */
    public async getTokenCount(str: string, padding?: number): Promise<number> {
        try {
            return await contextUtil.getTokenCount(str, padding);
        } catch (error) {
            logError('Failed to get token count:', error);
            return 0;
        }
    }

    /**
     * Print all messages in the current chat (for debugging)
     * @returns Promise that resolves when messages are printed, or false if failed
     */
    public async printMessages(): Promise<boolean> {
        try {
            const context = await contextUtil.fetchSillyTavernContext();

            if (typeof context.printMessages !== 'function') {
                logError('printMessages function is not available in the current context');
                return false;
            }

            await context.printMessages();
            return true;
        } catch (error) {
            logError('Failed to print messages:', error);
            return false;
        }
    }
}

// Export a default instance for convenience
export const chatUtil = new ChatUtil();