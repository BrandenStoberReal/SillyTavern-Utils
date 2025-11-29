import * as SillyTavern from './SillyTavern/index';

export interface ISillyTavernContext {
    accountStorage: SillyTavern.AccountStorage;
    chat: SillyTavern.ChatMessage[];
    characters: SillyTavern.Character[];
    groups: SillyTavern.Group[];
    name1: string;
    name2: string;
    characterId: string;
    groupId: string;
    chatId: string;
    onlineStatus: string;
    maxContext: number;
    chatMetadata: any;
    streamingProcessor: SillyTavern.StreamingProcessor;
    eventSource: SillyTavern.EventSource;
    eventTypes: Record<string, string>;
    tokenizers: Record<string, number>;
    extensionPrompts: Record<string, unknown>;
    SlashCommandParser: new () => SillyTavern.SlashCommandParser;
    SlashCommand: new () => SillyTavern.SlashCommand;
    SlashCommandArgument: new () => SillyTavern.SlashCommandArgument;
    SlashCommandNamedArgument: new () => SillyTavern.SlashCommandNamedArgument;
    ARGUMENT_TYPE: typeof SillyTavern.ARGUMENT_TYPE;
    ToolManager: SillyTavern.ToolManager;
    mainApi: string;
    extensionSettings: SillyTavern.ExtensionSettings;
    ModuleWorkerWrapper: new () => SillyTavern.ModuleWorkerWrapper;
    tags: SillyTavern.Tag[];
    tagMap: Record<string, any>;
    menuType: string;
    createCharacterData: any;
    event_types: Record<string, string>;
    Popup: typeof SillyTavern.Popup;
    POPUP_TYPE: typeof SillyTavern.POPUP_TYPE;
    POPUP_RESULT: typeof SillyTavern.POPUP_RESULT;
    chatCompletionSettings: SillyTavern.ChatCompletionSettings;
    textCompletionSettings: SillyTavern.TextCompletionSettings;
    powerUserSettings: SillyTavern.PowerUserSettings;
    swipe: {
        left(event?: any, options?: { source?: string; repeated?: boolean }): void;
        right(event?: any, options?: { source?: string; repeated?: boolean }): void;
    };
    variables: {
        local: {
            get(name: string, args?: any): any;
            set(name: string, value: any, args?: any): any;
        };
        global: {
            get(name: string, args?: any): any;
            set(name: string, value: any, args?: any): any;
        };
    };
    CONNECT_API_MAP: SillyTavern.ApiConnectMap;
    ChatCompletionService: SillyTavern.ChatCompletionService;
    TextCompletionService: SillyTavern.TextCompletionService;
    ConnectionManagerRequestService: SillyTavern.ConnectionManagerRequestService;
    symbols: {
        ignore: symbol;
    };

    getCurrentChatId(): string;

    getRequestHeaders(options?: {
        omitContentType?: boolean;
    }): Record<string, string>;

    reloadCurrentChat(): Promise<void>;

    renameChat(oldFileName: string, newName: string): Promise<any>;

    saveSettingsDebounced(): void;

    saveMetadataDebounced(): void;

    addOneMessage(
        mes: SillyTavern.ChatMessage,
        options?: Partial<
            SillyTavern.AddMessageOptions & {
            type?: string;
            insertAfter?: number;
            insertBefore?: number;
        }
        >,
    ): void;

    deleteLastMessage(): Promise<void>;

    generate(type: string, options?: any, dryRun?: boolean): Promise<any>;

    sendStreamingRequest(type: string, data: any, options?: any): Promise<any>;

    sendGenerationRequest(type: string, data: any, options?: any): Promise<any>;

    stopGeneration(): boolean;

    getTextTokens(tokenizerType: number, str: string): any;

    getTokenCount(str: string, padding?: number): number;

    getTokenCountAsync(str: string, padding?: number): Promise<number>;

    setExtensionPrompt(
        key: string,
        value: string,
        position: number,
        depth: number,
        scan?: boolean,
        role?: number,
        filter?: any,
    ): void;

    updateChatMetadata(newValues: Record<string, unknown>, reset?: boolean): void;

    saveChat(): Promise<void>;

    openCharacterChat(file_name: string): Promise<void>;

    openGroupChat(groupId: string, chatId: string): Promise<void>;

    saveMetadata(): Promise<void>;

    sendSystemMessage(
        type: string,
        text: string,
        extra?: Record<string, unknown>,
    ): void;

    activateSendButtons(): void;

    deactivateSendButtons(): void;

    saveReply(options: {
        type: string;
        getMessage: string;
        fromStreaming?: boolean;
        title?: string;
        swipes?: string[];
        reasoning?: string;
        imageUrl?: string;
    }): Promise<{ type: string; getMessage: string }>;

    substituteParams(
        content: string,
        _name1?: string,
        _name2?: string,
        _original?: string,
        _group?: string,
        _replaceCharacterCard?: boolean,
        additionalMacro?: any,
        postProcessFn?: (x: any) => any,
    ): string;

    substituteParamsExtended(
        content: string,
        additionalMacro?: any,
        postProcessFn?: (x: any) => any,
    ): string;

