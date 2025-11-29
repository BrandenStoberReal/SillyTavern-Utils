export interface Group {
    id: string;
    name: string;
    members: string[];
    avatar_url: string;
    allow_self_responses: boolean;
    activation_strategy: number;
    generation_mode: number;
    disabled_members: any[];
    chat_metadata: Record<string, any>;
    fav: boolean;
    chat_id: string;
    chats: string[];
    auto_mode_delay: number;
    generation_mode_join_prefix: string;
    generation_mode_join_suffix: string;
    date_added: number;
    create_date: string;
    date_last_chat: number;
    chat_size: number;
    past_metadata: Record<string, any>;
}
