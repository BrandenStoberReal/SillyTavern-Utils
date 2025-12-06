// src/utils/html.ts

export interface BaseOptions {
    id?: string;
    label?: string;
    description?: string;
    value?: any;
    class?: string;
    labelClass?: string;
    attributes?: { [key: string]: string };
    includeDescription?: boolean;
}

export interface CheckboxOptions extends BaseOptions {
    value?: boolean;
}

export interface TextboxOptions extends BaseOptions {
    value?: string;
    placeholder?: string;
}

export interface RangeOptions extends BaseOptions {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
}

export interface ButtonOptions extends BaseOptions {
    text: string;
}

export interface IconOptions extends BaseOptions {
    iconName: string;
    iconClass?: string;
}

export interface IconButtonOptions extends ButtonOptions {
    iconName: string;
    iconPosition?: 'left' | 'right';
}

export interface GroupOptions extends BaseOptions {
    title: string;
}

export type HeaderButtonPosition = 'first' | 'last' | number;

export interface HeaderButtonOptions {
    id: string;
    iconName: string;
    title: string;
    position?: HeaderButtonPosition;
}

/**
 * Creates a wrapper element for UI components with configurable options.
 * @param {BaseOptions} options - The options for configuring the wrapper element
 * @returns {HTMLElement} The created wrapper element
 */
export function createWrapper(options: BaseOptions): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('sillytavern-lib-option');
    if (options.class) {
        wrapper.classList.add(...options.class.split(' '));
    }
    if (options.id) {
        wrapper.id = `${options.id}-wrapper`;
    }
    return wrapper;
}

/**
 * Creates a label element associated with a form control.
 * @param {string} forId - The ID of the form control this label is associated with
 * @param {string} text - The text content of the label
 * @param {string} [labelClass] - Optional CSS class to add to the label
 * @returns {HTMLLabelElement} The created label element
 */
export function createLabel(
    forId: string,
    text: string,
    labelClass?: string,
): HTMLLabelElement {
    const label = document.createElement('label');
    label.htmlFor = forId;
    label.textContent = text;
    if (labelClass) {
        label.classList.add(...labelClass.split(' '));
    }
    return label;
}

/**
 * Creates a description element for UI components.
 * @param {string} text - The text content of the description
 * @returns {HTMLElement} The created description element
 */
export function createDescription(text: string): HTMLElement {
    const description = document.createElement('p');
    description.classList.add('sillytavern-lib-option-description');
    description.textContent = text;
    return description;
}

/**
 * Adds a checkbox element to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the checkbox to
 * @param {CheckboxOptions} options - The options for configuring the checkbox
 * @param {function(boolean): void} callback - The callback function to execute when the checkbox value changes
 * @returns {HTMLInputElement} The created checkbox input element
 */
