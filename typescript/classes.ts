import { ActionTypes } from './enums';

export class CapErrors {
    public static KeywordTypesError: string = 'Types Array Contains Non-KeywordTypes Enum Value.';
}

export class ActionMetadata {
    public channel_id: string;
    public duration: number;

    constructor(channel_id: string, duration: number) {
        this.channel_id = channel_id;
        this.duration = duration;
    }
}

export class Action {
    public type: ActionTypes;
    public typeId: number;
    public data: ActionMetadata;

    constructor(type: ActionTypes, metadata: ActionMetadata) {
        this.type = type;
        this.typeId = ActionTypes[ActionTypes[type]] + 1;
        this.data = metadata;
    }
}