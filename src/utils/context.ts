import {ISillyTavernContext} from '../types';

/**
 * Context utility for interacting with SillyTavern context and reading specific data
 */
export class ContextUtil {
    /**
     * Create a new instance of ContextUtil
     */
    constructor() {
        // No initialization needed
    }

    /**
     * Fetch the current SillyTavern context
     * @returns Promise resolving to the current context
     */
    public async fetchSillyTavernContext(): Promise<ISillyTavernContext> {
        try {
            const context = SillyTavern.getContext();
            if (context) {
                return context;
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
        if (context.chat === undefined) {
            throw new Error('Chat data is not available in the current context');
        }
        return context.chat;
    }

    /**
     * Read the current characters
     */
    public async getCharacters(): Promise<ISillyTavernContext['characters']> {
        const context = await this.fetchSillyTavernContext();
        if (context.characters === undefined) {
            throw new Error('Characters data is not available in the current context');
        }
        return context.characters;
    }

    /**
     * Read the current groups
     */
    public async getGroups(): Promise<ISillyTavernContext['groups']> {
        const context = await this.fetchSillyTavernContext();
        if (context.groups === undefined) {
            throw new Error('Groups data is not available in the current context');
        }
        return context.groups;
    }

    /**
     * Get the current user's name
     */
    public async getUserName(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        if (context.name1 === undefined) {
            throw new Error('User name is not available in the current context');
        }
        return context.name1;
    }

    /**
     * Get the current character's name
     */
    public async getCharacterName(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        if (context.name2 === undefined) {
            throw new Error('Character name is not available in the current context');
        }
        return context.name2;
    }

    /**
     * Get the current character ID
     */
    public async getCharacterId(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        if (context.characterId === undefined) {
            throw new Error('Character ID is not available in the current context');
        }
        return context.characterId;
    }

    /**
     * Get the current group ID
     */
    public async getGroupId(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        if (context.groupId === undefined) {
            throw new Error('Group ID is not available in the current context');
        }
        return context.groupId;
    }

    /**
     * Get the current chat ID
     */
    public async getChatId(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        if (context.chatId === undefined) {
            throw new Error('Chat ID is not available in the current context');
        }
        return context.chatId;
    }

    /**
     * Get the current max context length
     */
    public async getMaxContext(): Promise<number> {
        const context = await this.fetchSillyTavernContext();
        if (context.maxContext === undefined) {
            throw new Error('Max context length is not available in the current context');
        }
        return context.maxContext;
    }

    /**
     * Get the chat metadata
     */
    public async getChatMetadata(): Promise<any> {
        const context = await this.fetchSillyTavernContext();
        if (context.chatMetadata === undefined) {
            throw new Error('Chat metadata is not available in the current context');
        }
        return context.chatMetadata;
    }

    /**
     * Get extension settings
     */
    public async getExtensionSettings(): Promise<ISillyTavernContext['extensionSettings']> {
        const context = await this.fetchSillyTavernContext();
        if (context.extensionSettings === undefined) {
            throw new Error('Extension settings are not available in the current context');
        }
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
        try {
            const chat = await this.getChat();
            return chat[index];
        } catch (error) {
            console.warn(`Could not get chat message at index ${index}:`, error);
            return undefined;
        }
    }

    /**
     * Get the last chat message
     */
    public async getLastMessage(): Promise<ISillyTavernContext['chat'][0] | undefined> {
        try {
            const chat = await this.getChat();
            return chat.length > 0 ? chat[chat.length - 1] : undefined;
        } catch (error) {
            console.warn('Could not get last chat message:', error);
            return undefined;
        }
    }

    /**
     * Get a character by ID (which is the array index as integer)
     */
    public async getCharacterById(id: number): Promise<ISillyTavernContext['characters'][0] | undefined> {
        try {
            const characters = await this.getCharacters();
            return characters[id];
        } catch (error) {
            console.warn(`Could not get character with ID ${id}:`, error);
            return undefined;
        }
    }

    /**
     * Get the current menu type
     */
    public async getMenuType(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        if (context.menuType === undefined) {
            throw new Error('Menu type is not available in the current context');
        }
        return context.menuType;
    }

    /**
     * Reload the current chat
     */
    public async reloadCurrentChat(): Promise<void> {
        const context = await this.fetchSillyTavernContext();
        if (typeof context.reloadCurrentChat === 'function') {
            await context.reloadCurrentChat();
        } else {
            throw new Error('reloadCurrentChat function is not available in the current context');
        }
    }

    /**
     * Get chat completion settings
     */
    public async getChatCompletionSettings(): Promise<ISillyTavernContext['chatCompletionSettings']> {
        const context = await this.fetchSillyTavernContext();
        if (context.chatCompletionSettings === undefined) {
            throw new Error('Chat completion settings are not available in the current context');
        }
        return context.chatCompletionSettings;
    }

    /**
     * Get text completion settings
     */
    public async getTextCompletionSettings(): Promise<ISillyTavernContext['textCompletionSettings']> {
        const context = await this.fetchSillyTavernContext();
        if (context.textCompletionSettings === undefined) {
            throw new Error('Text completion settings are not available in the current context');
        }
        return context.textCompletionSettings;
    }

    /**
     * Get power user settings
     */
    public async getPowerUserSettings(): Promise<ISillyTavernContext['powerUserSettings']> {
        const context = await this.fetchSillyTavernContext();
        if (context.powerUserSettings === undefined) {
            throw new Error('Power user settings are not available in the current context');
        }
        return context.powerUserSettings;
    }

    /**
     * Get tags
     */
    public async getTags(): Promise<ISillyTavernContext['tags']> {
        const context = await this.fetchSillyTavernContext();
        if (context.tags === undefined) {
            throw new Error('Tags are not available in the current context');
        }
        return context.tags;
    }

    /**
     * Get current locale
     */
    public async getCurrentLocale(): Promise<string> {
        const context = await this.fetchSillyTavernContext();
        if (typeof context.getCurrentLocale !== 'function') {
            throw new Error('getCurrentLocale function is not available in the current context');
        }
        return context.getCurrentLocale();
    }

    /**
     * Get token count for a string
     */
    public async getTokenCount(str: string, padding?: number): Promise<number> {
        const context = await this.fetchSillyTavernContext();
        if (typeof context.getTokenCount !== 'function') {
            throw new Error('getTokenCount function is not available in the current context');
        }
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
        if (typeof context.substituteParams !== 'function') {
            throw new Error('substituteParams function is not available in the current context');
        }
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

// Export a default instance for convenience
export const contextUtil = new ContextUtil();

// Export type for backward compatibility if needed
export type {ISillyTavernContext};