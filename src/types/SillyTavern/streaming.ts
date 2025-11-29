export interface StreamResponse {
    text: string;
    swipes: string[];
    state: {
        reasoning: string;
        image?: string;
    };
}

export interface StreamingProcessor {
    generator: AsyncGenerator<any, void, unknown>;
    isFinished: boolean;
    isStopped: boolean;
    messageId: number;
    firstMessageText: string;
    toolCalls: any[];
    result: string;

    readonly type: string;
    readonly force_name2: boolean;
    readonly generation_started: Date;
    readonly continue_mag: string;
    readonly promptReasoning: any;

    generate(): Promise<any>;

    onStopStreaming(): void;

    onFinishStreaming(messageId: number, getMessage: string): Promise<void>;
}
