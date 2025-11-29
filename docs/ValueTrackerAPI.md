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

### Data Management

#### Store Data in an Instance

```typescript
const response = await valueTrackerAPI.createOrUpdateInstanceData(
  'instance-456',
  'health',
  100
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
    
    // Retrieve the data
    const data = await valueTrackerAPI.getInstanceData('instance-456');
    console.log('Instance data:', data);
    
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