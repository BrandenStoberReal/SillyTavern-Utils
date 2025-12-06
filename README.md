# SillyTavern-Utils

A collection of TypeScript utilities and type definitions for SillyTavern.

## About

This library provides a set of utilities, UI components, and comprehensive TypeScript type definitions to aid in the
development of extensions and scripts for SillyTavern.

It is divided into four main parts:

- **Main Package**: Re-exports all utilities, types, and styles.
- **Types**: A comprehensive set of TypeScript types for SillyTavern objects.
- **Utils**: A collection of utility functions for creating UI elements, logging, and interacting with the SillyTavern
  context.
- **Styles**: CSS styles that can be imported into your project.

## Installation

To install the library, you can use npm:

```bash
npm install sillytavern-utils
```

## Usage

You can import from the main package, or from the specific sub-packages.

### Main Package

The main package re-exports everything from the other sub-packages.

```typescript
import { AddHeaderButton, type Character } from 'sillytavern-utils';
```

### Utils

The `utils` package provides a collection of utility functions for creating UI elements, logging, and interacting with
the SillyTavern context.

```typescript
import { AddHeaderButton } from 'sillytavern-utils/utils';

const { content, remove } = AddHeaderButton({
    id: 'my-cool-extension',
    iconName: 'my-cool-icon',
    title: 'My Cool Extension',
    position: 'last',
});

// Add content to the drawer
content.innerHTML = '<h1>My Cool Extension</h1>';
```

### Types

The `types` package provides a comprehensive set of TypeScript types for SillyTavern objects.

```typescript
import type { Character } from 'sillytavern-utils/types';

function doSomethingWithCharacter(character: Character) {
    console.log(character.name);
}
```

### Styles

The `styles` package provides CSS styles that can be imported into your project.

```typescript
import 'sillytavern-utils/styles';
```

## Building from source

To build the library from source, you'll need to have Node.js and npm installed.

1. Clone the repository:

   ```bash
   git clone https://github.com/SillyTavern/SillyTavern-Utils.git
   ```

2. Install the dependencies:

   ```bash
   cd SillyTavern-Utils
   npm install
   ```

3. Build the library:

   ```bash
   npm run build
   ```

   The bundled library will be located in the `dist` directory.

## Repository

The source code is available on
GitHub: [https://github.com/SillyTavern/SillyTavern-Utils](https://github.com/SillyTavern/SillyTavern-Utils)

## License

This project is licensed under the ISC License.
