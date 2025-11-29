export interface ToolManager {
    registerFunctionTool(tool: any): void;

    unregisterFunctionTool(name: string): void;

    isToolCallingSupported(): boolean;

    canPerformToolCalls(type: string): boolean;

    invokeFunctionTools(data: any): Promise<any>;

    hasToolCalls(data: any): boolean;

    saveFunctionToolInvocations(invocations: any[]): Promise<void>;

    showToolCallError(errors: Error[]): void;

    initToolSlashCommands(): void;
}
