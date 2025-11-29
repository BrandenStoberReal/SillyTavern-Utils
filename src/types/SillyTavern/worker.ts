export interface ModuleWorkerWrapper {
    update(...args: any[]): Promise<void>;
}

export interface ModuleWorkerWrapperConstructor {
    new(callback: (...args: any[]) => void): ModuleWorkerWrapper;
}
