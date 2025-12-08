import {contextUtil} from '../context';
import {Character} from '../../types';

/**
 * A Character class that wraps the character object and provides utility methods.
 * Can be instantiated with either a GUID or legacy character array index.
 */
export class SillyTavernCharacter {
    private _guid: string | undefined;
    private _legacyIndex: number | undefined;
    private _resolvedCharacter: Character | undefined;

    /**
     * Creates a SillyTavernCharacter instance.
     * @param identifier - Either a GUID string or a legacy character array index
     */
    constructor(identifier: string | number) {
        if (typeof identifier === 'string') {
            // GUID provided
            this._guid = identifier;
        } else {
            // Legacy index provided
            this._legacyIndex = identifier;
        }
    }

    /**
     * Get the character object.
     * @returns The character object, or undefined if not found
     */
    public async getCharacter(): Promise<Character | undefined> {
        if (this._resolvedCharacter) {
            return this._resolvedCharacter;
        }

        if (this._guid) {
            this._resolvedCharacter = await this.getCharacterByGuid(this._guid);
        } else if (this._legacyIndex !== undefined) {
            this._resolvedCharacter = await this.getCharacterByLegacyIndex(this._legacyIndex);
        }

        return this._resolvedCharacter;
    }

    /**
     * Gets the GUID for the character, generating and binding one if it doesn't exist.
     * @returns A promise that resolves to the character's GUID.
     */
    public async getOrGenerateGuid(): Promise<string> {
        const guidKey = 'guid';

        // Check if we already have the GUID cached internally
        if (this._guid) {
            return this._guid;
        }

        // Otherwise, check if the character already has a GUID in its data
        const character = await this.getCharacter();
        if (character && character.data?.extensions?.['guid']) {
            const existingGuid = character.data.extensions['guid'];
            this._guid = existingGuid;
            return existingGuid;
        }

        // If no GUID exists, generate one
        if (!character) {
            throw new Error('Character not found. Cannot generate GUID.');
        }

        const characters = await contextUtil.getCharacters();
        const characterIndex = characters.indexOf(character);

        if (characterIndex === -1) {
            throw new Error('Character not found in the character list. Cannot generate GUID.');
        }

        const context = await contextUtil.fetchSillyTavernContext();
        const guid = context.uuidv4();
        await context.writeExtensionField(String(characterIndex), guidKey, guid);

        // Also update the character object in memory
        if (character.data) {
            if (!character.data.extensions) {
                character.data.extensions = {};
            }
            character.data.extensions[guidKey] = guid;
        }

        // Update the internal guid reference
        this._guid = guid;
        if (this._resolvedCharacter && this._resolvedCharacter.data) {
            if (!this._resolvedCharacter.data.extensions) {
                this._resolvedCharacter.data.extensions = {};
            }
            this._resolvedCharacter.data.extensions[guidKey] = guid;
        }

        return guid;
    }

    /**
     * Get the character's legacy array index.
     * @returns The character's legacy index, or undefined if not found
     */
    public async getLegacyIndex(): Promise<number | undefined> {
        if (this._legacyIndex !== undefined) {
            return this._legacyIndex;
        }

        if (this._resolvedCharacter) {
            const characters = await contextUtil.getCharacters();
            const index = characters.indexOf(this._resolvedCharacter);
            if (index !== -1) {
                this._legacyIndex = index;
                return index;
            }
        } else if (this._guid) {
            const character = await this.getCharacter();
            if (character) {
                const characters = await contextUtil.getCharacters();
                const index = characters.indexOf(character);
                if (index !== -1) {
                    this._legacyIndex = index;
                    return index;
                }
            }
        }

        return undefined;
    }

    /**
     * Check if the character exists.
     * @returns True if the character exists, false otherwise
     */
    public async exists(): Promise<boolean> {
        const character = await this.getCharacter();
        return character !== undefined;
    }

    /**
     * Get the character's name.
     * @returns The character's name, or undefined if not found
     */
    public async getName(): Promise<string | undefined> {
        const character = await this.getCharacter();
        return character?.name;
    }

    /**
     * Get the character's metadata.
     * @returns The character's metadata, or null if unavailable
     */
    public async getMetadata(): Promise<Record<string, any> | null> {
        const character = await this.getCharacter();
        if (!character || !character.data?.extensions) {
            return null;
        }
        // Return a copy to prevent direct mutation
        return {...character.data.extensions};
    }

    /**
     * Get a metadata value.
     * @param key - The metadata key to retrieve
     * @returns The value stored at the key, or null if not found
     */
    public async getMetadataValue(key: string): Promise<any> {
        const character = await this.getCharacter();
        if (!character || !character.data?.extensions) {
            return null;
        }

        return character.data.extensions[key] || null;
    }

    /**
     * Set a metadata value.
     * @param key - The metadata key to set
     * @param value - The value to set
     * @returns Promise that resolves when the metadata is set
     */
    public async setMetadataValue(key: string, value: any): Promise<void> {
        const character = await this.getCharacter();
        if (!character) {
            throw new Error('Character not found. Cannot set metadata.');
        }

        // Use the character's index to set the extension field
        const characters = await contextUtil.getCharacters();
        const characterIndex = characters.indexOf(character);

        if (characterIndex === -1) {
            throw new Error('Character not found in the character list. Cannot set metadata.');
        }

        const context = await contextUtil.fetchSillyTavernContext();
        await context.writeExtensionField(String(characterIndex), key, value);

        // Update the character object in memory to reflect the change
        if (character.data) {
            if (!character.data.extensions) {
                character.data.extensions = {};
            }
            character.data.extensions[key] = value;
        }

        // Update the resolved character if we have it
        if (this._resolvedCharacter && this._resolvedCharacter.data) {
            if (!this._resolvedCharacter.data.extensions) {
                this._resolvedCharacter.data.extensions = {};
            }
            this._resolvedCharacter.data.extensions[key] = value;
        }
    }

    /**
     * Internal method to get a character by GUID.
     * @param guid - The GUID of the character
     * @returns The character object, or undefined if not found
     */
    private async getCharacterByGuid(guid: string): Promise<Character | undefined> {
        const characters = await contextUtil.getCharacters();
        return characters.find(character => character.data?.extensions?.['guid'] === guid);
    }

    /**
     * Internal method to get a character by legacy index.
     * @param index - The legacy character array index
     * @returns The character object, or undefined if not found
     */
    private async getCharacterByLegacyIndex(index: number): Promise<Character | undefined> {
        const characters = await contextUtil.getCharacters();
        return characters[index];
    }
}