export interface ChatMessage {
    name: string;
    is_user: boolean;
    is_name: boolean;
    send_date: number;
    mes: string;
    extra?: Record<string, any>;
    swipes?: string[];
    swipe_id?: number;
    is_system?: boolean;
}

export interface AddMessageOptions {
    scroll: boolean;
    forceId: number;
    showSwipes: boolean;
}
