import {ISillyTavernContext} from '../types';

/**
 * Context utility for interacting with SillyTavern context and reading specific data
 */
export class ContextUtil {
    private static _instance: ContextUtil;

    /**
     * Get the singleton instance of ContextUtil
     */
    public static getInstance(): ContextUtil {
        if (!ContextUtil._instance) {
            ContextUtil._instance = new ContextUtil();
        }
        return ContextUtil._instance;
    }

    /**
     * Fetch the current SillyTavern context
     * @returns Promise resolving to the current context
     */
    public async fetchSillyTavernContext(): Promise<ISillyTavernContext> {
        // Try to get the context from the global window object
        if (typeof window !== 'undefined' && (window as any).SillyTavern) {
            const context = (window as any).SillyTavern;
            if (context) {
                return context;
            }
        }

        // Try to get the context from the context property if available
        if (typeof window !== 'undefined' && (window as any).context) {
            const context = (window as any).context;
            if (context) {
                return context;
            }
        }

        // For server-side or when context is not available globally, try to import dynamically
        // This might be called from an extension or different context
        try {
            // Attempt to access the context in different possible locations
            if (typeof global !== 'undefined' && (global as any).SillyTavern) {
                const context = (global as any).SillyTavern;
                if (context) {
                    return context;
                }
            }
        } catch (error) {
            console.warn('Could not access global context:', error);
        }

        throw new Error('SillyTavern context is not available');
    }

    /**
     * Read the current chat
     */
    public async getChat(): Promise<ISillyTavernContext['chat']> {
        const context = await this.fetchSillyTavernContext();
        return context.chat;
    }

    /**
     * Read the current characters
     */
    public async getCharacters(): Promise<ISillyTavernContext['characters']> {
        const context = await this.fetchSillyTavernContext();
        return context.characters;
    }

    /**
     * Read the current groups
     */
    public async getGroups(): Promise<ISillyTavernContext['groups']> {
        const context = await this.fetchSillyTavernContext();
        return context.groups;
    }

    /**
     * Get the current user's name
     */
    public async getUserName(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        return context.name1;
    }

    /**
     * Get the current character's name
     */
    public async getCharacterName(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        return context.name2;
    }

    /**
     * Get the current character ID
     */
    public async getCharacterId(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        return context.characterId;
    }

    /**
     * Get the current group ID
     */
    public async getGroupId(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        return context.groupId;
    }

    /**
     * Get the current chat ID
     */
    public async getChatId(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        return context.chatId;
    }

    /**
     * Get the current max context length
     */
    public async getMaxContext(): Promise<number> {
        const context = await this.fetchSillyTavernContext();
        return context.maxContext;
    }

    /**
     * Get the chat metadata
     */
    public async getChatMetadata(): Promise<any> {
        const context = await this.fetchSillyTavernContext();
        return context.chatMetadata;
    }

    /**
     * Get extension settings
     */
    public async getExtensionSettings(): Promise<ISillyTavernContext['extensionSettings']> {
        const context = await this.fetchSillyTavernContext();
        return context.extensionSettings;
    }

    /**
     * Check if currently in a group chat
     */
    public async isInGroupChat(): Promise<boolean> {
        const context = await this.fetchSillyTavernContext();
        return Boolean(context.groupId);
    }

    /**
     * Get specific chat message by index
     */
    public async getChatMessage(index: number): Promise<ISillyTavernContext['chat'][0] | undefined> {
        const chat = await this.getChat();
        return chat[index];
    }

    /**
     * Get the last chat message
     */
    public async getLastMessage(): Promise<ISillyTavernContext['chat'][0] | undefined> {
        const chat = await this.getChat();
        return chat.length > 0 ? chat[chat.length - 1] : undefined;
    }

    /**
     * Get a character by ID (which is the array index as integer)
     */
    public async getCharacterById(id: number): Promise<ISillyTavernContext['characters'][0] | undefined> {
        const characters = await this.getCharacters();
        return characters[id];
    }

    /**
     * Get the current menu type
     */
    public async getMenuType(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        return context.menuType;
    }

    /**
     * Reload the current chat
     */
    public async reloadCurrentChat(): Promise<void> {
        const context = await this.fetchSillyTavernContext();
        if (context.reloadCurrentChat) {
            await context.reloadCurrentChat();
        }
    }

    /**
     * Get chat completion settings
     */
    public async getChatCompletionSettings(): Promise<ISillyTavernContext['chatCompletionSettings']> {
        const context = await this.fetchSillyTavernContext();
        return context.chatCompletionSettings;
    }

    /**
     * Get text completion settings
     */
    public async getTextCompletionSettings(): Promise<ISillyTavernContext['textCompletionSettings']> {
        const context = await this.fetchSillyTavernContext();
        return context.textCompletionSettings;
    }

    /**
     * Get power user settings
     */
    public async getPowerUserSettings(): Promise<ISillyTavernContext['powerUserSettings']> {
        const context = await this.fetchSillyTavernContext();
        return context.powerUserSettings;
    }

    /**
     * Get tags
     */
    public async getTags(): Promise<ISillyTavernContext['tags']> {
        const context = await this.fetchSillyTavernContext();
        return context.tags;
    }

    /**
     * Get current locale
     */
    public async getCurrentLocale(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        return context.getCurrentLocale();
    }

    /**
     * Get token count for a string
     */
    public async getTokenCount(str: string, padding?: number): Promise<number> {
        const context = await this.fetchSillyTavernContext();
        return context.getTokenCount(str, padding);
    }

    /**
     * Substitute parameters in a string using SillyTavern's built-in function
     */
    public async substituteParams(
        content: string,
        _name1?: string,
        _name2?: string,
        _original?: string,
        _group?: string,
        _replaceCharacterCard?: boolean,
        additionalMacro?: any,
        postProcessFn?: (x: any) => any
    ): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        return context.substituteParams(
            content,
            _name1,
            _name2,
            _original,
            _group,
            _replaceCharacterCard,
            additionalMacro,
            postProcessFn
        );
    }
}

// Export a singleton instance for convenience
export const contextUtil = ContextUtil.getInstance();

// Export type for backward compatibility if needed
export type {ISillyTavernContext};