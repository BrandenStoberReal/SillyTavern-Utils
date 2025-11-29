export interface PopupOptions {
    okButton?: string | boolean | null;
    cancelButton?: string | boolean | null;
    rows?: number;
    wide?: boolean;
    wider?: boolean;
    large?: boolean;
    transparent?: boolean;
    allowHorizontalScrolling?: boolean;
    allowVerticalScrolling?: boolean;
    leftAlign?: boolean;
    animation?: 'slow' | 'fast' | 'none';
    defaultResult?: POPUP_RESULT | number;
    customButtons?: (CustomPopupButton | string)[] | null;
    customInputs?: CustomPopupInput[] | null;
    onClosing?: (popup: any) => Promise<boolean | null> | boolean | null; // Using any to avoid circular reference
    onClose?: (popup: any) => Promise<void | null> | void | null;
    onOpen?: (popup: any) => Promise<void | null> | void | null;
    cropAspect?: number | null;
    cropImage?: string | null;
}

export interface PopupUtil {
    popups: any[]; // Using any to avoid circular reference
    lastResult: {
        value: any;
        result: POPUP_RESULT | number;
        inputResults: Map<string, string | boolean>;
    } | null;

    isPopupOpen(): boolean;

    getTopmostModalLayer(): HTMLElement;
}

// Define the static methods separately for easier reference
export interface PopupShowHelper {
    input(
        header?: string | null,
        text?: string,
        defaultValue?: string,
        popupOptions?: PopupOptions,
    ): Promise<string | null>;

    confirm(
        header?: string | null,
        text?: string,
        popupOptions?: PopupOptions,
    ): Promise<POPUP_RESULT | null>;

    text(
        header?: string | null,
        text?: string,
        popupOptions?: PopupOptions,
    ): Promise<POPUP_RESULT | null>;
}

export declare class Popup {
    static show: PopupShowHelper;
    static util: PopupUtil;
    // Properties
    type: POPUP_TYPE;
    id: string;
    dlg: HTMLDialogElement;
    body: HTMLDivElement;
    content: HTMLDivElement;
    mainInput: HTMLTextAreaElement;
    inputControls: HTMLDivElement;
    buttonControls: HTMLDivElement;
    okButton: HTMLDivElement;
    cancelButton: HTMLDivElement;
    closeButton: HTMLDivElement;
    cropWrap: HTMLDivElement;
    cropImage: HTMLImageElement;
    defaultResult: POPUP_RESULT | number | null;
    customButtons: (CustomPopupButton | string)[] | null;
    customInputs: CustomPopupInput[];
    onClosing:
        | ((popup: Popup) => Promise<boolean | null> | boolean | null)
        | null;
    onClose: ((popup: Popup) => Promise<void | null> | void | null) | null;
    onOpen: ((popup: Popup) => Promise<void | null> | void | null) | null;
    result: POPUP_RESULT | number;
    value: any;
    inputResults: Map<string, string | boolean> | null;
    cropData: any;
    lastFocus: HTMLElement;

    constructor(
        content: any | string | Element,
        type: POPUP_TYPE,
        inputValue?: string,
        options?: PopupOptions,
    );

    // Methods
    show(): Promise<string | number | boolean | null>;

    complete(
        result: POPUP_RESULT | number,
    ): Promise<string | number | boolean | undefined | null>;

    completeAffirmative(): Promise<string | number | boolean | undefined | null>;

    completeNegative(): Promise<string | number | boolean | undefined | null>;

    completeCancelled(): Promise<string | number | boolean | undefined | null>;

    setAutoFocus(options?: { applyAutoFocus?: boolean }): void;
}

export interface CustomPopupButton {
    text: string;
    result: POPUP_RESULT | number;
    classes?: string[];
    action?: () => void;
    appendAtEnd?: boolean;
}

export interface CustomPopupInput {
    id: string;
    type: 'checkbox' | 'text';
    label: string;
    defaultState?: boolean | string;
    tooltip?: string;
}

export declare enum POPUP_TYPE {
    TEXT = 1,
    CONFIRM = 2,
    INPUT = 3,
    DISPLAY = 4,
    CROP = 5,
}

export declare enum POPUP_RESULT {
    AFFIRMATIVE = 1,
    NEGATIVE = 0,
    CANCELLED = -1,
    CUSTOM1 = 1001,
    CUSTOM2 = 1002,
    CUSTOM3 = 1003,
    CUSTOM4 = 1004,
    CUSTOM5 = 1005,
    CUSTOM6 = 1006,
    CUSTOM7 = 1007,
    CUSTOM8 = 1008,
    CUSTOM9 = 1009,
}
