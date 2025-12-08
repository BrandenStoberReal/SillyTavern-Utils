import {contextUtil} from './context';
import {logError} from './logging/logger';
import {Character} from '../types';

/**
 * A utility class for managing characters.
 */
export class CharacterUtil {
    /**
     * Retrieves a character by its unique GUID.
     * @param guid - The GUID of the character to retrieve.
     * @returns A promise that resolves to the character object, or undefined if not found.
     */
    public async getCharacterByGuid(guid: string): Promise<Character | undefined> {
        const characters = await contextUtil.getCharacters();
        return characters.find(character => character.data?.extensions?.['guid'] === guid);
    }

    /**
     * Gets the currently selected character.
     * @deprecated This function relies on the character's array index, which is not a stable identifier. Use `getCurrentCharacterGuid` and `getCharacterByGuid` instead.
     * @returns A promise that resolves to the current character object, or undefined if no character is selected.
     */
    public async getCurrentCharacter(): Promise<Character | undefined> {
        const characterId = await contextUtil.getCurrentLegacyIdentifier();
        if (!characterId) {
            return undefined;
        }
        const characters = await contextUtil.getCharacters();
        return characters[parseInt(characterId, 10)];
    }

    /**
     * Gets the GUID of the currently selected character.
     * @returns A promise that resolves to the GUID of the current character, or undefined if no character is selected.
     */
    public async getCurrentCharacterGuid(): Promise<string | undefined> {
        const character = await this.getCurrentCharacter();
        if (!character) {
            return undefined;
        }
        return this.getOrGenerateCharacterGuid(character);
    }

    /**
     * Gets the GUID for a character, generating and binding one if it doesn't exist.
     * @param character - The character to get or generate a GUID for.
     * @returns A promise that resolves to the character's GUID.
     */
    public async getOrGenerateCharacterGuid(character: Character): Promise<string> {
        const guidKey = 'guid';
        let guid = character.data?.extensions?.[guidKey];

        if (guid) {
            return guid;
        }

        const characters = await contextUtil.getCharacters();
        const characterIndex = characters.indexOf(character);

        if (characterIndex === -1) {
            throw new Error('Character not found in the character list. Cannot generate GUID.');
        }

        const context = await contextUtil.fetchSillyTavernContext();
        guid = context.uuidv4();
        await context.writeExtensionField(String(characterIndex), guidKey, guid);

        // Also update the character object in memory
        if (character.data) {
            if (!character.data.extensions) {
                character.data.extensions = {};
            }
            character.data.extensions[guidKey] = guid;
        }

        return guid;
    }

    /**
     * Get the character's extension metadata
     * @param guid - The GUID of the character to get metadata from
     * @returns Promise resolving to the character's extension metadata object, or null if unavailable
     */
    public async getCharacterMetadata(guid: string): Promise<Record<string, any> | null> {
        try {
            const character = await this.getCharacterByGuid(guid);
            if (!character || !character.data?.extensions) {
                logError(`Character with GUID ${guid} not found or has no extensions`);
                return null;
            }
            // Return a copy to prevent direct mutation
            return {...character.data.extensions};
        } catch (error) {
            logError('Failed to get character metadata:', error);
            return null;
        }
    }

    /**
     * Set a value in character metadata
     * @param guid - The GUID of the character
     * @param key - The metadata key to set
     * @param value - The value to set
     * @returns Promise that resolves when the metadata is set, or false if failed
     */
    public async setCharacterMetadataValue(guid: string, key: string, value: any): Promise<boolean> {
        try {
            await this.setCharacterExtensionFieldByGuid(guid, key, value);
            return true;
        } catch (error) {
            logError('Failed to set character metadata:', error);
            return false;
        }
    }

    /**
     * Get a value from character metadata
     * @param guid - The GUID of the character
     * @param key - The metadata key to retrieve
     * @returns The value stored at the key, or null if not found
     */
    public async getCharacterMetadataValue(guid: string, key: string): Promise<any> {
        try {
            const character = await this.getCharacterByGuid(guid);
            if (!character || !character.data?.extensions) {
                logError(`Character with GUID ${guid} not found or has no extensions`);
                return null;
            }

            return character.data.extensions[key] || null;
        } catch (error) {
            logError('Failed to get character metadata value:', error);
            return null;
        }
    }

