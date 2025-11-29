/**
 * Logging framework for the extension
 * Provides consistent, configurable logging across the application
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4,
}

export interface LoggerOptions {
    level?: LogLevel;
    prefix?: string;
    timestamp?: boolean;
}

export class Logger {
    private level: LogLevel;
    private prefix: string;
    private timestamp: boolean;

    constructor(options: LoggerOptions = {}) {
        this.level = options.level ?? LogLevel.INFO;
        this.prefix = options.prefix ?? 'OutfitsExtension';
        this.timestamp = options.timestamp ?? true;
    }

    debug(message: any, ...optionalParams: any[]): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage('DEBUG', message, ...optionalParams));
        }
    }

    info(message: any, ...optionalParams: any[]): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage('INFO', message, ...optionalParams));
        }
    }

    warn(message: any, ...optionalParams: any[]): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage('WARN', message, ...optionalParams));
        }
    }

    error(message: any, ...optionalParams: any[]): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage('ERROR', message, ...optionalParams));
        }
    }

    setLevel(level: LogLevel): void {
        this.level = level;
    }

    setPrefix(prefix: string): void {
        this.prefix = prefix;
    }

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

    private shouldLog(logLevel: LogLevel): boolean {
        return logLevel >= this.level;
    }
}

// Default instance of the logger
export const logger = new Logger({prefix: 'OutfitsExtension'});

// Convenience functions that use the default logger instance
export const logDebug = (message: any, ...optionalParams: any[]): void =>
    logger.debug(message, ...optionalParams);
export const logInfo = (message: any, ...optionalParams: any[]): void =>
    logger.info(message, ...optionalParams);
export const logWarn = (message: any, ...optionalParams: any[]): void =>
    logger.warn(message, ...optionalParams);
export const logError = (message: any, ...optionalParams: any[]): void =>
    logger.error(message, ...optionalParams);
