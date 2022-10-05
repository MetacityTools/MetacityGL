import { StyleForAll, StyleAttributeEqualTo, StyleAttributeRange, StyleAttributeRangeExt } from './rule';


export function deserializeRule(rule: string) {
    const rule_ = JSON.parse(rule);
    
    //ugly but safe
    switch (rule_.$type) {
    case StyleForAll.$type:
        return new StyleForAll();
    case StyleAttributeEqualTo.$type:
        return new StyleAttributeEqualTo(rule_);
    case StyleAttributeRange.$type:
        return new StyleAttributeRange(rule_);
    case StyleAttributeRangeExt.$type:
        return new StyleAttributeRangeExt(rule_);
    default:
        throw new Error('Unknown rule type: ' + rule_.$type);
    }
}
