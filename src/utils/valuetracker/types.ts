/**
 * Type definitions for the ValueTracker API
 */

// Type definitions based on the ValueTracker API schema
export interface Character {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Instance {
    id: string;
    characterId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FullCharacter {
    character: Character;
    instances: FullInstance[];
}

export interface FullInstance {
    instance: Instance;
    data: Record<string, any>;
}

export interface RegisterExtensionRequest {
    extensionId: string;
}

export interface CreateCharacterRequest {
    id: string;
    name: string;
}

export interface CreateInstanceRequest {
    id: string;
    characterId: string;
    name: string;
}

export interface CreateInstanceDataRequest {
    key: string;
    value: any;
}

export interface OverrideInstanceDataRequest {
    [key: string]: any;
}

export interface RemoveInstanceDataRequest {
    keys: string[];
}

export interface ErrorResponse {
    success?: boolean;
    message?: string;
    code?: number;
}

export interface RegistrationResponse {
    success: boolean;
    message: string;
}

export interface SuccessResponse {
    success: boolean;
}

export interface DeleteAllInstancesResponse {
    success: boolean;
    deletedCount: number;
}

export interface CreateOrUpdateInstanceDataResponse {
    success: boolean;
    key: string;
    value: any;
}

export interface OverrideInstanceDataResponse {
    success: boolean;
    message: string;
}

export interface RemoveInstanceDataResponse {
    success: boolean;
    removedCount: number;
}

export interface InstanceDataKeyResponse {
    [key: string]: any;
}

// API Method Result Types
export type GetAllCharactersResult = Character[];
export type GetCharacterResult = FullCharacter;
export type CreateOrUpdateCharacterResult = Character;
export type DeleteCharacterResult = SuccessResponse;

export type GetAllInstancesForCharacterResult = Instance[];
export type GetInstanceResult = FullInstance;
export type CreateOrUpdateInstanceResult = Instance;
export type DeleteInstanceResult = SuccessResponse;
export type DeleteAllInstancesForCharacterResult = DeleteAllInstancesResponse;

export type GetInstanceDataResult = Record<string, any>;
export type GetInstanceDataKeyResult = InstanceDataKeyResponse;
export type CreateOrUpdateInstanceDataResult = CreateOrUpdateInstanceDataResponse;
export type DeleteInstanceDataKeyResult = SuccessResponse;
export type ClearInstanceDataResult = SuccessResponse;

export type OverrideInstanceDataResult = OverrideInstanceDataResponse;
export type MergeInstanceDataResult = OverrideInstanceDataResponse;
export type RemoveInstanceDataKeysResult = RemoveInstanceDataResponse;

// Cross-extension result types are the same as regular ones
export type GetCrossExtensionCharacterResult = FullCharacter;
export type GetCrossExtensionInstanceResult = FullInstance;
export type GetCrossExtensionInstanceDataResult = Record<string, any>;
export type GetCrossExtensionInstanceDataKeyResult = InstanceDataKeyResponse;
export type GetAllCrossExtensionCharactersResult = Character[];
export type GetCrossExtensionInstancesByCharacterResult = Instance[];