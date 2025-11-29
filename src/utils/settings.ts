import {AddButton, AddCheckbox, AddGroup, AddRange, AddTextbox} from './ui/html';

/**
 * Represents the types of settings supported by the SettingsManager
 */
export type SettingType = 'checkbox' | 'textbox' | 'range' | 'button';

/**
 * Defines the configuration for a single setting
 */
export interface SettingDefinition {
    type: SettingType;
    label: string;
    description?: string;
    value: any;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
}

/**
 * Interface for the schema that defines all settings
 */
export interface SettingsSchema {
    [key: string]: SettingDefinition;
}

/**
 * Manages extension settings with type-safe access and UI rendering
 */
export class SettingsManager<T extends SettingsSchema> {
    private settings!: { [K in keyof T]: T[K]['value'] };
    private readonly defaultSettings: T;
    private readonly moduleName: string;

    /**
     * Creates a new SettingsManager instance
     * @param defaultSettings The default settings schema
     * @param moduleName The name of the module for storing settings
     */
    constructor(defaultSettings: T, moduleName: string) {
        this.defaultSettings = defaultSettings;
        this.moduleName = moduleName;
        this.load();
    }

    /**
     * Gets the value of a setting
     * @param key The setting key
     * @returns The current value of the setting
     */
    get<K extends keyof T>(key: K): T[K]['value'] {
        return this.settings[key];
    }

    /**
     * Sets the value of a setting and saves it
     * @param key The setting key
     * @param value The new value for the setting
     */
    set<K extends keyof T>(key: K, value: T[K]['value']) {
        this.settings[key] = value;
        this.save();
    }

    /**
     * Renders the settings UI to the specified container
     * @param container The HTMLElement to render settings into
     */
    render(container: HTMLElement) {
        const settingsGroup = AddGroup(container, {
            title: 'Settings',
            id: `${this.moduleName.toLowerCase()}-settings-group`,
        });

        for (const key in this.defaultSettings) {
            const definition = this.defaultSettings[key as keyof T];
            const currentValue = this.get(key as keyof T);

            switch (definition.type) {
                case 'checkbox':
                    AddCheckbox(settingsGroup, {
                        id: `${this.moduleName.toLowerCase()}-${String(key)}`,
                        label: definition.label,
                        labelClass: 'normal',
                        description: definition.description,
                        value: currentValue as boolean,
                    }, (value: boolean) => this.set(key as keyof T, value));
                    break;
                case 'textbox':
                    AddTextbox(settingsGroup, {
                        id: `${this.moduleName.toLowerCase()}-${String(key)}`,
                        label: definition.label,
                        labelClass: 'normal',
                        description: definition.description,
                        value: currentValue as string,
                        placeholder: definition.placeholder || '',
                    }, (value: string) => this.set(key as keyof T, value));
                    break;
                case 'button':
                    AddButton(settingsGroup, {
                        id: `${this.moduleName.toLowerCase()}-${String(key)}`,
                        text: definition.label,
                        description: definition.description,
                    }, () => {
                        // For button type, we just don't do anything as this will be handled not by us.
                    });
                    break;
                case 'range':
                    AddRange(settingsGroup, {
                        id: `${this.moduleName.toLowerCase()}-${String(key)}`,
                        label: definition.label,
                        labelClass: 'normal',
                        description: definition.description,
                        value: currentValue as number,
                        min: definition.min,
                        max: definition.max,
                        step: definition.step,
                    }, (value: number) => this.set(key as keyof T, value));
                    break;
                // Add other types when needed
                default:
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.warn(`Unknown setting type: ${definition.type}`);
            }
        }
    }

    /**
     * Loads settings from SillyTavern's extension settings
     */
    private load() {
        const context = SillyTavern.getContext();

        const extensionSettings = (context.extensionSettings as Record<string, any>)[this.moduleName] ?? {};

        const loadedSettings: any = {};
        for (const key in this.defaultSettings) {
            loadedSettings[key] = extensionSettings[key] ?? this.defaultSettings[key].value;
        }

        this.settings = loadedSettings;
    }

    /**
     * Saves settings to SillyTavern's extension settings
     */
    private save() {
        // In actual ST extension, this would be: const context = SillyTavern.getContext();
        const context = SillyTavern.getContext();

        if (!(context.extensionSettings as Record<string, any>)[this.moduleName]) {
            (context.extensionSettings as Record<string, any>)[this.moduleName] = {};
        }
        Object.assign((context.extensionSettings as Record<string, any>)[this.moduleName], this.settings);

        // In actual ST extension, this would be: context.saveSettingsDebounced();
        context.saveSettingsDebounced();
    }
}

/**
 * Helper function to create a settings schema with proper typing
 * @param schema The settings schema to create
 * @returns The created schema with readonly properties
 */
export function createSettingsSchema<T extends SettingsSchema>(schema: T): Readonly<T> {
    return Object.freeze(schema);
}

/**
 * Registers a settings panel in the SillyTavern settings UI
 * @param settingsManager The SettingsManager instance to render
 * @param extensionId The ID of the extension
 * @param extensionName The display name of the extension
 * @param logger Optional logger for error/info messages
 */
export function registerSettingsPanel(
    settingsManager: SettingsManager<any>,
    extensionId: string,
    extensionName: string,
    logger?: { info: (msg: string) => void; error: (msg: string) => void }
) {
    // Create settings HTML content using the standard format
    const settingsHtml = `
        <div class="${extensionId}-settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>${extensionName} Settings</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div id="${extensionId}-settings-content" class="inline-drawer-content">
                </div>
            </div>
        </div>
    `;

    // Wait for the app to be ready before trying to add settings
    if (typeof (window as any).SillyTavern !== 'undefined' && (window as any).SillyTavern.getContext) {
        const context = (window as any).SillyTavern.getContext();
        if (context && context.eventSource) {
            // Listen for when the app is ready
            context.eventSource.on(context.event_types.APP_READY, function () {
                // Add settings panel to the extensions settings container using jQuery
                if (typeof (window as any).$ !== 'undefined') {
                    (window as any).$('#extensions_settings').append(settingsHtml);
                    const settingsContent = document.getElementById(`${extensionId}-settings-content`);
                    if (settingsContent) {
                        settingsManager.render(settingsContent);
                    }

                    if (logger) {
                        logger.info(`${extensionName}: Settings panel registered`);
                    } else {
                        console.info(`${extensionName}: Settings panel registered`);
                    }
                } else {
                    if (logger) {
                        logger.error(`${extensionName}: jQuery not available, cannot register settings panel`);
                    } else {
                        console.error(`${extensionName}: jQuery not available, cannot register settings panel`);
                    }
                }
            });
        }
    }
}