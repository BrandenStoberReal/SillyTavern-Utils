/**
 * Type definitions for the ValueTracker API
 */

// Type definitions based on the ValueTracker API schema
export interface Character {
    id: string;
    name: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface Instance {
    id: string;
    characterId: string;
    name: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
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

export interface UpdateCharacterRequest {
    id: string;
    name?: string;
}

export interface UpdateInstanceRequest {
    id: string;
    characterId?: string;
    name?: string;
}

export interface CreateInstanceDataRequest {
    key: string;
    value: any;
}

export interface OverrideInstanceDataRequest {
    [key: string]: any;
}

export interface UpdateInstanceDataRequest {
    [key: string]: any;
}

export interface RemoveInstanceDataRequest {
    keys: string[];
}

export interface BaseResponse {
    success: boolean;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    code?: number;
}

export interface RegistrationResponse extends BaseResponse {
    success: true;
    message: string;
}

export interface SuccessResponse extends BaseResponse {
}

export interface DeleteAllInstancesResponse extends BaseResponse {
    deletedCount: number;
}

export interface CreateOrUpdateInstanceDataResponse extends BaseResponse {
    key: string;
    value: any;
}

export interface OverrideInstanceDataResponse extends BaseResponse {
}

export interface RemoveInstanceDataResponse extends BaseResponse {
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