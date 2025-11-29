import {ConnectionProfile} from './services';
import {QuickReplySlot, QuickReplyV2Settings} from './quick-reply';
import {Style} from './style';
import {InstructSettings} from './instruct';
import {ContextSettings} from './context';
import {SysPromptSettings} from './sys-prompt';
import {ReasoningSettings} from './reasoning';
import {PersonaDescription} from './persona';
import {StScriptSettings} from './st-script';

export interface ExtensionSettings {
    apiUrl: string;
    apiKey: string;
    autoConnect: boolean;
    notifyUpdates: boolean;
    disabledExtensions: string[];
    expressionOverrides: any[];
    memory: MemorySettings;
    note: NoteSettings;
    caption: CaptionSettings;
    expressions: ExpressionsSettings;
    connectionManager: ConnectionManagerSettings;
    dice: Record<string, any>;
    regex: any[];
    regex_presets: any[];
    character_allowed_regex: any[];
    preset_allowed_regex: Record<string, any>;
    tts: TtsSettings;
    sd: SdSettings;
    chromadb: Record<string, any>;
    translate: TranslateSettings;
    objective: ObjectiveSettings;
    quickReply: QuickReplySettings;
    randomizer: RandomizerSettings;
    speech_recognition: SpeechRecognitionSettings;
    rvc: RvcSettings;
    hypebot: Record<string, any>;
    vectors: Record<string, any>;
    variables: VariablesSettings;
    attachments: any[];
    character_attachments: Record<string, any>;
    disabled_attachments: any[];
    gallery: GallerySettings;
    cfg: CfgSettings;
    quickReplyV2: QuickReplyV2Settings;
}

export interface MemorySettings {
    minLongMemory: number;
    maxLongMemory: number;
    longMemoryLength: number;
    shortMemoryLength: number;
    minShortMemory: number;
    maxShortMemory: number;
    shortMemoryStep: number;
    longMemoryStep: number;
    repetitionPenaltyStep: number;
    repetitionPenalty: number;
    maxRepetitionPenalty: number;
    minRepetitionPenalty: number;
    temperature: number;
    minTemperature: number;
    maxTemperature: number;
    temperatureStep: number;
    lengthPenalty: number;
    minLengthPenalty: number;
    maxLengthPenalty: number;
    lengthPenaltyStep: number;
    memoryFrozen: boolean;
    source: string;
    prompt: string;
    promptWords: number;
    promptMinWords: number;
    promptMaxWords: number;
    promptWordsStep: number;
    promptInterval: number;
    promptMinInterval: number;
    promptMaxInterval: number;
    promptIntervalStep: number;
    template: string;
    position: number;
    depth: number;
    promptForceWords: number;
    promptForceWordsStep: number;
    promptMinForceWords: number;
    promptMaxForceWords: number;
    SkipWIAN: boolean;
    role: number;
    scan: boolean;
    overrideResponseLength: number;
    overrideResponseLengthMin: number;
    overrideResponseLengthMax: number;
    overrideResponseLengthStep: number;
    maxMessagesPerRequest: number;
    maxMessagesPerRequestMin: number;
    maxMessagesPerRequestMax: number;
    maxMessagesPerRequestStep: number;
    prompt_builder: number;
}

export interface NoteSettings {
    default: string;
    chara: any[];
    wiAddition: any[];
    defaultPosition: number;
    defaultDepth: number;
    defaultInterval: number;
    defaultRole: number;
}

export interface CaptionSettings {
    refine_mode: boolean;
    source: string;
    multimodal_api: string;
    multimodal_model: string;
    prompt: string;
    template: string;
    show_in_chat: boolean;
}

export interface ExpressionsSettings {
    showDefault: boolean;
    api: number;
    llmPrompt: string;
    allowMultiple: boolean;
    promptType: string;
    custom: any[];
}

export interface ConnectionManagerSettings {
    selectedProfile: string;
    profiles: ConnectionProfile[];
}

export interface TtsSettings {
    voiceMap: string;
    ttsEnabled: boolean;
    currentProvider: string;
    auto_generation: boolean;
    ElevenLabs: Record<string, any>;
    System: Record<string, any>;
    narrate_user: boolean;
    playback_rate: number;
    multi_voice_enabled: boolean;
}

