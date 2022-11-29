import { Metadata, MetadataRecord } from '../types';
import { sampleColor, parseColorArray } from '../utils/color';
import { StyleRule } from './rule';
import { deserializeRule } from './deserialize';
import { Types } from '../../utils';


export class Style {
    rules: StyleRule[] = [];
    color: Types.Color | Types.Color[] =  [0, 1, 1];

    add(rule: StyleRule) {
        this.rules.push(rule);
        return this;
    }

    useColor(color_: Types.ColorInput | Types.ColorInput[]) {
        this.color = parseColorArray(color_) ?? [0, 1, 1];
        return this;
    }

    apply(metadata: MetadataRecord) {
        let applyColorIndicator = Math.random();
        for (const rule of this.rules) {
            applyColorIndicator = rule.apply(metadata);
            if (applyColorIndicator < 0 || applyColorIndicator > 1) {
                return;
            }
        }
        return sampleColor(this.color, applyColorIndicator);
    }

    serialize() {
        const style_ = {
            rules: this.rules.map((rule) => JSON.stringify(rule)),
            color: this.color
        };
        return JSON.stringify(style_);
    }

    static deserialize(styleSerialized: string) {
        const style = new Style();
        const style_ = JSON.parse(styleSerialized);
        style.rules = style_.rules.map(deserializeRule);
        style.color = style_.color;
        return style;
    }
}


