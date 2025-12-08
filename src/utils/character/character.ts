import {contextUtil} from '../context';
import {Character} from '../../types';
import {SillyTavernCharacter} from './character-class';

/**
 * A utility class for managing characters.
 */
export class CharacterUtil {
    /**
     * Fetches a SillyTavernCharacter instance by GUID or legacy character array index.
     * @param identifier - Either a GUID string or a legacy character array index
     * @returns A SillyTavernCharacter instance
     */
    public fetchCharacter(identifier: string | number): SillyTavernCharacter {
        return new SillyTavernCharacter(identifier);
    }

    /**
     * Gets the currently selected character.
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
}

/**
 * An instance of the CharacterUtil class for convenient access.
 */
export const characterUtil = new CharacterUtil();
