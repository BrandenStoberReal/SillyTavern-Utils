import {contextUtil} from './context';
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
     * Retrieves a value from a character's extension data using its GUID.
     * @param guid - The GUID of the character.
     * @param key - The key of the extension field to retrieve.
     * @returns A promise that resolves to the value of the extension field, or undefined if not found.
     */
    public async getCharacterExtensionFieldByGuid(guid: string, key: string): Promise<any> {
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
    public async setCharacterExtensionFieldByGuid(guid: string, key: string, value: any): Promise<void> {
        const characters = await contextUtil.getCharacters();
        const characterIndex = characters.findIndex(character => character.data?.extensions?.['guid'] === guid);

        if (characterIndex === -1) {
            throw new Error(`Character with GUID ${guid} not found.`);
        }

        const context = await contextUtil.fetchSillyTavernContext();
        await context.writeExtensionField(String(characterIndex), key, value);
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
}

/**
 * An instance of the CharacterUtil class for convenient access.
 */
export const characterUtil = new CharacterUtil();
