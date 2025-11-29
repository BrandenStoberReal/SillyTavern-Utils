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

// Main ValueTracker API class
export class ValueTrackerAPI {
    private baseUrl: string;
    private extensionId?: string;

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
        return this.apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({extensionId})
        }, false); // Registration doesn't require extension ID header
    }

    // Extension Registration Methods

    /**
     * Deregister an extension from the ValueTracker plugin
     * @param extensionId The ID of the extension to deregister
     * @returns Promise resolving to the deregistration response
     */
    async deregisterExtension(extensionId: string): Promise<RegistrationResponse> {
        return this.apiRequest('/register', {
            method: 'DELETE',
            body: JSON.stringify({extensionId})
        }, false); // Deregistration doesn't require extension ID header
    }

    /**
     * Get all characters
     * @returns Promise resolving to an array of Character objects
     */
    async getAllCharacters(): Promise<GetAllCharactersResult> {
        return this.apiRequest('/characters');
    }

    // Character Management Methods

    /**
     * Get a specific character by ID
     * @param id The ID of the character to retrieve
     * @returns Promise resolving to a FullCharacter object
     */
    async getCharacter(id: string): Promise<GetCharacterResult> {
        return this.apiRequest(`/characters/${id}`);
    }

    /**
     * Create or update a character
     * @param characterData The character data to create/update
     * @returns Promise resolving to the created/updated Character object
     */
    async createOrUpdateCharacter(characterData: CreateCharacterRequest): Promise<CreateOrUpdateCharacterResult> {
        return this.apiRequest('/characters', {
            method: 'POST',
            body: JSON.stringify(characterData)
        });
    }

    /**
     * Delete a character by ID
     * @param id The ID of the character to delete
     * @returns Promise resolving to a success response
     */
    async deleteCharacter(id: string): Promise<DeleteCharacterResult> {
        return this.apiRequest(`/characters/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Get all instances for a character
     * @param characterId The ID of the character to get instances for
     * @returns Promise resolving to an array of Instance objects
     */
    async getAllInstancesForCharacter(characterId: string): Promise<GetAllInstancesForCharacterResult> {
        return this.apiRequest(`/characters/${characterId}/instances`);
    }

    // Instance Management Methods

    /**
     * Get a specific instance by ID
     * @param id The ID of the instance to retrieve
     * @returns Promise resolving to a FullInstance object
     */
    async getInstance(id: string): Promise<GetInstanceResult> {
        return this.apiRequest(`/instances/${id}`);
    }

    /**
     * Create or update an instance
     * @param instanceData The instance data to create/update
     * @returns Promise resolving to the created/updated Instance object
     */
    async createOrUpdateInstance(instanceData: CreateInstanceRequest): Promise<CreateOrUpdateInstanceResult> {
        return this.apiRequest('/instances', {
            method: 'POST',
            body: JSON.stringify(instanceData)
        });
    }

    /**
     * Delete an instance by ID
     * @param id The ID of the instance to delete
     * @returns Promise resolving to a success response
     */
    async deleteInstance(id: string): Promise<DeleteInstanceResult> {
        return this.apiRequest(`/instances/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Delete all instances for a character
     * @param characterId The ID of the character to delete all instances for
     * @returns Promise resolving to a success response with deleted count
     */
    async deleteAllInstancesForCharacter(characterId: string): Promise<DeleteAllInstancesForCharacterResult> {
        return this.apiRequest(`/characters/${characterId}/instances`, {
            method: 'DELETE'
        });
    }

    /**
     * Get all data for a specific instance
     * @param id The ID of the instance to get data for
     * @returns Promise resolving to a record containing all key-value pairs
     */
    async getInstanceData(id: string): Promise<GetInstanceDataResult> {
        return this.apiRequest(`/instances/${id}/data`);
    }

    // Data Management Methods

    /**
     * Get a specific data key for an instance
     * @param id The ID of the instance
     * @param key The key to retrieve
     * @returns Promise resolving to an object with the key-value pair
     */
    async getInstanceDataKey(id: string, key: string): Promise<GetInstanceDataKeyResult> {
        return this.apiRequest(`/instances/${id}/data/${key}`);
    }

    /**
     * Create or update a data key-value pair for an instance
     * @param id The ID of the instance
     * @param key The key to create/update
     * @param value The value to set
     * @returns Promise resolving to a success response with the key and value
     */
    async createOrUpdateInstanceData(id: string, key: string, value: any): Promise<CreateOrUpdateInstanceDataResult> {
        return this.apiRequest(`/instances/${id}/data`, {
            method: 'POST',
            body: JSON.stringify({key, value})
        });
    }

    /**
     * Alternative method to create or update a data key-value pair for an instance
     * @param id The ID of the instance
     * @param key The key to create/update
     * @param value The value to set
     * @returns Promise resolving to a success response with the key and value
     */
    async createOrUpdateInstanceDataAlt(id: string, key: string, value: any): Promise<CreateOrUpdateInstanceDataResult> {
        return this.apiRequest(`/instances/${id}/data`, {
            method: 'PUT',
            body: JSON.stringify({key, value})
        });
    }

    /**
     * Delete a specific data key for an instance
     * @param id The ID of the instance
     * @param key The key to delete
     * @returns Promise resolving to a success response
     */
    async deleteInstanceDataKey(id: string, key: string): Promise<DeleteInstanceDataKeyResult> {
        return this.apiRequest(`/instances/${id}/data/${key}`, {
            method: 'DELETE'
        });
    }

    /**
     * Clear all data for an instance
     * @param id The ID of the instance to clear data for
     * @returns Promise resolving to a success response
     */
    async clearInstanceData(id: string): Promise<ClearInstanceDataResult> {
        return this.apiRequest(`/instances/${id}/data`, {
            method: 'DELETE'
        });
    }

    /**
     * Override all data for an instance with new data
     * @param id The ID of the instance
     * @param data The new data to set (will replace all existing data)
     * @returns Promise resolving to a success response
     */
    async overrideInstanceData(id: string, data: OverrideInstanceDataRequest): Promise<OverrideInstanceDataResult> {
        return this.apiRequest(`/instances/${id}/data/override`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Complex Operations

    /**
     * Merge new data with existing data for an instance
     * @param id The ID of the instance
     * @param data The data to merge with existing data
     * @returns Promise resolving to a success response
     */
    async mergeInstanceData(id: string, data: OverrideInstanceDataRequest): Promise<MergeInstanceDataResult> {
        return this.apiRequest(`/instances/${id}/data/merge`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Remove specific data keys from an instance
     * @param id The ID of the instance
     * @param keys The array of keys to remove
     * @returns Promise resolving to a success response with removed count
     */
    async removeInstanceDataKeys(id: string, keys: string[]): Promise<RemoveInstanceDataKeysResult> {
        return this.apiRequest(`/instances/${id}/data/remove`, {
            method: 'PUT',
            body: JSON.stringify({keys})
        });
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

    // Cross-Extension Reading Methods (no extension ID required)

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

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (includeExtensionId && this.extensionId) {
            (headers as Record<string, string>)['x-extension-id'] = this.extensionId;
        }

        try {
            logInfo(`Making ${options.method || 'GET'} request to ${url}`);
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            logError(`API request to ${url} failed:`, error);
            throw error;
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
};

/**
 * Get the current extension ID used by the API
 * @returns The current extension ID
 */
export const getValueTrackerExtensionId = (): string | undefined => {
    return valueTrackerAPI.getExtensionId();
};