import { MetadataRecord } from "../types";


export abstract class StyleRule {
    static $type?: string;
    abstract apply(metadata: MetadataRecord): number;
}

export class StyleForAll extends StyleRule {
    static $type = 'always';
    apply() {
        return Math.random();
    }

    toJSON() {
        return {
            $type: StyleForAll.$type
        };
    }
}

export class StyleAttributeEqualTo extends StyleRule {
    attribute: string;
    value: number | string;
    static $type = 'attributeEqualTo';

    constructor(props: { attribute: string, value: number | string }) {
        super();
        this.attribute = props.attribute;
        this.value = props.value;
    }

    apply(metadata: MetadataRecord) {
        if (Object.prototype.hasOwnProperty.call(metadata, this.attribute) && metadata[this.attribute] == this.value) {
            return 1;
        }
        return -1;
    }

    toJSON() {
        return {
            $type: StyleAttributeEqualTo.$type,
            attribute: this.attribute,
            value: this.value
        };
    }
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}


export class StyleAttributeRange extends StyleRule {
    attribute: string;
    min: number;
    max: number;
    static $type = 'attributeRange';

    constructor(props: { attribute: string, min: number, max: number }) {
        super();
        this.attribute = props.attribute;
        this.min = props.min;
        this.max = props.max;
    }

    apply(metadata: MetadataRecord) {
        if (Object.prototype.hasOwnProperty.call(metadata, this.attribute)) {
            const value = metadata[this.attribute];
            return (value - this.min) / (this.max - this.min)
        }
        return -1;
    }

    toJSON() {
        return {
            $type: StyleAttributeRange.$type,
            attribute: this.attribute,
            min: this.min,
            max: this.max
        };
    }
}

export class StyleAttributeRangeExt extends StyleAttributeRange {
    static $type = 'attributeRangeExt';

    constructor(props: { attribute: string, min: number, max: number }) {
        super(props);
    }

    apply(metadata: MetadataRecord) {
        if (Object.prototype.hasOwnProperty.call(metadata, this.attribute)) {
            const value = metadata[this.attribute];
            return clamp((value - this.min) / (this.max - this.min), 0, 1);
        }
        return -1;
    }

    toJSON() {
        return {
            $type: StyleAttributeRangeExt.$type,
            attribute: this.attribute,
            min: this.min,
            max: this.max
        };
    }
}