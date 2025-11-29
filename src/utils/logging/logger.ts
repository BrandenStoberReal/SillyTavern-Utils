/**
 * Logging framework for the extension
 * Provides consistent, configurable logging across the application
 */

/**
 * Log levels for the logger
 * @enum {number}
 */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4,
}

/**
 * Interface for configuring logger options
 */
export interface LoggerOptions {
    level?: LogLevel;
    prefix?: string;
    timestamp?: boolean;
}

/**
 * A configurable logger class for consistent logging throughout the application
 */
export class Logger {
    private level: LogLevel;
    private prefix: string;
    private timestamp: boolean;

    /**
     * Creates a new Logger instance with the specified options
     * @param {LoggerOptions} [options] - Configuration options for the logger
     */
    constructor(options: LoggerOptions = {}) {
        this.level = options.level ?? LogLevel.INFO;
        this.prefix = options.prefix ?? 'OutfitsExtension';
        this.timestamp = options.timestamp ?? true;
    }

    /**
     * Logs a debug message if the current log level allows it
     * @param {any} message - The message to log
     * @param {...any} optionalParams - Additional parameters to log
     */
    debug(message: any, ...optionalParams: any[]): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage('DEBUG', message, ...optionalParams));
        }
    }

    /**
     * Logs an info message if the current log level allows it
     * @param {any} message - The message to log
     * @param {...any} optionalParams - Additional parameters to log
     */
    info(message: any, ...optionalParams: any[]): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage('INFO', message, ...optionalParams));
        }
    }

    /**
     * Logs a warning message if the current log level allows it
     * @param {any} message - The message to log
     * @param {...any} optionalParams - Additional parameters to log
     */
    warn(message: any, ...optionalParams: any[]): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage('WARN', message, ...optionalParams));
        }
    }

    /**
     * Logs an error message if the current log level allows it
     * @param {any} message - The message to log
     * @param {...any} optionalParams - Additional parameters to log
     */
    error(message: any, ...optionalParams: any[]): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage('ERROR', message, ...optionalParams));
        }
    }

    /**
     * Sets the log level for this logger instance
     * @param {LogLevel} level - The new log level
     */
    setLevel(level: LogLevel): void {
        this.level = level;
    }

    /**
     * Sets the prefix for this logger instance
     * @param {string} prefix - The new prefix
     */
    setPrefix(prefix: string): void {
        this.prefix = prefix;
    }

    /**
     * Formats a log message with timestamp, prefix, and level
     * @private
     * @param {string} level - The log level (DEBUG, INFO, WARN, ERROR)
     * @param {any} message - The message to format
     * @param {...any} optionalParams - Additional parameters to include in the message
     * @returns {string} The formatted log message
     */
    private formatMessage(
        level: string,
        message: any,
        ...optionalParams: any[]
    ): string {
        let formattedMessage = '';

        if (this.timestamp) {
            formattedMessage += `[${new Date().toISOString()}] `;
        }

        formattedMessage += `[${this.prefix}] [${level}] `;

        if (typeof message === 'string') {
            formattedMessage += message;
        } else {
            formattedMessage += JSON.stringify(message);
        }

        return formattedMessage;
    }

    /**
     * Checks if a message with the given log level should be logged based on the current log level setting
     * @private
     * @param {LogLevel} logLevel - The log level to check
     * @returns {boolean} True if the message should be logged, false otherwise
     */
    private shouldLog(logLevel: LogLevel): boolean {
        return logLevel >= this.level;
    }
}

// Default instance of the logger
export const logger = new Logger({prefix: 'OutfitsExtension'});

// Convenience functions that use the default logger instance

/**
 * Logs a debug message using the default logger instance
 * @param {any} message - The message to log
 * @param {...any} optionalParams - Additional parameters to log
 */
export const logDebug = (message: any, ...optionalParams: any[]): void =>
    logger.debug(message, ...optionalParams);

/**
 * Logs an info message using the default logger instance
 * @param {any} message - The message to log
 * @param {...any} optionalParams - Additional parameters to log
 */
export const logInfo = (message: any, ...optionalParams: any[]): void =>
    logger.info(message, ...optionalParams);

/**
 * Logs a warning message using the default logger instance
 * @param {any} message - The message to log
 * @param {...any} optionalParams - Additional parameters to log
 */
export const logWarn = (message: any, ...optionalParams: any[]): void =>
    logger.warn(message, ...optionalParams);

/**
 * Logs an error message using the default logger instance
 * @param {any} message - The message to log
 * @param {...any} optionalParams - Additional parameters to log
 */
export const logError = (message: any, ...optionalParams: any[]): void =>
    logger.error(message, ...optionalParams);
