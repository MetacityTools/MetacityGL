import { Metadata } from '../types';
import { sampleColor } from '../utils/color';
import { StyleRule } from './rule';
import { deserializeRule } from './deserialize';


export class Style {
    rules: StyleRule[] = [];
    color: number | number[] =  0x00ffff;

    add(rule: StyleRule) {
        this.rules.push(rule);
        return this;
    }

    useColor(color_: number | number[]) {
        this.color = color_;
        return this;
    }

    apply(metadata: Metadata) {
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


