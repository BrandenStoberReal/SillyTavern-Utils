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

export function createWrapper(options: BaseOptions): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('st-outfits-option');
    if (options.class) {
        wrapper.classList.add(...options.class.split(' '));
    }
    if (options.id) {
        wrapper.id = `${options.id}-wrapper`;
    }
    return wrapper;
}

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

export function createDescription(text: string): HTMLElement {
    const description = document.createElement('p');
    description.classList.add('st-outfits-option-description');
    description.textContent = text;
    return description;
}

export function AddCheckbox(
    parent: HTMLElement,
    options: CheckboxOptions,
    callback: (value: boolean) => void,
): HTMLInputElement {
    const wrapper = createWrapper(options);

    const id =
        options.id ??
        `st-outfits-checkbox-${Math.random().toString(36).substring(2)}`;

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
    labelAndInput.classList.add('st-outfits-option-label-input');

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

export function AddTextbox(
    parent: HTMLElement,
    options: TextboxOptions,
    callback: (value: string) => void,
): HTMLInputElement {
    const wrapper = createWrapper(options);

    const id =
        options.id ??
        `st-outfits-textbox-${Math.random().toString(36).substring(2)}`;

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

export function AddButton(
    parent: HTMLElement,
    options: ButtonOptions,
    callback: (event: MouseEvent) => void,
): HTMLButtonElement {
    const wrapper = createWrapper(options);

    const button = document.createElement('button');
    button.id =
        options.id ??
        `st-outfits-button-${Math.random().toString(36).substring(2)}`;
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

export function createIcon(iconName: string, iconClass?: string): HTMLElement {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', `fa-${iconName}`);
    if (iconClass) {
        icon.classList.add(...iconClass.split(' '));
    }
    return icon;
}

export function AddIconButton(
    parent: HTMLElement,
    options: IconButtonOptions,
    callback: (event: MouseEvent) => void,
): HTMLButtonElement {
    const wrapper = createWrapper(options);

    const button = document.createElement('button');
    button.id =
        options.id ??
        `st-outfits-icon-button-${Math.random().toString(36).substring(2)}`;

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

export function AddGroup(
    parent: HTMLElement,
    options: GroupOptions,
): HTMLElement {
    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('st-outfits-group');
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

export function AddGalleryContainer(
    parent: HTMLElement,
    options: BaseOptions,
): HTMLElement {
    const gallery = document.createElement('div');
    gallery.classList.add('st-outfits-gallery');
    if (options.class) {
        gallery.classList.add(...options.class.split(' '));
    }
    if (options.id) {
        gallery.id = options.id;
    }
    parent.appendChild(gallery);
    return gallery;
}

export function AddVerticalContainer(
    parent: HTMLElement,
    options: BaseOptions,
): HTMLElement {
    const group = document.createElement('div');
    group.classList.add('st-outfits-vertical-group');
    if (options.class) {
        group.classList.add(...options.class.split(' '));
    }
    if (options.id) {
        group.id = options.id;
    }
    parent.appendChild(group);
    return group;
}

export function AddHorizontalContainer(
    parent: HTMLElement,
    options: BaseOptions,
): HTMLElement {
    const group = document.createElement('div');
    group.classList.add('st-outfits-horizontal-group');
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
 * Adds a button to the top header.
 * @param {HeaderButtonOptions} options - The options for the button.
 * @returns {{content: HTMLElement, remove: () => void}} An object containing the drawer content element and a function to remove the button.
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

    const drawerContent = document.createElement('div');
    drawerContent.id = `${options.id}-content`;
    drawerContent.classList.add('drawer-content', 'closedDrawer', 'fillRight');

    drawerToggle.appendChild(iconEl);
    buttonContainer.appendChild(drawerToggle);
    buttonContainer.appendChild(drawerContent);

    // Add click event listener to toggle the drawer
    drawerToggle.addEventListener('click', () => {
        iconEl.classList.toggle('closedIcon');
        iconEl.classList.toggle('openIcon');
        drawerContent.classList.toggle('closedDrawer');
        drawerContent.classList.toggle('openDrawer');
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
