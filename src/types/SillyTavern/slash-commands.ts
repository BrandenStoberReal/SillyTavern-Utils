export interface SlashCommand {
    name: string;
    callback: (
        args: NamedArguments,
        text: UnnamedArguments,
    ) => string | Promise<string>;
    helpString: string;
    splitUnnamedArgument: boolean;
    splitUnnamedArgumentCount: number;
    rawQuotes: boolean;
    aliases: string[];
    returns: string;
    namedArgumentList: SlashCommandNamedArgument[];
    unnamedArgumentList: SlashCommandArgument[];
    helpCache: Record<string, HTMLElement>;
    helpDetailsCache: Record<string, DocumentFragment>;
    isExtension: boolean;
    isThirdParty: boolean;
    source: string;

    renderHelpItem(key?: string): HTMLElement;

    renderHelpDetails(key?: string): DocumentFragment;
}

export interface SlashCommandAbortController {
    signal: AbortSignal & {
        aborted: boolean;
        paused: boolean;
        isQuiet: boolean;
    };

    abort(reason?: string, quiet?: boolean): void;

    pause(reason?: string): void;

    continue(reason?: string): void;
}

export interface SlashCommandDebugController {
    stack: any[];
    cmdStack: any[];

    // Additional properties based on how it's used
    step(): void;

    continue(): void;

    pause(): void;
}

export interface SlashCommandScope {
    allVariableNames: string[];
    variables: Record<string, any>;
    parent?: SlashCommandScope;

    setVariable(name: string, value: any, isLocal?: boolean): void;

    getVariable(name: string, isLocal?: boolean): any;

    existsVariable(name: string, isLocal?: boolean): boolean;

    deleteVariable(name: string, isLocal?: boolean): boolean;

    getLocalVariables(): Record<string, any>;

    getInheritedVariables(): Record<string, any>;

    clone(): SlashCommandScope;
}

export interface SlashCommandClosure {
    rawText: string;
    abortController: SlashCommandAbortController;
    breakController: SlashCommandBreakController;
    debugController: SlashCommandDebugController;
    scope: SlashCommandScope;
    argumentList: (SlashCommandNamedArgument | SlashCommandArgument)[];
    providedArgumentList: (
        | SlashCommandNamedArgumentAssignment
        | SlashCommandUnnamedArgumentAssignment
        )[];
    onProgress: (done: number, total: number) => void;
    source: string;
    isAborted: boolean;
    isQuietlyAborted: boolean;
    abortReason: string;

    execute(): Promise<SlashCommandClosureResult>;

    getCopy(): SlashCommandClosure;
}

export interface SlashCommandExecutor {
    start: number;
    end: number;
    name: string;
    command?: SlashCommand;
    unnamedArgumentList: UnnamedArguments;
    namedArgumentList: NamedArguments;
}

export interface SlashCommandBreakPoint {
    index: number;
    condition: (scope: SlashCommandScope) => boolean;
}

export interface SlashCommandBreak {
    execute(): void;
}

export interface SlashCommandNamedArgumentAssignment {
    name: string;
    value: any;
    rawValue: string;
    type: ARGUMENT_TYPE;
}

export interface SlashCommandUnnamedArgumentAssignment {
    value: any;
    rawValue: string;
    type: ARGUMENT_TYPE;
    index: number;
}

export interface AutoCompleteNameResult {
    name: string;
    start: number;
    end: number;
    options: SlashCommandEnumValue[];
    fuzzy: boolean;
    noMatchMessage: () => string;
    emptyMessage: () => string;
    result: string;
}

// Updated SlashCommandArgument types with more specific typing
export interface SlashCommandArgument {
    description: string;
    typeList: ARGUMENT_TYPE[];
    isRequired: boolean;
    acceptsMultiple: boolean;
    defaultValue: string | null;
    enumList: SlashCommandEnumValue[];
    enumProvider: (
        executor?: SlashCommandExecutor,
        scope?: SlashCommandScope,
    ) => SlashCommandEnumValue[];
    forceEnum: boolean;
}

export interface SlashCommandNamedArgument extends SlashCommandArgument {
    name: string;
    aliasList: string[];
    isRequired: boolean;
    defaultValue: string | null;
}

export interface SlashCommandEnumValue {
    value: string;
    description: string | null;
    type: any;
    icon: any;
}

// New interfaces based on the JavaScript implementation
export interface NamedArguments {
    // Special properties that are passed in named arguments
    _scope?: SlashCommandScope;
    _abortController?: SlashCommandAbortController;
    _debugController?: SlashCommandDebugController;

    [key: string]:
        | string
        | number
        | boolean
        | (string | number | boolean)[]
        | SlashCommandClosure
        | SlashCommandScope
        | SlashCommandAbortController
        | SlashCommandDebugController
        | undefined;
}

