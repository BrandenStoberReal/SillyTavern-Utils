/**
 * ValueTracker API Utility for SillyTavern
 * Provides a comprehensive wrapper for interacting with the ValueTracker plugin API
 */

import {logError, logInfo} from '../logging/logger';
import {
    ClearInstanceDataResult,
    CreateCharacterRequest,
    CreateInstanceRequest,
    CreateOrUpdateCharacterResult,
    CreateOrUpdateInstanceDataResult,
    CreateOrUpdateInstanceResult,
    DeleteAllInstancesForCharacterResult,
    DeleteCharacterResult,
    DeleteInstanceDataKeyResult,
    DeleteInstanceResult,
    GetAllCharactersResult,
    GetAllCrossExtensionCharactersResult,
    GetAllInstancesForCharacterResult,
    GetCharacterResult,
    GetCrossExtensionCharacterResult,
    GetCrossExtensionInstanceDataKeyResult,
    GetCrossExtensionInstanceDataResult,
    GetCrossExtensionInstanceResult,
    GetCrossExtensionInstancesByCharacterResult,
    GetInstanceDataKeyResult,
    GetInstanceDataResult,
    GetInstanceResult,
    MergeInstanceDataResult,
    OverrideInstanceDataRequest,
    OverrideInstanceDataResult,
    RegistrationResponse,
    RemoveInstanceDataKeysResult
} from './types';
import {ContextUtil} from "../context";

// Custom error class for ValueTracker API errors
export class ValueTrackerError extends Error {
    public readonly statusCode?: number;
    public readonly details?: any;