export function AddCheckbox(
    parent: HTMLElement,
    options: CheckboxOptions,
    callback: (value: boolean) => void,
): HTMLInputElement {
    const wrapper = createWrapper(options);

    const id =
        options.id ??
        `sillytavern-lib-checkbox-${Math.random().toString(36).substring(2)}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.checked = options.value ?? false;

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            checkbox.setAttribute(key, value);
        });
    }

    checkbox.addEventListener('change', () => {
        callback(checkbox.checked);
    });

    const labelAndInput = document.createElement('div');
    labelAndInput.classList.add('sillytavern-lib-option-label-input');

    if (options.label) {
        const label = createLabel(id, options.label, options.labelClass);
        labelAndInput.appendChild(checkbox);
        labelAndInput.appendChild(label);
    } else {
        labelAndInput.appendChild(checkbox);
    }

    wrapper.appendChild(labelAndInput);

    if (options.description && (options.includeDescription ?? true)) {
        const description = createDescription(options.description);
        wrapper.appendChild(description);
    }

    parent.appendChild(wrapper);
    return checkbox;
}

/**
 * Adds a textbox element to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the textbox to
 * @param {TextboxOptions} options - The options for configuring the textbox
 * @param {function(string): void} callback - The callback function to execute when the textbox value changes
 * @returns {HTMLInputElement} The created textbox input element
 */
export function AddTextbox(
    parent: HTMLElement,
    options: TextboxOptions,
    callback: (value: string) => void,
): HTMLInputElement {
    const wrapper = createWrapper(options);

    const id =
        options.id ??
        `sillytavern-lib-textbox-${Math.random().toString(36).substring(2)}`;

    if (options.label) {
        const label = createLabel(id, options.label, options.labelClass);
        wrapper.appendChild(label);
    }

    const textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.id = id;
    textbox.value = options.value ?? '';
    textbox.placeholder = options.placeholder ?? '';

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            textbox.setAttribute(key, value);
        });
    }

    textbox.addEventListener('input', () => {
        callback(textbox.value);
    });

    wrapper.appendChild(textbox);

    if (options.description && (options.includeDescription ?? true)) {
        const description = createDescription(options.description);
        wrapper.appendChild(description);
    }

    parent.appendChild(wrapper);
    return textbox;
}

/**
 * Adds a range slider element to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the range slider to
 * @param {RangeOptions} options - The options for configuring the range slider
 * @param {function(number): void} callback - The callback function to execute when the range value changes
 * @returns {HTMLInputElement} The created range input element
 */
export function AddRange(
    parent: HTMLElement,
    options: RangeOptions,
    callback: (value: number) => void,
): HTMLInputElement {
    const wrapper = createWrapper(options);

    const id =
        options.id ??
        `sillytavern-lib-range-${Math.random().toString(36).substring(2)}`;

    if (options.label) {
        const label = createLabel(id, options.label, options.labelClass);
        wrapper.appendChild(label);
    }

    const range = document.createElement('input');
    range.type = 'range';
    range.id = id;
    range.min = (options.min ?? 0).toString();
    range.max = (options.max ?? 100).toString();
    range.step = (options.step ?? 1).toString();
    range.value = (options.value ?? 50).toString();

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            range.setAttribute(key, value);
        });
    }

    range.addEventListener('input', () => {
        callback(parseFloat(range.value));
    });

    wrapper.appendChild(range);

    // Add value display next to the range
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = range.value;
    valueDisplay.classList.add('sillytavern-lib-range-value');
    wrapper.appendChild(valueDisplay);

    // Update value display when range changes
    range.addEventListener('input', () => {
        valueDisplay.textContent = range.value;
    });

    if (options.description && (options.includeDescription ?? true)) {
        const description = createDescription(options.description);
        wrapper.appendChild(description);
    }

    parent.appendChild(wrapper);
    return range;
}

/**
 * Adds a button element to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the button to
 * @param {ButtonOptions} options - The options for configuring the button
 * @param {function(MouseEvent): void} callback - The callback function to execute when the button is clicked
 * @returns {HTMLButtonElement} The created button element
 */
export function AddButton(
    parent: HTMLElement,
    options: ButtonOptions,
    callback: (event: MouseEvent) => void,
): HTMLButtonElement {
    const wrapper = createWrapper(options);

    const button = document.createElement('button');
    button.id =
        options.id ??
        `sillytavern-lib-button-${Math.random().toString(36).substring(2)}`;
    button.textContent = options.text;

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            button.setAttribute(key, value);
        });
    }

    button.addEventListener('click', (event) => {
        callback(event);
    });

    if (options.label) {
        const label = createLabel(button.id, options.label, options.labelClass);
        wrapper.appendChild(label);
    }

    wrapper.appendChild(button);

    if (options.description && (options.includeDescription ?? true)) {
        const description = createDescription(options.description);
        wrapper.appendChild(description);
    }

    parent.appendChild(wrapper);
    return button;
}

/**
 * Creates an icon element using Font Awesome classes.
 * @param {string} iconName - The name of the Font Awesome icon
 * @param {string} [iconClass] - Optional additional CSS classes to add to the icon
 * @returns {HTMLElement} The created icon element
 */
export function createIcon(iconName: string, iconClass?: string): HTMLElement {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', `fa-${iconName}`);
    if (iconClass) {
        icon.classList.add(...iconClass.split(' '));
    }
    return icon;
}

/**
 * Adds an icon button element to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the icon button to
 * @param {IconButtonOptions} options - The options for configuring the icon button
 * @param {function(MouseEvent): void} callback - The callback function to execute when the button is clicked
 * @returns {HTMLButtonElement} The created icon button element
 */
export function AddIconButton(
    parent: HTMLElement,
    options: IconButtonOptions,
    callback: (event: MouseEvent) => void,
): HTMLButtonElement {
    const wrapper = createWrapper(options);

    const button = document.createElement('button');
    button.id =
        options.id ??
        `sillytavern-lib-icon-button-${Math.random().toString(36).substring(2)}`;

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            button.setAttribute(key, value);
        });
    }

    button.addEventListener('click', (event) => {
        callback(event);
    });

    const icon = createIcon(options.iconName);
    const text = document.createElement('span');
    text.textContent = options.text;

    const iconPosition = options.iconPosition ?? 'left';

    if (iconPosition === 'left') {
        button.appendChild(icon);
        button.appendChild(text);
    } else {
        button.appendChild(text);
        button.appendChild(icon);
    }

    if (options.label) {
        const label = createLabel(button.id, options.label, options.labelClass);
        wrapper.appendChild(label);
    }

    wrapper.appendChild(button);

    if (options.description && (options.includeDescription ?? true)) {
        const description = createDescription(options.description);
        wrapper.appendChild(description);
    }

    parent.appendChild(wrapper);
    return button;
}

/**
 * Adds a group element (fieldset) to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the group to
 * @param {GroupOptions} options - The options for configuring the group
 * @returns {HTMLElement} The created fieldset element
 */
export function AddGroup(
    parent: HTMLElement,
    options: GroupOptions,
): HTMLElement {
    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('sillytavern-lib-group');
    if (options.class) {
        fieldset.classList.add(...options.class.split(' '));
    }

    if (options.title) {
        const legend = document.createElement('legend');
        legend.textContent = options.title;
        fieldset.appendChild(legend);
    }

    if (options.description) {
        const description = createDescription(options.description);
        fieldset.appendChild(description);
    }

    parent.appendChild(fieldset);
    return fieldset;
}

/**
 * Adds a gallery container element to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the gallery container to
 * @param {BaseOptions} options - The options for configuring the gallery container
 * @returns {HTMLElement} The created gallery container element
 */
export function AddGalleryContainer(
    parent: HTMLElement,
    options: BaseOptions,
): HTMLElement {
    const gallery = document.createElement('div');
    gallery.classList.add('sillytavern-lib-gallery');
    if (options.class) {
        gallery.classList.add(...options.class.split(' '));
    }
    if (options.id) {
        gallery.id = options.id;
    }
    parent.appendChild(gallery);
    return gallery;
}

/**
 * Adds a vertical container element to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the vertical container to
 * @param {BaseOptions} options - The options for configuring the vertical container
 * @returns {HTMLElement} The created vertical container element
 */
export function AddVerticalContainer(
    parent: HTMLElement,
    options: BaseOptions,
): HTMLElement {
    const group = document.createElement('div');
    group.classList.add('sillytavern-lib-vertical-group');
    if (options.class) {
        group.classList.add(...options.class.split(' '));
    }
    if (options.id) {
        group.id = options.id;
    }
    parent.appendChild(group);
    return group;
}

/**
 * Adds a horizontal container element to the specified parent element.
 * @param {HTMLElement} parent - The parent element to append the horizontal container to
 * @param {BaseOptions} options - The options for configuring the horizontal container
 * @returns {HTMLElement} The created horizontal container element
 */
export function AddHorizontalContainer(
    parent: HTMLElement,
    options: BaseOptions,
): HTMLElement {
    const group = document.createElement('div');
    group.classList.add('sillytavern-lib-horizontal-group');
    if (options.class) {
        group.classList.add(...options.class.split(' '));
    }
    if (options.id) {
        group.id = options.id;
    }
    parent.appendChild(group);
    return group;
}

/**
 * Adds a header button with a drawer functionality to the top header.
 * @param {HeaderButtonOptions} options - The options for configuring the header button
 * @returns {{content: HTMLElement, remove: () => void}} An object containing the drawer content element and a function to remove the button
 */
export function AddHeaderButton(options: HeaderButtonOptions): {
    content: HTMLElement;
    remove: () => void;
} {
    const holder = document.getElementById('top-settings-holder');
    if (!holder) {
        // SillyTavern will throw its own error if the element is not found, so we can just re-throw
        throw new Error('Could not find top-settings-holder');
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.id = options.id;
    buttonContainer.classList.add('drawer');

    const drawerToggle = document.createElement('div');
    drawerToggle.classList.add('drawer-toggle', 'drawer-header');

    const iconEl = createIcon(
        options.iconName,
        'drawer-icon fa-fw closedIcon interactable',
    );
    iconEl.id = `${options.id}-icon`;
    iconEl.title = options.title;
    iconEl.setAttribute('role', 'button');
    iconEl.setAttribute('tabindex', '0');

    const drawerContent = document.createElement('div');
    drawerContent.id = `${options.id}-content`;
    drawerContent.classList.add('drawer-content', 'closedDrawer', 'fillRight');

    drawerToggle.appendChild(iconEl);
    buttonContainer.appendChild(drawerToggle);
    buttonContainer.appendChild(drawerContent);

    // Add explicit drawer open/close logic to ensure it works
    drawerToggle.addEventListener('click', () => {
        const isOpened = iconEl.classList.contains('openIcon');

        // Close all other drawers
        document.querySelectorAll('#top-settings-holder .drawer-toggle').forEach(otherToggle => {
            const otherIcon = otherToggle.querySelector('.drawer-icon');
            const otherContent = otherToggle.nextElementSibling;
            if (otherIcon && otherContent && otherIcon.id !== iconEl.id) {
                otherIcon.classList.remove('openIcon');
                otherIcon.classList.add('closedIcon');
                if (otherContent.classList.contains('openDrawer')) {
                    otherContent.classList.remove('openDrawer');
                    otherContent.classList.add('closedDrawer');
                }
            }
        });

        // Toggle the current drawer
        if (isOpened) {
            iconEl.classList.remove('openIcon');
            iconEl.classList.add('closedIcon');
            drawerContent.classList.remove('openDrawer');
            drawerContent.classList.add('closedDrawer');
        } else {
            iconEl.classList.add('openIcon');
            iconEl.classList.remove('closedIcon');
            drawerContent.classList.add('openDrawer');
            drawerContent.classList.remove('closedDrawer');
        }
    });

    // Use position to determine where to add the button
    if (typeof options.position === 'number') {
        // If position is a number, insert at that index
        const children = Array.from(holder.children);
        if (options.position < 0) {
            // Negative index: insert from the end
            holder.insertBefore(
                buttonContainer,
                children[children.length + options.position],
            );
        } else if (options.position >= children.length) {
            // Index is beyond the length: append at the end
            holder.appendChild(buttonContainer);
        } else {
            // Insert at the specified index
            holder.insertBefore(buttonContainer, children[options.position]);
        }
    } else if (options.position === 'last') {
        holder.appendChild(buttonContainer);
    } else {
        // Prepend by default to be consistent with other drawers that are on the left side
        holder.prepend(buttonContainer);
    }

    const remove = () => {
        buttonContainer.remove();
    };

    return {content: drawerContent, remove};
}
