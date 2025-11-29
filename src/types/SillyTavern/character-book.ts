export interface BookEntry {
    id: number;
    keys: string[];
    secondary_keys: string[];
    comment: string;
    content: string;
    constant: boolean;
    selective: boolean;
    insertion_order: number;
    enabled: boolean;
    position: string;
    use_regex: boolean;
    extensions: Record<string, any>;
}

export interface CharacterBook {
    entries: BookEntry[];
    name: string;
}
