export interface AccountStorage {
    getItem(key: string): string | null;

    setItem(key: string, value: string): void;

    removeItem(key: string): void;

    getState(): Record<string, string>;
}
