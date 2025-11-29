export interface StScriptSettings {
    parser: {
        flags: {
            '1': boolean;
            '2': boolean;
        };
    };
    autocomplete: {
        state: number;
        autoHide: boolean;
        style: string;
        font: {
            scale: number;
        };
        width: {
            left: number;
            right: number;
        };
        select: number;
    };
}
