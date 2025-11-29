import {ISillyTavernContext} from './src/types/SillytavernContext.ts';

export {};

interface SillyTavernGlobal {
    libs: {
        lodash: any;
        localforage: any;
        Fuse: any;
        DOMPurify: any;
        Handlebars: any;
        moment: any;
        showdown: any;
    };

    getContext(): ISillyTavernContext;

    [key: string]: any; // Allow for other properties
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
    length: number;

    on(events: string, handler: (eventObject: JQuery.Event) => any): this;

    prop(name: string): any | undefined;

    prop(name: string, value: any): this;

    append(content: any): this;

    [index: number]: TElement;
}

interface JQueryStatic {
    (selector: string, context?: any): JQuery;

    (element: HTMLElement): JQuery;

    (object: object): JQuery;

    (callback: (jQueryAlias?: JQueryStatic) => void): any;
}

declare global {
    const SillyTavern: SillyTavernGlobal;

    // Add global type declarations here
}