    executeSlashCommandsWithOptions(
        text: string,
        options?: SillyTavern.ExecuteSlashCommandsOptions,
    ): Promise<SillyTavern.SlashCommandClosureResult>;

    registerSlashCommand(
        command: string,
        callback: (...args: any[]) => any,
        aliases: string[],
        helpString?: string,
    ): void;

    executeSlashCommands(
        text: string,
        handleParserErrors?: boolean,
        scope?: SillyTavern.SlashCommandScope,
        handleExecutionErrors?: boolean,
        parserFlags?: Record<string, boolean>,
        abortController?: SillyTavern.SlashCommandAbortController,
        onProgress?: (done: number, total: number) => void,
    ): Promise<SillyTavern.SlashCommandClosureResult>;

    timestampToMoment(timestamp: number): any;

    registerHelper(): void;

    registerMacro(name: string, callback: (...args: any[]) => any): void;

    unregisterMacro(name: string): void;

    registerFunctionTool(tool: any): void;

    unregisterFunctionTool(name: string): void;

    isToolCallingSupported(): boolean;

    canPerformToolCalls(): boolean;

    registerDebugFunction(
        functionId: string,
        name: string,
        description: string,
        func: (...args: any[]) => any,
    ): void;

    renderExtensionTemplate(
        extensionName: string,
        templateId: string,
        templateData?: any,
        sanitize?: boolean,
        localize?: boolean,
    ): string;

    renderExtensionTemplateAsync(
        extensionName: string,
        templateId: string,
        templateData?: any,
        sanitize?: boolean,
        localize?: boolean,
    ): Promise<string>;

    registerDataBankScraper(scraper: any): void;

    callPopup(
        text: string,
        type: string,
        inputValue?: string,
        options?: any,
    ): Promise<any>;

    callGenericPopup(
        content: any,
        type: string,
        inputValue?: string,
        popupOptions?: any,
    ): Promise<any>;

    showLoader(): void;

    hideLoader(): Promise<void>;

    getTokenizerModel(): string;

    generateQuietPrompt(options: {
        quietPrompt?: string;
        quietToLoud?: boolean;
        skipWIAN?: boolean;
        quietImage?: any;
        quietName?: string;
        responseLength?: number;
        forceChId?: string;
        jsonSchema?: any;
        removeReasoning?: boolean;
        trimToSentence?: boolean;
    }): Promise<string>;

    generateRaw(options: {
        prompt?: string;
        api?: string;
        instructOverride?: boolean;
        quietToLoud?: boolean;
        systemPrompt?: string;
        responseLength?: number;
        trimNames?: boolean;
        prefill?: string;
        jsonSchema?: any;
    }): Promise<string>;

    writeExtensionField(
        characterId: string,
        key: string,
        value: any,
    ): Promise<void>;

    getThumbnailUrl(type: string, file: string, t?: boolean): string;

    selectCharacterById(
        id: string,
        options?: { switchMenu?: boolean },
    ): Promise<void>;

    messageFormatting(
        mes: string,
        ch_name: string,
        isSystem: boolean,
        isUser: boolean,
        messageId: number,
        sanitizerOverrides?: any,
        isReasoning?: boolean,
    ): string;

    shouldSendOnEnter(): boolean;

    isMobile(): boolean;

    t(strings: TemplateStringsArray, ...values: any[]): string;

    translate(text: string, key?: string): string;

    getCurrentLocale(): string;

    addLocaleData(localeId: string, data: any): void;

    getCharacters(): Promise<void>;

    getCharacterCardFields(options?: { chid?: string }): any;

    uuidv4(): string;

    humanizedDateTime(): string;

    updateMessageBlock(
        messageId: number,
        message: SillyTavern.ChatMessage,
        options?: {
            rerenderMessage?: boolean;
        },
    ): void;

    appendMediaToMessage(
        mes: SillyTavern.ChatMessage,
        messageElement: any,
        adjustScroll?: boolean,
    ): void;

    loadWorldInfo(name: string): Promise<any>;

    saveWorldInfo(name: string, data: any, immediately?: boolean): Promise<void>;

    reloadWorldInfoEditor(file: string, loadIfNotSelected?: boolean): void;

    updateWorldInfoList(): Promise<void>;

    convertCharacterBook(characterBook: any): Promise<any>;

    getWorldInfoPrompt(
        chat: string[],
        maxContext: number,
        isDryRun: boolean,
        globalScanData: any,
    ): Promise<any>;

    getTextGenServer(type?: string): string;

    extractMessageFromData(data: any, activeApi?: string): string;

    getPresetManager(apiId?: string): any;

    getChatCompletionModel(source?: string): string;

    printMessages(): Promise<void>;

    clearChat(): Promise<void>;

    updateReasoningUI(
        messageIdOrElement: any,
        options?: { reset?: boolean },
    ): void;

    parseReasoningFromString(
        str: string,
        options?: { strict?: boolean },
    ): {
        reasoning: string;
        content: string;
    } | null;

    unshallowCharacter(characterId: string): Promise<void>;

    unshallowGroupMembers(groupId: string): Promise<void>;

    openThirdPartyExtensionMenu(suggestUrl?: string): Promise<void>;
}