export interface SdSettings {
    scale_min: number;
    scale_max: number;
    scale_step: number;
    scale: number;
    steps_min: number;
    steps_max: number;
    steps_step: number;
    steps: number;
    dimension_min: number;
    dimension_max: number;
    dimension_step: number;
    width: number;
    height: number;
    prompt_prefix: string;
    negative_prompt: string;
    sampler: string;
    model: string;
    restore_faces: boolean;
    enable_hr: boolean;
    horde: boolean;
    horde_nsfw: boolean;
    horde_karras: boolean;
    refine_mode: boolean;
    prompts: Record<string, string>;
    character_prompts: Record<string, any>;
    source: string;
    scheduler: string;
    vae: string;
    seed: number;
    adetailer_face: boolean;
    horde_sanitize: boolean;
    interactive_mode: boolean;
    multimodal_captioning: boolean;
    snap: boolean;
    free_extend: boolean;
    function_tool: boolean;
    auto_url: string;
    auto_auth: string;
    vlad_url: string;
    vlad_auth: string;
    drawthings_url: string;
    drawthings_auth: string;
    hr_upscaler: string;
    hr_scale: number;
    hr_scale_min: number;
    hr_scale_max: number;
    hr_scale_step: number;
    denoising_strength: number;
    denoising_strength_min: number;
    denoising_strength_max: number;
    denoising_strength_step: number;
    hr_second_pass_steps: number;
    hr_second_pass_steps_min: number;
    hr_second_pass_steps_max: number;
    hr_second_pass_steps_step: number;
    clip_skip_min: number;
    clip_skip_max: number;
    clip_skip_step: number;
    clip_skip: number;
    novel_anlas_guard: boolean;
    novel_sm: boolean;
    novel_sm_dyn: boolean;
    novel_decrisper: boolean;
    novel_variety_boost: boolean;
    openai_style: string;
    openai_quality: string;
    style: string;
    styles: Style[];
    comfy_url: string;
    comfy_workflow: string;
    pollinations_enhance: boolean;
    wand_visible: boolean;
    command_visible: boolean;
    interactive_visible: boolean;
    tool_visible: boolean;
    stability_style_preset: string;
    bfl_upsampling: boolean;
    google_api: string;
    google_enhance: boolean;
    character_negative_prompts: Record<string, any>;
}

export interface TranslateSettings {
    target_language: string;
    internal_language: string;
    provider: string;
    auto_mode: string;
    deepl_endpoint: string;
}

export interface ObjectiveSettings {
    customPrompts: {
        default: {
            createTask: string;
            checkTaskCompleted: string;
            currentTask: string;
        };
    };
}

export interface QuickReplySettings {
    quickReplyEnabled: boolean;
    numberOfSlots: number;
    quickReplySlots: QuickReplySlot[];
}

export interface RandomizerSettings {
    controls: any[];
    fluctuation: number;
    enabled: boolean;
}

export interface SpeechRecognitionSettings {
    currentProvider: string;
    messageMode: string;
    messageMappingText: string;
    messageMapping: any[];
    messageMappingEnabled: boolean;
    None: Record<string, any>;
}

export interface RvcSettings {
    enabled: boolean;
    model: string;
    pitchOffset: number;
    pitchExtraction: string;
    indexRate: number;
    filterRadius: number;
    rmsMixRate: number;
    protect: number;
    voicMapText: string;
    voiceMap: Record<string, any>;
}

export interface VariablesSettings {
    global: Record<string, any>;
}

export interface GallerySettings {
    folders: Record<string, any>;
    sort: string;
}

export interface CfgSettings {
    global: {
        guidance_scale: number;
        negative_prompt: string;
    };
    chara: any[];
}