    constructor(message: string, statusCode?: number, details?: any) {
        super(message);
        this.name = 'ValueTrackerError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

// Main ValueTracker API class
export class ValueTrackerAPI {
    private baseUrl: string;
    private extensionId?: string;
    private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

    constructor(extensionId?: string) {
        this.baseUrl = '/api/plugins/valuetracker';
        this.extensionId = extensionId;
    }

    /**
     * Set the extension ID for this API instance
     * @param extensionId The extension ID to use for API requests
     */
    setExtensionId(extensionId: string): void {
        this.extensionId = extensionId;
    }

    /**
     * Clear the internal cache
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Remove specific cache entries
     * @param keys The keys to remove from cache
     */
    removeCacheEntries(...keys: string[]): void {
        for (const key of keys) {
            this.cache.delete(key);
        }
    }

    /**
     * Get the current extension ID
     * @returns The current extension ID
     */
    getExtensionId(): string | undefined {
        return this.extensionId;
    }

    /**
     * Register an extension with the ValueTracker plugin
     * @param extensionId The ID of the extension to register
     * @returns Promise resolving to the registration response
     */
    async registerExtension(extensionId: string): Promise<RegistrationResponse> {
        const headers = await this.getSillyTavernHeaders();
        headers['Content-Type'] = 'application/json';

        return this.apiRequest('/register', {
            method: 'POST',
            headers,
            body: JSON.stringify({extensionId})
        }, false); // Registration doesn't require extension ID header
    }

    /**
     * Deregister an extension from the ValueTracker plugin
     * @param extensionId The ID of the extension to deregister
     * @returns Promise resolving to the deregistration response
     */
    async deregisterExtension(extensionId: string): Promise<RegistrationResponse> {
        const headers = await this.getSillyTavernHeaders();
        headers['Content-Type'] = 'application/json';

        const result = await this.apiRequest<RegistrationResponse>('/register', {
            method: 'DELETE',
            headers,
            body: JSON.stringify({extensionId})
        }, false); // Deregistration doesn't require extension ID header

        // Clear cache on deregistration
        this.clearCache();

        return result;
    }

    /**
     * Get all characters
     * @returns Promise resolving to an array of Character objects
     */
    async getAllCharacters(): Promise<GetAllCharactersResult> {
        const cacheKey = 'all-characters';
        const cached = this.getFromCache<GetAllCharactersResult>(cacheKey);
        if (cached) {
            return cached;
        }

        const result = await this.apiRequest<GetAllCharactersResult>('/characters');
        this.setCache(cacheKey, result);
        return result;
    }

    /**
     * Get a specific character by ID
     * @param id The ID of the character to retrieve
     * @returns Promise resolving to a FullCharacter object
     */
    async getCharacter(id: string): Promise<GetCharacterResult> {
        this.validateId(id, 'character id');

        const cacheKey = `character:${id}`;
        const cached = this.getFromCache<GetCharacterResult>(cacheKey);
        if (cached) {
            return cached;
        }

        const result = await this.apiRequest<GetCharacterResult>(`/characters/${id}`);
        this.setCache(cacheKey, result);
        return result;
    }

    /**
     * Create or update a character
     * @param characterData The character data to create/update
     * @returns Promise resolving to the created/updated Character object
     */
    async createOrUpdateCharacter(characterData: CreateCharacterRequest): Promise<CreateOrUpdateCharacterResult> {
        const result = await this.apiRequest<CreateOrUpdateCharacterResult>('/characters', {
            method: 'POST',
            body: JSON.stringify(characterData)
        });

        // Invalidate related cache entries
        this.removeCacheEntries('all-characters', `character:${characterData.id}`);

        return result;
    }

    /**
     * Delete a character by ID
     * @param id The ID of the character to delete
     * @returns Promise resolving to a success response
     */
    async deleteCharacter(id: string): Promise<DeleteCharacterResult> {
        const result = await this.apiRequest<DeleteCharacterResult>(`/characters/${id}`, {
            method: 'DELETE'
        });

        // Invalidate related cache entries
        this.removeCacheEntries('all-characters', `character:${id}`, `instances:${id}`);

        return result;
    }

    /**
     * Get all instances for a character
     * @param characterId The ID of the character to get instances for
     * @returns Promise resolving to an array of Instance objects
     */
    async getAllInstancesForCharacter(characterId: string): Promise<GetAllInstancesForCharacterResult> {
        const cacheKey = `instances:${characterId}`;
        const cached = this.getFromCache<GetAllInstancesForCharacterResult>(cacheKey);
        if (cached) {
            return cached;
        }

        const result = await this.apiRequest<GetAllInstancesForCharacterResult>(`/characters/${characterId}/instances`);
        this.setCache(cacheKey, result);
        return result;
    }

    // Extension Registration Methods

    /**
     * Get a specific instance by ID
     * @param id The ID of the instance to retrieve
     * @returns Promise resolving to a FullInstance object
     */
    async getInstance(id: string): Promise<GetInstanceResult> {
        const cacheKey = `instance:${id}`;
        const cached = this.getFromCache<GetInstanceResult>(cacheKey);
        if (cached) {
            return cached;
        }

        const result = await this.apiRequest<GetInstanceResult>(`/instances/${id}`);
        this.setCache(cacheKey, result);
        return result;
    }

    /**
     * Create or update an instance
     * @param instanceData The instance data to create/update
     * @returns Promise resolving to the created/updated Instance object
     */
    async createOrUpdateInstance(instanceData: CreateInstanceRequest): Promise<CreateOrUpdateInstanceResult> {
        const result = await this.apiRequest<CreateOrUpdateInstanceResult>('/instances', {
            method: 'POST',
            body: JSON.stringify(instanceData)
        });

        // Invalidate related cache entries
        this.removeCacheEntries(
            `instance:${instanceData.id}`,
            `instances:${instanceData.characterId}`,
            `character:${instanceData.characterId}`
        );

        return result;
    }

    // Character Management Methods

    /**
     * Delete an instance by ID
     * @param id The ID of the instance to delete
     * @returns Promise resolving to a success response
     */
    async deleteInstance(id: string): Promise<DeleteInstanceResult> {
        const result = await this.apiRequest<DeleteInstanceResult>(`/instances/${id}`, {
            method: 'DELETE'
        });

        // Find the characterId for this instance to invalidate the correct cache
        // Since we don't have the characterId here, we'll clear the instance data cache
        this.removeCacheEntries(`instance:${id}`, `instance-data:${id}`);

        return result;
    }

    /**
     * Delete all instances for a character
     * @param characterId The ID of the character to delete all instances for
     * @returns Promise resolving to a success response with deleted count
     */
    async deleteAllInstancesForCharacter(characterId: string): Promise<DeleteAllInstancesForCharacterResult> {
        const result = await this.apiRequest<DeleteAllInstancesForCharacterResult>(`/characters/${characterId}/instances`, {
            method: 'DELETE'
        });

        // Invalidate related cache entries
        this.removeCacheEntries(`instances:${characterId}`);

        return result;
    }

    /**
     * Get all data for a specific instance
     * @param id The ID of the instance to get data for
     * @returns Promise resolving to a record containing all key-value pairs
     */
    async getInstanceData(id: string): Promise<GetInstanceDataResult> {
        const cacheKey = `instance-data:${id}`;
        const cached = this.getFromCache<GetInstanceDataResult>(cacheKey);
        if (cached) {
            return cached;
        }

        const result = await this.apiRequest<GetInstanceDataResult>(`/instances/${id}/data`);
        this.setCache(cacheKey, result);
        return result;
    }

    /**
     * Get a specific data key for an instance
     * @param id The ID of the instance
     * @param key The key to retrieve
     * @returns Promise resolving to an object with the key-value pair
     */
    async getInstanceDataKey(id: string, key: string): Promise<GetInstanceDataKeyResult> {
        const cacheKey = `instance-data-key:${id}:${key}`;
        const cached = this.getFromCache<GetInstanceDataKeyResult>(cacheKey);
        if (cached) {
            return cached;
        }

        const result = await this.apiRequest<GetInstanceDataKeyResult>(`/instances/${id}/data/${key}`);
        this.setCache(cacheKey, result);
        return result;
    }

    // Instance Management Methods

    /**
     * Create or update a data key-value pair for an instance
     * @param id The ID of the instance
     * @param key The key to create/update
     * @param value The value to set
     * @returns Promise resolving to a success response with the key and value
     */
    async createOrUpdateInstanceData(id: string, key: string, value: any): Promise<CreateOrUpdateInstanceDataResult> {
        const result = await this.apiRequest<CreateOrUpdateInstanceDataResult>(`/instances/${id}/data`, {
            method: 'POST',
            body: JSON.stringify({key, value})
        });

        // Invalidate instance data cache
        this.removeCacheEntries(`instance-data:${id}`);

        return result;
    }

    /**
     * Alternative method to create or update a data key-value pair for an instance
     * @param id The ID of the instance
     * @param key The key to create/update
     * @param value The value to set
     * @returns Promise resolving to a success response with the key and value
     */
    async createOrUpdateInstanceDataAlt(id: string, key: string, value: any): Promise<CreateOrUpdateInstanceDataResult> {
        const result = await this.apiRequest<CreateOrUpdateInstanceDataResult>(`/instances/${id}/data`, {
            method: 'PUT',
            body: JSON.stringify({key, value})
        });

        // Invalidate instance data cache
        this.removeCacheEntries(`instance-data:${id}`);

        return result;
    }

    /**
     * Delete a specific data key for an instance
     * @param id The ID of the instance
     * @param key The key to delete
     * @returns Promise resolving to a success response
     */
    async deleteInstanceDataKey(id: string, key: string): Promise<DeleteInstanceDataKeyResult> {
        const result = await this.apiRequest<DeleteInstanceDataKeyResult>(`/instances/${id}/data/${key}`, {
            method: 'DELETE'
        });

        // Invalidate instance data cache
        this.removeCacheEntries(`instance-data:${id}`);

        return result;
    }

    /**
     * Clear all data for an instance
     * @param id The ID of the instance to clear data for
     * @returns Promise resolving to a success response
     */
    async clearInstanceData(id: string): Promise<ClearInstanceDataResult> {
        const result = await this.apiRequest<ClearInstanceDataResult>(`/instances/${id}/data`, {
            method: 'DELETE'
        });

        // Invalidate instance data cache
        this.removeCacheEntries(`instance-data:${id}`);

        return result;
    }

    /**
     * Override all data for an instance with new data
     * @param id The ID of the instance
     * @param data The new data to set (will replace all existing data)
     * @returns Promise resolving to a success response
     */
    async overrideInstanceData(id: string, data: OverrideInstanceDataRequest): Promise<OverrideInstanceDataResult> {
        const result = await this.apiRequest<OverrideInstanceDataResult>(`/instances/${id}/data/override`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        // Invalidate instance data cache
        this.removeCacheEntries(`instance-data:${id}`);

        return result;
    }

    // Data Management Methods

    /**
     * Merge new data with existing data for an instance
     * @param id The ID of the instance
     * @param data The data to merge with existing data
     * @returns Promise resolving to a success response
     */
    async mergeInstanceData(id: string, data: OverrideInstanceDataRequest): Promise<MergeInstanceDataResult> {
        const result = await this.apiRequest<MergeInstanceDataResult>(`/instances/${id}/data/merge`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        // Invalidate instance data cache
        this.removeCacheEntries(`instance-data:${id}`);

        return result;
    }

    /**
     * Remove specific data keys from an instance
     * @param id The ID of the instance
     * @param keys The array of keys to remove
     * @returns Promise resolving to a success response with removed count
     */
    async removeInstanceDataKeys(id: string, keys: string[]): Promise<RemoveInstanceDataKeysResult> {
        const result = await this.apiRequest<RemoveInstanceDataKeysResult>(`/instances/${id}/data/remove`, {
            method: 'PUT',
            body: JSON.stringify({keys})
        });

        // Invalidate instance data cache
        this.removeCacheEntries(`instance-data:${id}`);

        return result;
    }

    /**
     * Get a character from another extension
     * @param extensionId The ID of the target extension
     * @param id The ID of the character to retrieve
     * @returns Promise resolving to a FullCharacter object
     */
    async getCrossExtensionCharacter(extensionId: string, id: string): Promise<GetCrossExtensionCharacterResult> {
        return this.apiRequest(`/cross-extension/characters/${extensionId}/${id}`, {}, false);
    }

    /**
     * Get an instance from another extension
     * @param extensionId The ID of the target extension
     * @param id The ID of the instance to retrieve
     * @returns Promise resolving to a FullInstance object
     */
    async getCrossExtensionInstance(extensionId: string, id: string): Promise<GetCrossExtensionInstanceResult> {
        return this.apiRequest(`/cross-extension/instances/${extensionId}/${id}`, {}, false);
    }

    /**
     * Get all data for an instance from another extension
     * @param extensionId The ID of the target extension
     * @param id The ID of the instance to get data for
     * @returns Promise resolving to a record containing all key-value pairs
     */
    async getCrossExtensionInstanceData(extensionId: string, id: string): Promise<GetCrossExtensionInstanceDataResult> {
        return this.apiRequest(`/cross-extension/instances/${extensionId}/${id}/data`, {}, false);
    }

    /**
     * Get a specific data key for an instance from another extension
     * @param extensionId The ID of the target extension
     * @param id The ID of the instance
     * @param key The key to retrieve
     * @returns Promise resolving to an object with the key-value pair
     */
    async getCrossExtensionInstanceDataKey(extensionId: string, id: string, key: string): Promise<GetCrossExtensionInstanceDataKeyResult> {
        return this.apiRequest(`/cross-extension/instances/${extensionId}/${id}/data/${key}`, {}, false);
    }

    // Complex Operations

    /**
     * Get all characters from another extension
     * @param extensionId The ID of the target extension
     * @returns Promise resolving to an array of Character objects
     */
    async getAllCrossExtensionCharacters(extensionId: string): Promise<GetAllCrossExtensionCharactersResult> {
        return this.apiRequest(`/cross-extension/characters/${extensionId}`, {}, false);
    }

    /**
     * Get all instances for a character from another extension
     * @param extensionId The ID of the target extension
     * @param characterId The ID of the character to get instances for
     * @returns Promise resolving to an array of Instance objects
     */
    async getCrossExtensionInstancesByCharacter(extensionId: string, characterId: string): Promise<GetCrossExtensionInstancesByCharacterResult> {
        return this.apiRequest(`/cross-extension/characters/${extensionId}/${characterId}/instances`, {}, false);
    }

    /**
     * Get data from cache if available and not expired
     * @param key The cache key
     * @returns The cached data or undefined if not available or expired
     */
    private getFromCache<T>(key: string): T | undefined {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return cached.data as T;
        }
        // Remove expired entry
        if (cached) {
            this.cache.delete(key);
        }
        return undefined;
    }

    // Cross-Extension Reading Methods (no extension ID required)

    /**
     * Store data in cache
     * @param key The cache key
     * @param data The data to cache
     * @param ttl Time to live in milliseconds (default: 5 minutes)
     */
    private setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void { // 5 minutes default
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * Validates an ID parameter
     * @param id The ID to validate
     * @param paramName The name of the parameter for error messages
     */
    private validateId(id: string, paramName: string = 'id'): void {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw new ValueTrackerError(`Invalid ${paramName}: must be a non-empty string`);
        }
    }

    /**
     * Validates a key parameter
     * @param key The key to validate
     */
    private validateKey(key: string): void {
        if (!key || typeof key !== 'string' || key.trim().length === 0) {
            throw new ValueTrackerError('Invalid key: must be a non-empty string');
        }
    }

    /**
     * Validates extension ID
     * @param extensionId The extension ID to validate
     */
    private validateExtensionId(extensionId: string): void {
        if (!extensionId || typeof extensionId !== 'string' || extensionId.trim().length === 0) {
            throw new ValueTrackerError('Invalid extensionId: must be a non-empty string');
        }
    }

    /**
     * Gets the default headers from SillyTavern context
     * @returns Promise resolving to the default headers object
     */
    private async getSillyTavernHeaders(): Promise<Record<string, string>> {
        try {
            const contextUtil = new ContextUtil();
            const ctx = await contextUtil.fetchSillyTavernContext();
            return ctx.getRequestHeaders();
        } catch (error) {
            logError('Could not get SillyTavern headers:', error);
            // Return basic fallback headers
            return {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            };
        }
    }

    /**
     * Internal method to make API requests
     * @param endpoint The API endpoint to call
     * @param options Request options including method, headers, and body
     * @param includeExtensionId Whether to include the extension ID header
     * @returns Promise resolving to the API response
     */
    private async apiRequest<T>(
        endpoint: string,
        options: RequestInit = {},
        includeExtensionId: boolean = true,
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        // Validate endpoint parameter
        if (!endpoint || typeof endpoint !== 'string') {
            throw new ValueTrackerError('Invalid endpoint parameter');
        }

        // Get default headers from SillyTavern context
        const defaultHeaders = await this.getSillyTavernHeaders();

        // Build headers with SillyTavern defaults as base, then override with options
        const headers: Record<string, string> = {
            ...defaultHeaders,
            ...(options.headers as Record<string, string> || {}),
        };

        if (includeExtensionId && this.extensionId) {
            headers['x-extension-id'] = this.extensionId;
        }

        try {
            logInfo(`Making ${options.method || 'GET'} request to ${url}`);
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                throw new ValueTrackerError(
                    `API request failed: ${response.status} - ${errorText}`,
                    response.status,
                    {url, method: options.method || 'GET', endpoint}
                );
            }

            // Check if response is empty before parsing JSON
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return undefined as T;
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ValueTrackerError) {
                logError(`ValueTracker API Error: ${error.message}`, error.details);
                throw error;
            } else {
                logError(`API request to ${url} failed:`, error);
                throw new ValueTrackerError(
                    `Network error: ${(error as Error).message || 'Unknown network error'}`,
                    undefined,
                    {url, method: options.method || 'GET', endpoint}
                );
            }
        }
    }
}

// Default instance of the API
export const valueTrackerAPI = new ValueTrackerAPI();

// Convenience functions that use the default API instance

/**
 * Initialize the ValueTracker API with an extension ID
 * @param extensionId The extension ID to use for API requests
 */
export const initializeValueTrackerAPI = (extensionId: string): void => {
    valueTrackerAPI.setExtensionId(extensionId);
    // Clear cache when initializing with a new extension ID
    valueTrackerAPI.clearCache();
};

/**
 * Get the current extension ID used by the API
 * @returns The current extension ID
 */
export const getValueTrackerExtensionId = (): string | undefined => {
    return valueTrackerAPI.getExtensionId();
};