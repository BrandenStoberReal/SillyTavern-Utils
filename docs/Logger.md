# Logger Utility Documentation

The Logger utility provides a consistent, configurable logging framework for SillyTavern extensions. It offers different
log levels, customizable prefixes, and optional timestamps to help developers debug and monitor their applications
effectively.

## Installation

To use the Logger utility, import it from the SillyTavern Utils package:

```typescript
import { Logger, logger, LogLevel, logDebug, logInfo, logWarn, logError } from 'path/to/sillytavern-utils';
```

## Basic Usage

### Default Logger Instance

The utility provides a default logger instance ready to use:

```typescript
import { logger, logDebug, logInfo, logWarn, logError } from 'path/to/sillytavern-utils';

// Using the default logger instance
logger.info('Application started');
logger.warn('This is a warning message');
logger.error('An error occurred');

// Using convenience functions
logInfo('This is an information message');
logDebug('Debug information');
logWarn('Warning message');
logError('Error message');
```

### Creating Custom Logger Instances

You can create custom logger instances with specific configurations:

```typescript
import { Logger, LogLevel } from 'path/to/sillytavern-utils';

// Create a custom logger with specific options
const customLogger = new Logger({
  level: LogLevel.DEBUG,
  prefix: 'MyExtension',
  timestamp: true
});

customLogger.debug('Debug message with timestamp');
```

## Configuration Options

The Logger accepts the following configuration options:

- `level`: The minimum log level to output (default: `LogLevel.INFO`)
- `prefix`: A prefix to add to each log message (default: `'OutfitsExtension'`)
- `timestamp`: Whether to include timestamps in log messages (default: `true`)

## Log Levels

The Logger supports the following log levels in ascending order of severity:

- `LogLevel.DEBUG` (0): Detailed debug information
- `LogLevel.INFO` (1): General information messages
- `LogLevel.WARN` (2): Warning messages
- `LogLevel.ERROR` (3): Error messages
- `LogLevel.NONE` (4): Disables all logging

## API Reference

### Logger Class

#### `constructor(options: LoggerOptions)`

Creates a new Logger instance with the specified options:

```typescript
const myLogger = new Logger({
  level: LogLevel.DEBUG,
  prefix: 'MyApp',
  timestamp: false
});
```

#### `debug(message: any, ...optionalParams: any[])`

Logs a debug message if the current log level allows it:

```typescript
logger.debug('Debug message', { data: 'example' });
```

#### `info(message: any, ...optionalParams: any[])`

Logs an info message if the current log level allows it:

```typescript
logger.info('Application initialized');
```

#### `warn(message: any, ...optionalParams: any[])`

Logs a warning message if the current log level allows it:

```typescript
logger.warn('Deprecated function called');
```

#### `error(message: any, ...optionalParams: any[])`

Logs an error message if the current log level allows it:

```typescript
logger.error('Failed to load configuration', error);
```

#### `setLevel(level: LogLevel)`

Sets the log level for this logger instance:

```typescript
logger.setLevel(LogLevel.DEBUG);
```

#### `setPrefix(prefix: string)`

Sets the prefix for this logger instance:

```typescript
logger.setPrefix('NewPrefix');
```

#### `static getDefaultLogLevel(): LogLevel`

Gets the default log level used when creating new Logger instances:

```typescript
const defaultLevel = Logger.getDefaultLogLevel();
console.log('Default log level:', defaultLevel); // LogLevel.INFO
```

### Convenience Functions

The utility provides convenience functions that use the default logger instance:

- `logDebug(message, ...optionalParams)` - Logs a debug message
- `logInfo(message, ...optionalParams)` - Logs an info message
- `logWarn(message, ...optionalParams)` - Logs a warning message
- `logError(message, ...optionalParams)` - Logs an error message

## Complete Example

Here's a complete example showing different ways to use the Logger utility:

```typescript
import { Logger, LogLevel, logInfo, logError } from 'path/to/sillytavern-utils';

// Configure the default logger
const defaultLogger = new Logger({
  level: LogLevel.DEBUG,
  prefix: 'MyExtension',
  timestamp: true
});

// Use convenience functions (uses the default logger)
logInfo('Application starting up...');

// Create a custom logger for a specific module
const moduleLogger = new Logger({
  level: LogLevel.WARN,
  prefix: 'MyModule',
  timestamp: true
});

moduleLogger.info('This message will not be shown (below WARN level)');
moduleLogger.warn('This warning will be shown');

try {
  // Some operation that might fail
  throw new Error('Something went wrong');
} catch (error) {
  logError('Operation failed:', error);
}

// Change logger configuration at runtime
moduleLogger.setLevel(LogLevel.DEBUG);
moduleLogger.debug('Now debug messages will be shown');
```

## Best Practices

1. Use appropriate log levels:
    - Use `DEBUG` for detailed diagnostic information
    - Use `INFO` for general application events
    - Use `WARN` for potentially harmful situations
    - Use `ERROR` for errors that don't prevent the application from continuing

2. Include relevant context in log messages, such as function names, user IDs, or other identifying information.

3. Avoid logging sensitive information such as passwords or API keys.

4. Use consistent prefixes across your application to identify different modules or components.