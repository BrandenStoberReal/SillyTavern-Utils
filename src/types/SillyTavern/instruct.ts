import {NamesBehavior} from './names-behavior';

export interface InstructSettings {
    names_behavior: NamesBehavior;
    output_suffix: string;
    wrap: boolean;
    stop_sequence?: string;
    input_sequence?: string;
    output_sequence?: string;
    last_output_sequence?: string;
}
