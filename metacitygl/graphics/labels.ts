import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as THREE from "three";


export class HoverLabels {
    private hoverLabel: CSS2DObject | undefined;
    private hoverLabelID: number | undefined;
    constructor(private scene: THREE.Scene) {}

    add(bbox: [number[], number[]], elm: HTMLElement, objectID?: number) {
        if ((objectID !== this.hoverLabelID)) {
            this.clear();
        }

        if (!this.hoverLabel && bbox) {
            const [x, y, z] = [(bbox[0][0] + bbox[1][0]) * 0.5, (bbox[0][1] + bbox[1][1]) * 0.5, bbox[1][2]];
            const obj = this.createLabel(x, y, z, elm);
            this.hoverLabel = obj;
            this.hoverLabelID = objectID;
        }
    }

    clear() {
        if (this.hoverLabel) {
            this.scene.remove(this.hoverLabel);
            this.hoverLabel = undefined;
            this.hoverLabelID = undefined;
        }
    }

    private createLabel(x: number, y: number, z: number, elm: HTMLElement) {
        const label = new CSS2DObject(elm);
        label.position.set(x, y, z);
        this.scene.add(label);
        return label;
    }
}


