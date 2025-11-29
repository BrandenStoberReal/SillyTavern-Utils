# SillyTavern-Utils

A Typescript utility library for SillyTavern.

## Installation

To install the library, you can clone the repository and build it yourself, or you can install it from NPM.

```bash
npm install sillytavern-utils
```

## Usage

You can import the utilities from the library like this:

```typescript
import {AddCheckbox} from 'sillytavern-utils';

AddCheckbox(parentElement, {
    id: `cool-checkbox`,
    label: 'My Cool Checkbox',
    labelClass: 'normal',
    description: 'A very cool checkbox for very cool things',
    value: false,
}, (value) => console.log('Cool checkbox changed state to: ' + value));
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
