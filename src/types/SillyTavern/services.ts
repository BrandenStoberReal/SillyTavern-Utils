import {ChatCompletionMessage} from './chat-completion-message';
import {StreamResponse} from './streaming';
import {InstructSettings} from './instruct';

export interface ChatCompletionPayload {
    stream?: boolean;
    messages: ChatCompletionMessage[];
    model: string;
    chat_completion_source: string;
    max_tokens: number;
    temperature: number;
    custom_url?: string;
    reverse_proxy?: string;
    proxy_password?: string;
    custom_prompt_post_processing?:
        | 'NONE'
        | 'MERGE_TOOLS'
        | 'SEMI_TOOLS'
        | 'STRICT_TOOLS'
        | string;
    use_makersuite_sysprompt?: boolean;
    claude_use_sysprompt?: boolean;
    json_schema?: Record<string, any>;
}

export interface ExtractedData {
    content: string;
    reasoning: string;
}

export interface ChatCompletionService {
    TYPE: string;

    createRequestData(
        custom: Partial<ChatCompletionPayload>,
    ): ChatCompletionPayload;

    sendRequest(
        data: ChatCompletionPayload,
        extractData?: boolean,
        signal?: AbortSignal | null,
    ): Promise<ExtractedData | (() => AsyncGenerator<StreamResponse>)>;

    processRequest(
        custom: Partial<ChatCompletionPayload>,
        options: {
            presetName?: string;
        },
        extractData?: boolean,
        signal?: AbortSignal | null,
    ): Promise<ExtractedData | (() => AsyncGenerator<StreamResponse>)>;

    presetToGeneratePayload(
        preset: any,
        customParams?: any,
    ): ChatCompletionPayload;
}

export interface TextCompletionRequestBase {
    max_tokens: number;
    model: string;
    api_type: string;
    api_server?: string;
    temperature: number;
    min_p: number;
}

export interface TextCompletionPayload extends TextCompletionRequestBase {
    stream?: boolean;
    prompt: string;
    max_new_tokens: number;
    stopping_strings?: string[];
    stop?: string[];
}

export interface TextCompletionService {
    TYPE: string;

    createRequestData(
        custom: Record<string, any> &
            TextCompletionRequestBase & {
            prompt: string;
        },
    ): TextCompletionPayload;

    sendRequest(
        data: TextCompletionPayload,
        extractData?: boolean,
        signal?: AbortSignal | null,
    ): Promise<ExtractedData | (() => AsyncGenerator<StreamResponse>)>;

    processRequest(
        custom: Record<string, any> &
            TextCompletionRequestBase & {
            prompt:
                | (ChatCompletionMessage & { ignoreInstruct?: boolean })[]
                | string;
        },
        options?: {
            presetName?: string;
            instructName?: string;
            instructSettings?: Partial<InstructSettings>;
        },
        extractData?: boolean,
        signal?: AbortSignal | null,
    ): Promise<ExtractedData | (() => AsyncGenerator<StreamResponse>)>;

    presetToGeneratePayload(
        preset: any,
        customPreset?: any,
    ): TextCompletionPayload;
}

export interface ConnectionProfile {
    id: string;
    name: string;
    api: string;
    model: string;
    preset: string;
    instruct: string;
    proxy?: string;
    'api-url'?: string;
    'prompt-post-processing'?: any;
}

export interface ConnectionManagerRequestService {
    defaultSendRequestParams: {
        stream: boolean;
        signal: AbortSignal | null;
        extractData: boolean;
        includePreset: boolean;
        includeInstruct: boolean;
        instructSettings: Partial<InstructSettings>;
    };

    getAllowedTypes(): Record<string, string>;

    sendRequest(
        profileId: string,
        prompt: string | (any & { ignoreInstruct?: boolean })[],
        maxTokens: number,
        custom?: Partial<any>,
        overridePayload?: Record<string, any>,
    ): Promise<ExtractedData | (() => AsyncGenerator<StreamResponse>)>;

    getSupportedProfiles(): ConnectionProfile[];

    isProfileSupported(profile?: ConnectionProfile): boolean;

    validateProfile(profile?: ConnectionProfile): {
        selected: string;
        source?: string;
        type?: string;
    };

    handleDropdown(
        selector: string,
        initialSelectedProfileId: string,
        onChange?: (profile?: ConnectionProfile) => Promise<void> | void,
        onCreate?: (profile: ConnectionProfile) => Promise<void> | void,
        onUpdate?: (
            oldProfile: ConnectionProfile,
            newProfile: ConnectionProfile,
        ) => Promise<void> | void,
        onDelete?: (profile: ConnectionProfile) => Promise<void> | void,
    ): void;
}
