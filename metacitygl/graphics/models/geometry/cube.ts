import * as THREE from "three";
import { computeDots } from "../../../utils/utils/normals";

export function unitCube() {
    const positions = new THREE.BoxGeometry().toNonIndexed();
    const posArr = positions.attributes.position.array as Float32Array;
    const dots = computeDots(posArr);

    return {
        positions: posArr,
        dots,
    }
}