export interface PowerUserSettings {
    charListGrid: boolean;
    tokenizer: number;
    token_padding: number;
    collapse_newlines: boolean;
    pin_examples: boolean;
    strip_examples: boolean;
    trim_sentences: boolean;
    always_force_name2: boolean;
    user_prompt_bias: string;
    show_user_prompt_bias: boolean;
    auto_continue: {
        enabled: boolean;
        allow_chat_completions: boolean;
        target_length: number;
    };
    markdown_escape_strings: string;
    chat_truncation: number;
    streaming_fps: number;
    smooth_streaming: boolean;
    smooth_streaming_speed: number;
    stream_fade_in: boolean;
    fast_ui_mode: boolean;
    avatar_style: number;
    chat_display: number;
    toastr_position: string;
    chat_width: number;
    never_resize_avatars: boolean;
    show_card_avatar_urls: boolean;
    play_message_sound: boolean;
    play_sound_unfocused: boolean;
    auto_save_msg_edits: boolean;
    confirm_message_delete: boolean;
    sort_field: string;
    sort_order: string;
    sort_rule: any;
    font_scale: number;
    blur_strength: number;
    shadow_width: number;
    main_text_color: string;
    italics_text_color: string;
    underline_text_color: string;
    quote_text_color: string;
    blur_tint_color: string;
    chat_tint_color: string;
    user_mes_blur_tint_color: string;
    bot_mes_blur_tint_color: string;
    shadow_color: string;
    border_color: string;
    custom_css: string;
    waifuMode: boolean;
    movingUI: boolean;
    movingUIState: Record<string, any>;
    movingUIPreset: string;
    noShadows: boolean;
    theme: string;
    gestures: boolean;
    auto_swipe: boolean;
    auto_swipe_minimum_length: number;
    auto_swipe_blacklist: any[];
    auto_swipe_blacklist_threshold: number;
    auto_scroll_chat_to_bottom: boolean;
    auto_fix_generated_markdown: boolean;
    send_on_enter: number;
    console_log_prompts: boolean;
    request_token_probabilities: boolean;
    show_group_chat_queue: boolean;
    allow_name1_display: boolean;
    allow_name2_display: boolean;
    hotswap_enabled: boolean;
    timer_enabled: boolean;
    timestamps_enabled: boolean;
    timestamp_model_icon: boolean;
    mesIDDisplay_enabled: boolean;
    hideChatAvatars_enabled: boolean;
    max_context_unlocked: boolean;
    message_token_count_enabled: boolean;
    expand_message_actions: boolean;
    enableZenSliders: boolean;
    enableLabMode: boolean;
    prefer_character_prompt: boolean;
    prefer_character_jailbreak: boolean;
    quick_continue: boolean;
    quick_impersonate: boolean;
    continue_on_send: boolean;
    trim_spaces: boolean;
    relaxed_api_urls: boolean;
    world_import_dialog: boolean;
    enable_auto_select_input: boolean;
    enable_md_hotkeys: boolean;
    tag_import_setting: number;
    disable_group_trimming: boolean;
    single_line: boolean;
    instruct: InstructSettings;
    context: ContextSettings;
    instruct_derived: boolean;
    context_derived: boolean;
    context_size_derived: boolean;
    model_templates_mappings: Record<string, any>;
    chat_template_hash: string;
    sysprompt: SysPromptSettings;
    reasoning: ReasoningSettings;
    personas: Record<string, string>;
    default_persona: any;
    persona_descriptions: Record<string, PersonaDescription>;
    persona_description: string;
    persona_description_position: number;
    persona_description_role: number;
    persona_description_depth: number;
    persona_description_lorebook: string;
    persona_show_notifications: boolean;
    persona_sort_order: string;
    custom_stopping_strings: string;
    custom_stopping_strings_macro: boolean;
    fuzzy_search: boolean;
    encode_tags: boolean;
    servers: any[];
    bogus_folders: boolean;
    zoomed_avatar_magnification: boolean;
    show_tag_filters: boolean;
    aux_field: string;
    stscript: StScriptSettings;
    restore_user_input: boolean;
    reduced_motion: boolean;
    compact_input_area: boolean;
    show_swipe_num_all_messages: boolean;
    auto_connect: boolean;
    auto_load_chat: boolean;
    forbid_external_media: boolean;
    external_media_allowed_overrides: any[];
    external_media_forbidden_overrides: any[];
    pin_styles: boolean;
    click_to_edit: boolean;
    ui_mode: number;
    auto_sort_tags: boolean;
    selectSamplers: {
        forceHidden: any[];
        forceShown: any[];
    };
}

