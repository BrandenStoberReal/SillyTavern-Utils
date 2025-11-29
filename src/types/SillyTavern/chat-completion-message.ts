export interface ChatCompletionMessage {
    role: string;
    content: string;
    ignoreInstruct?: boolean;
}
