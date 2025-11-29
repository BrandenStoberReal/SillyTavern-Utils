import {CharacterBook} from './character-book';

export interface Character {
    name: string;
    description: string;
    personality: string;
    first_mes: string;
    avatar: string;
    chat: string;
    mes_example: string;
    scenario: string;
    create_date: string;
    talkativeness: string;
    fav: boolean;
    creatorcomment: string;
    spec: string;
    spec_version: string;
    data: CharacterData;
    tags: string[];
    json_data: string;
    date_added: number;
    chat_size: number;
    date_last_chat: number;
    data_size: number;
}

export interface CharacterData {
    name: string;
    description: string;
    personality: string;
    scenario: string;
    first_mes: string;
    mes_example: string;
    creator_notes: string;
    system_prompt: string;
    post_history_instructions: string;
    tags: string[];
    creator: string;
    character_version: string;
    alternate_greetings: string[];
    extensions: Record<string, any>;
    character_book?: CharacterBook;
    group_only_greetings?: any[];
}