    /**
     * Remove a value from character metadata
     * @param guid - The GUID of the character
     * @param key - The metadata key to remove
     * @returns Promise that resolves when the metadata is removed, or false if failed
     */
    public async removeCharacterMetadata(guid: string, key: string): Promise<boolean> {
        try {
            // To remove an extension field, we set it to undefined or null
            await this.setCharacterExtensionFieldByGuid(guid, key, undefined);
            return true;
        } catch (error) {
            logError('Failed to remove character metadata:', error);
            return false;
        }
    }

    /**
     * Update multiple values in character metadata
     * @param guid - The GUID of the character
     * @param updates - An object with key-value pairs to update in metadata
     * @returns Promise that resolves when the metadata is updated, or false if failed
     */
    public async updateCharacterMetadata(guid: string, updates: Record<string, any>): Promise<boolean> {
        try {
            for (const [key, value] of Object.entries(updates)) {
                await this.setCharacterExtensionFieldByGuid(guid, key, value);
            }
            return true;
        } catch (error) {
            logError('Failed to update character metadata:', error);
            return false;
        }
    }

    /**
     * Clear all character metadata (except for the GUID)
     * @param guid - The GUID of the character
     * @returns Promise that resolves when the metadata is cleared, or false if failed
     */
    public async clearCharacterMetadata(guid: string): Promise<boolean> {
        try {
            const character = await this.getCharacterByGuid(guid);
            if (!character || !character.data?.extensions) {
                logError(`Character with GUID ${guid} not found or has no extensions`);
                return false;
            }

            // Get the current GUID to preserve it after clearing
            const currentGuid = character.data.extensions['guid'];

            // Get all keys to clear
            const keys = Object.keys(character.data.extensions);

            for (const key of keys) {
                // Only clear non-essential keys (not the GUID)
                if (key !== 'guid') {
                    await this.setCharacterExtensionFieldByGuid(guid, key, undefined);
                }
            }

            return true;
        } catch (error) {
            logError('Failed to clear character metadata:', error);
            return false;
        }
    }

    /**
     * Check if a key exists in character metadata
     * @param guid - The GUID of the character
     * @param key - The metadata key to check
     * @returns Promise resolving to true if the key exists, false otherwise
     */
    public async hasCharacterMetadataKey(guid: string, key: string): Promise<boolean> {
        try {
            const character = await this.getCharacterByGuid(guid);
            if (!character || !character.data?.extensions) {
                logError(`Character with GUID ${guid} not found or has no extensions`);
                return false;
            }

            return character.data.extensions.hasOwnProperty(key);
        } catch (error) {
            logError('Failed to check character metadata key:', error);
            return false;
        }
    }

    /**
     * Retrieves a value from a character's extension data using its GUID.
     * @param guid - The GUID of the character.
     * @param key - The key of the extension field to retrieve.
     * @returns A promise that resolves to the value of the extension field, or undefined if not found.
     */
    private async getCharacterExtensionFieldByGuid(guid: string, key: string): Promise<any> {
        const character = await this.getCharacterByGuid(guid);
        return character?.data?.extensions?.[key];
    }

    /**
     * Sets a value in a character's extension data using its GUID.
     * @param guid - The GUID of the character.
     * @param key - The key of the extension field to set.
     * @param value - The value to set.
     * @returns A promise that resolves when the field has been written.
     */
    private async setCharacterExtensionFieldByGuid(guid: string, key: string, value: any): Promise<void> {
        const characters = await contextUtil.getCharacters();
        const characterIndex = characters.findIndex(character => character.data?.extensions?.['guid'] === guid);

        if (characterIndex === -1) {
            throw new Error(`Character with GUID ${guid} not found.`);
        }

        const context = await contextUtil.fetchSillyTavernContext();
        await context.writeExtensionField(String(characterIndex), key, value);
    }
}

/**
 * An instance of the CharacterUtil class for convenient access.
 */
export const characterUtil = new CharacterUtil();
