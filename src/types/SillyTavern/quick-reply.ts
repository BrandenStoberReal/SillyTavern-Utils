export interface QuickReplySlot {
    mes: string;
    label: string;
    enabled: boolean;
}

export interface QuickReplyContextLink {
    set: QuickReplySet;
    isChained: boolean;
}

export interface QuickReply {
    id: number;
    icon: string;
    label: string;
    showLabel: boolean;
    title: string;
    message: string;
    contextList: QuickReplyContextLink[];
    preventAutoExecute: boolean;
    isHidden: boolean;
    executeOnStartup: boolean;
    executeOnUser: boolean;
    executeOnAi: boolean;
    executeOnChatChange: boolean;
    executeOnGroupMemberDraft: boolean;
    executeOnNewChat: boolean;
    executeBeforeGeneration: boolean;
    automationId: string;
    onExecute: () => void;
    onDebug: () => void;
    onDelete: () => void;
    onUpdate: () => void;
    onInsertBefore: () => void;
    onTransfer: () => void;
    dom: HTMLElement;
    domIcon: HTMLElement;
    domLabel: HTMLElement;
    settingsDom: HTMLElement;
    settingsDomIcon: HTMLElement;
    settingsDomLabel: HTMLInputElement;
    settingsDomMessage: HTMLTextAreaElement;
    editorPopup: any;
    editorDom: HTMLElement;
    editorMessage: HTMLTextAreaElement;
    editorMessageLabel: HTMLElement;
    editorSyntax: HTMLElement;
    editorExecuteBtn: HTMLElement;
    editorExecuteBtnPause: HTMLElement;
    editorExecuteBtnStop: HTMLElement;
    editorExecuteProgress: HTMLElement;
    editorExecuteErrors: HTMLElement;
    editorExecuteResult: HTMLElement;
    editorDebugState: HTMLElement;
    editorExecutePromise: Promise<any>;
    isExecuting: boolean;
    abortController: any;
    debugController: any;
}

export interface QuickReplySet {
    name: string;
    scope: 'global' | 'chat' | 'character';
    disableSend: boolean;
    placeBeforeInput: boolean;
    injectInput: boolean;
    color: string;
    onlyBorderColor: boolean;
    qrList: QuickReply[];
    idIndex: number;
    isDeleted: boolean;
    save: () => void;
    dom: HTMLElement;
    settingsDom: HTMLElement;
}

export interface QuickReplyV2Settings {
    isEnabled: boolean;
    isCombined: boolean;
    isPopout: boolean;
    config: QuickReplyConfig;
}

export interface QuickReplyConfig {
    setList: QuickReplySetLink[];
    scope: 'global' | 'chat' | 'character';
    onUpdate: () => void;
    onRequestEditSet: (set: QuickReplySet) => void;
    dom: HTMLElement;
    setListDom: HTMLElement;
}

export interface QuickReplySetLink {
    set: QuickReplySet;
    isVisible: boolean;
    index: number;
    onUpdate: () => void;
    onRequestEditSet: (set: QuickReplySet) => void;
    onDelete: () => void;
    settingsDom: HTMLElement;
}
