# ValueTracker API Utility Documentation

The ValueTracker API utility provides a comprehensive wrapper for interacting with the ValueTracker plugin API in
SillyTavern. This utility simplifies operations for tracking and managing character-related values, instances, and data.

## Installation

To use the ValueTracker API utility, import it from the SillyTavern Utils package:

```typescript
import { ValueTrackerAPI, valueTrackerAPI, initializeValueTrackerAPI } from 'path/to/sillytavern-utils';
```

## Basic Usage

### Initialization

The utility provides both a default instance and the ability to create custom instances:

```typescript
// Using the default instance with initialization
import { initializeValueTrackerAPI, valueTrackerAPI } from 'path/to/sillytavern-utils';

initializeValueTrackerAPI('my-extension-id');

// Or creating a custom instance
const customAPI = new ValueTrackerAPI('my-extension-id');
```

### Extension Registration

Before using most API methods, register your extension:

```typescript
try {
  const registerResponse = await valueTrackerAPI.registerExtension('my-extension-id');
  console.log('Extension registered:', registerResponse);
} catch (error) {
  console.error('Registration failed:', error);
}
```

### Character Management

#### Create or Update a Character

```typescript
const character = await valueTrackerAPI.createOrUpdateCharacter({
  id: 'char-123',
  name: 'Example Character'
});
```

#### Get All Characters

```typescript
const characters = await valueTrackerAPI.getAllCharacters();
```

#### Get a Specific Character

```typescript
const character = await valueTrackerAPI.getCharacter('char-123');
// Returns a FullCharacter object containing character data and instances
```

#### Delete a Character

```typescript
const response = await valueTrackerAPI.deleteCharacter('char-123');
```

### Instance Management

#### Create or Update an Instance

```typescript
const instance = await valueTrackerAPI.createOrUpdateInstance({
  id: 'instance-456',
  characterId: 'char-123',
  name: 'Example Instance'
});
```

#### Get All Instances for a Character

```typescript
const instances = await valueTrackerAPI.getAllInstancesForCharacter('char-123');
```

#### Get a Specific Instance

```typescript
const instance = await valueTrackerAPI.getInstance('instance-456');
// Returns a FullInstance object containing instance data and values
```

#### Delete an Instance

```typescript
const response = await valueTrackerAPI.deleteInstance('instance-456');
```

#### Delete All Instances for a Character

```typescript
const response = await valueTrackerAPI.deleteAllInstancesForCharacter('char-123');
// Returns a response with success status and deleted count
```

### Data Management

#### Store Data in an Instance

```typescript
const response = await valueTrackerAPI.createOrUpdateInstanceData(
  'instance-456',
  'health',
  100
);
```

#### Alternative Method to Store Data (using PUT instead of POST)

```typescript
const response = await valueTrackerAPI.createOrUpdateInstanceDataAlt(
  'instance-456',
  'mana',
  50
);
```

#### Retrieve All Data for an Instance

```typescript
const data = await valueTrackerAPI.getInstanceData('instance-456');
// Returns an object with all key-value pairs
```

#### Retrieve Specific Data Key

```typescript
const healthData = await valueTrackerAPI.getInstanceDataKey('instance-456', 'health');
```

#### Update Multiple Values at Once

```typescript
const response = await valueTrackerAPI.mergeInstanceData('instance-456', {
  mana: 50,
  stamina: 75,
  level: 5
});
```

#### Override All Instance Data

```typescript
const response = await valueTrackerAPI.overrideInstanceData('instance-456', {
  health: 90,
  mana: 60,
  experience: 1200,
  level: 6
});
```

#### Delete Specific Data Keys

```typescript
const response = await valueTrackerAPI.removeInstanceDataKeys('instance-456', [
  'mana',
  'stamina'
]);
```

#### Delete a Specific Data Key

```typescript
const response = await valueTrackerAPI.deleteInstanceDataKey('instance-456', 'level');
```

#### Clear All Data for an Instance

```typescript
const response = await valueTrackerAPI.clearInstanceData('instance-456');
```

### Cross-Extension Reading

The utility supports reading data from other extensions without requiring your extension ID:

#### Get Character from Another Extension

```typescript
const character = await valueTrackerAPI.getCrossExtensionCharacter(
  'other-extension-id',
  'char-789'
);
```

#### Get Instance from Another Extension

```typescript
const instance = await valueTrackerAPI.getCrossExtensionInstance(
  'other-extension-id',
  'instance-789'
);
```

#### Get Instance Data from Another Extension

```typescript
const data = await valueTrackerAPI.getCrossExtensionInstanceData(
  'other-extension-id',
  'instance-789'
);
```

#### Get Specific Data Key from Another Extension

```typescript
const healthData = await valueTrackerAPI.getCrossExtensionInstanceDataKey(
  'other-extension-id',
  'instance-789',
  'health'
);
```