export type UnnamedArguments =
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | SlashCommandClosure
    | null;

export interface SlashCommandClosureResult {
    pipe: any;
    isError: boolean;
    isAborted: boolean;
    isQuietlyAborted: boolean;
    abortReason: string;
    errorMessage: string;
    result: any;
}

export interface SlashCommandBreakController {
    shouldBreak: boolean;
    breakReason: string;

    reset(): void;
}

export interface ExecuteSlashCommandsOptions {
    handleParserErrors?: boolean;
    scope?: SlashCommandScope;
    handleExecutionErrors?: boolean;
    parserFlags?: Record<string, boolean>;
    abortController?: SlashCommandAbortController;
    debugController?: SlashCommandDebugController;
    onProgress?: (done: number, total: number) => void;
    source?: string;
}

export interface ExecuteSlashCommandsOnChatInputOptions {
    scope?: SlashCommandScope;
    parserFlags?: Record<string, boolean>;
    clearChatInput?: boolean;
    source?: string;
}

export interface ApiConnectMap {
    selected: string;
    button?: string;
    type?: string;
    source?: string;
}

export type UniqueApis = string[];

export interface SlashCommandExecutionError extends Error {
    line: number;
    column: number;
    hint: string;
    cause?: string;
}

export declare enum ARGUMENT_TYPE {
    STRING = 'string',
    NUMBER = 'number',
    RANGE = 'range',
    BOOLEAN = 'bool',
    VARIABLE_NAME = 'varname',
    CLOSURE = 'closure',
    SUBCOMMAND = 'subcommand',
    LIST = 'list',
    DICTIONARY = 'dictionary',
}

export interface SlashCommandParser {
    // Static properties
    commands: Record<string, SlashCommand>;
    helpStrings: Record<string, string>;
    verifyCommandNames: boolean;

    // Instance properties
    text: string;
    index: number;
    abortController: SlashCommandAbortController;
    debugController: SlashCommandDebugController;
    scope: SlashCommandScope;
    closure: SlashCommandClosure;
    flags: Record<string, boolean>;
    jumpedEscapeSequence: boolean;
    closureIndex: { start: number; end: number }[];
    macroIndex: { start: number; end: number; name: string }[];
    commandIndex: SlashCommandExecutor[];
    scopeIndex: SlashCommandScope[];
    parserContext: string;

    // Getters
    readonly userIndex: number;
    readonly ahead: string;
    readonly behind: string;
    readonly char: string;
    readonly endOfText: boolean;

    // Methods
    parse(
        text: string,
        verifyCommandNames?: boolean,
        flags?: Record<string, boolean>,
        abortController?: SlashCommandAbortController,
        debugController?: SlashCommandDebugController,
    ): SlashCommandClosure;

    getNameAt(
        text: string,
        index: number,
    ): Promise<AutoCompleteNameResult | null>;

    take(length?: number): string;

    discardWhitespace(): void;

    testSymbol(sequence: string | RegExp, offset?: number): boolean;

    testSymbolLooseyGoosey(sequence: string | RegExp, offset?: number): boolean;

    replaceGetvar(value: string): string;

    testClosure(): boolean;

    testClosureEnd(): boolean;

    parseClosure(isRoot?: boolean): SlashCommandClosure;

    testBreakPoint(): boolean;

    parseBreakPoint(): SlashCommandBreakPoint;

    testBreak(): boolean;

    parseBreak(): SlashCommandBreak;

    testBlockComment(): boolean;

    testBlockCommentEnd(): boolean;

    parseBlockComment(): void;

    testComment(): boolean;

    testCommentEnd(): boolean;

    parseComment(): void;

    testParserFlag(): boolean;

    testParserFlagEnd(): boolean;

    parseParserFlag(): void;

    testRunShorthand(): boolean;

    testRunShorthandEnd(): boolean;

    parseRunShorthand(): SlashCommandExecutor;

    testCommand(): boolean;

    testCommandEnd(): boolean;

    parseCommand(): SlashCommandExecutor;

    testNamedArgument(): boolean;

    parseNamedArgument(): SlashCommandNamedArgumentAssignment;

    testUnnamedArgument(): boolean;

    testUnnamedArgumentEnd(): boolean;

    parseUnnamedArgument(
        split?: boolean,
        splitCount?: number | null,
        rawQuotes?: boolean,
    ): SlashCommandUnnamedArgumentAssignment[];

    testQuotedValue(): boolean;

    testQuotedValueEnd(): boolean;

    parseQuotedValue(): string;

    testListValue(): boolean;

    testListValueEnd(): boolean;

    parseListValue(): string;

    testValue(): boolean;

    testValueEnd(): boolean;

    parseValue(): string;

    indexMacros(offset: number, text: string): void;

    getHelpString(): string;
}