export interface ChatCompletionSettings {
    preset_settings_openai: string;
    temp_openai: number;
    freq_pen_openai: number;
    pres_pen_openai: number;
    top_p_openai: number;
    top_k_openai: number;
    min_p_openai: number;
    top_a_openai: number;
    repetition_penalty_openai: number;
    stream_openai: boolean;
    openai_max_context: number;
    openai_max_tokens: number;
    wrap_in_quotes: boolean;
    prompts: Prompt[];
    prompt_order: PromptOrder[];
    send_if_empty: string;
    impersonation_prompt: string;
    new_chat_prompt: string;
    new_group_chat_prompt: string;
    new_example_chat_prompt: string;
    continue_nudge_prompt: string;
    bias_preset_selected: string;
    bias_presets: Record<string, Bias[]>;
    wi_format: string;
    group_nudge_prompt: string;
    scenario_format: string;
    personality_format: string;
    openai_model: string;
    claude_model: string;
    google_model: string;
    vertexai_model: string;
    ai21_model: string;
    mistralai_model: string;
    cohere_model: string;
    perplexity_model: string;
    groq_model: string;
    electronhub_model: string;
    electronhub_sort_models: string;
    electronhub_group_models: boolean;
    nanogpt_model: string;
    deepseek_model: string;
    aimlapi_model: string;
    xai_model: string;
    pollinations_model: string;
    cometapi_model: string;
    moonshot_model: string;
    fireworks_model: string;
    azure_base_url: string;
    azure_deployment_name: string;
    azure_api_version: string;
    azure_openai_model: string;
    custom_model: string;
    custom_url: string;
    custom_include_body: string;
    custom_exclude_body: string;
    custom_include_headers: string;
    openrouter_model: string;
    openrouter_use_fallback: boolean;
    openrouter_group_models: boolean;
    openrouter_sort_models: string;
    openrouter_providers: any[];
    openrouter_allow_fallbacks: boolean;
    openrouter_middleout: string;
    reverse_proxy: string;
    chat_completion_source: string;
    max_context_unlocked: boolean;
    show_external_models: boolean;
    proxy_password: string;
    assistant_prefill: string;
    assistant_impersonation: string;
    claude_use_sysprompt: boolean;
    use_makersuite_sysprompt: boolean;
    vertexai_auth_mode: string;
    vertexai_region: string;
    vertexai_express_project_id: string;
    squash_system_messages: boolean;
    image_inlining: boolean;
    inline_image_quality: string;
    video_inlining: boolean;
    bypass_status_check: boolean;
    continue_prefill: boolean;
    function_calling: boolean;
    names_behavior: number;
    continue_postfix: string;
    custom_prompt_post_processing: string;
    show_thoughts: boolean;
    reasoning_effort: string;
    enable_web_search: boolean;
    request_images: boolean;
    seed: number;
    n: number;
    bind_preset_to_connection: boolean;
    extensions: Record<string, any>;
}

export interface Prompt {
    name: string;
    system_prompt: boolean;
    role: string;
    content: string;
    identifier: string;
    marker?: boolean;
}

export interface PromptOrder {
    character_id: number;
    order: Order[];
}

export interface Order {
    identifier: string;
    enabled: boolean;
}

export interface Bias {
    id: string;
    text: string;
    value: number;
}

export interface TextCompletionSettings {
    temp: number;
    temperature_last: boolean;
    top_p: number;
    top_k: number;
    top_a: number;
    tfs: number;
    epsilon_cutoff: number;
    eta_cutoff: number;
    typical_p: number;
    min_p: number;
    rep_pen: number;
    rep_pen_range: number;
    rep_pen_decay: number;
    rep_pen_slope: number;
    no_repeat_ngram_size: number;
    penalty_alpha: number;
    num_beams: number;
    length_penalty: number;
    min_length: number;
    encoder_rep_pen: number;
    freq_pen: number;
    presence_pen: number;
    skew: number;
    do_sample: boolean;
    early_stopping: boolean;
    dynatemp: boolean;
    min_temp: number;
    max_temp: number;
    dynatemp_exponent: number;
    smoothing_factor: number;
    smoothing_curve: number;
    dry_allowed_length: number;
    dry_multiplier: number;
    dry_base: number;
    dry_sequence_breakers: string;
    dry_penalty_last_n: number;
    max_tokens_second: number;
    seed: number;
    preset: string;
    add_bos_token: boolean;
    stopping_strings: any[];
    ban_eos_token: boolean;
    skip_special_tokens: boolean;
    include_reasoning: boolean;
    streaming: boolean;
    mirostat_mode: number;
    mirostat_tau: number;
    mirostat_eta: number;
    guidance_scale: number;
    negative_prompt: string;
    grammar_string: string;
    json_schema: Record<string, any>;
    banned_tokens: string;
    global_banned_tokens: string;
    send_banned_tokens: boolean;
    sampler_priority: string[];
    samplers: string[];
    samplers_priorities: string[];
    ignore_eos_token: boolean;
    spaces_between_special_tokens: boolean;
    speculative_ngram: boolean;
    type: string;
    mancer_model: string;
    togetherai_model: string;
    infermaticai_model: string;
    ollama_model: string;
    openrouter_model: string;
    openrouter_providers: any[];
    vllm_model: string;
    aphrodite_model: string;
    dreamgen_model: string;
    tabby_model: string;
    sampler_order: number[];
    logit_bias: any[];
    n: number;
    server_urls: Record<string, any>;
    custom_model: string;
    bypass_status_check: boolean;
    openrouter_allow_fallbacks: boolean;
    xtc_threshold: number;
    xtc_probability: number;
    nsigma: number;
    min_keep: number;
    featherless_model: string;
    generic_model: string;
    extensions: Record<string, any>;
    rep_pen_size: number;
}