#### Get All Characters from Another Extension

```typescript
const characters = await valueTrackerAPI.getAllCrossExtensionCharacters('other-extension-id');
```

#### Get All Instances for a Character from Another Extension

```typescript
const instances = await valueTrackerAPI.getCrossExtensionInstancesByCharacter(
  'other-extension-id',
  'char-789'
);
```

## Complete Example

Here's a complete example of using the ValueTracker API:

```typescript
import { initializeValueTrackerAPI, valueTrackerAPI } from 'path/to/sillytavern-utils';

async function example() {
  // Initialize the API with your extension ID
  initializeValueTrackerAPI('my-extension-id');

  try {
    // Register your extension
    await valueTrackerAPI.registerExtension('my-extension-id');

    // Create a character
    const character = await valueTrackerAPI.createOrUpdateCharacter({
      id: 'char-123',
      name: 'Example Character'
    });

    // Create an instance for the character
    const instance = await valueTrackerAPI.createOrUpdateInstance({
      id: 'instance-456',
      characterId: 'char-123',
      name: 'Example Instance'
    });

    // Store some data in the instance
    await valueTrackerAPI.createOrUpdateInstanceData('instance-456', 'health', 100);
    await valueTrackerAPI.createOrUpdateInstanceData('instance-456', 'mana', 50);

    // Alternative method to store data
    await valueTrackerAPI.createOrUpdateInstanceDataAlt('instance-456', 'stamina', 75);

    // Retrieve the data
    const data = await valueTrackerAPI.getInstanceData('instance-456');
    console.log('Instance data:', data);

    // Update multiple values at once
    const mergeResponse = await valueTrackerAPI.mergeInstanceData('instance-456', {
      level: 5,
      experience: 1200
    });

    // Override all instance data
    const overrideResponse = await valueTrackerAPI.overrideInstanceData('instance-456', {
      health: 90,
      mana: 60,
      newStat: 'newValue'
    });

    // When done, deregister your extension
    await valueTrackerAPI.deregisterExtension('my-extension-id');
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## API Reference

For complete API reference, see the TypeScript definitions in the source code. All methods return Promises and include
proper TypeScript typing for better development experience.

### ValueTrackerAPI Methods

- `registerExtension(extensionId: string)`: Register an extension with the ValueTracker plugin
- `deregisterExtension(extensionId: string)`: Deregister an extension from the ValueTracker plugin
- `getAllCharacters()`: Get all characters
- `getCharacter(id: string)`: Get a specific character by ID
- `createOrUpdateCharacter(characterData: CreateCharacterRequest)`: Create or update a character
- `deleteCharacter(id: string)`: Delete a character by ID
- `getAllInstancesForCharacter(characterId: string)`: Get all instances for a character
- `getInstance(id: string)`: Get a specific instance by ID
- `createOrUpdateInstance(instanceData: CreateInstanceRequest)`: Create or update an instance
- `deleteInstance(id: string)`: Delete an instance by ID
- `deleteAllInstancesForCharacter(characterId: string)`: Delete all instances for a character
- `getInstanceData(id: string)`: Get all data for a specific instance
- `getInstanceDataKey(id: string, key: string)`: Get a specific data key for an instance
- `createOrUpdateInstanceData(id: string, key: string, value: any)`: Create or update a data key-value pair
- `createOrUpdateInstanceDataAlt(id: string, key: string, value: any)`: Alternative method to create or update a data
  key-value pair
- `deleteInstanceDataKey(id: string, key: string)`: Delete a specific data key for an instance
- `clearInstanceData(id: string)`: Clear all data for an instance
- `overrideInstanceData(id: string, data: OverrideInstanceDataRequest)`: Override all data for an instance
- `mergeInstanceData(id: string, data: OverrideInstanceDataRequest)`: Merge new data with existing data
- `removeInstanceDataKeys(id: string, keys: string[])`: Remove specific data keys from an instance
- `getCrossExtensionCharacter(extensionId: string, id: string)`: Get a character from another extension
- `getCrossExtensionInstance(extensionId: string, id: string)`: Get an instance from another extension
- `getCrossExtensionInstanceData(extensionId: string, id: string)`: Get all data for an instance from another extension
- `getCrossExtensionInstanceDataKey(extensionId: string, id: string, key: string)`: Get a specific data key for an
  instance from another extension
- `getAllCrossExtensionCharacters(extensionId: string)`: Get all characters from another extension
- `getCrossExtensionInstancesByCharacter(extensionId: string, characterId: string)`: Get all instances for a character
  from another extension

### Convenience Functions

- `initializeValueTrackerAPI(extensionId: string)`: Initialize the default API instance with an extension ID
- `getValueTrackerExtensionId()`: Get the current extension ID used by the API