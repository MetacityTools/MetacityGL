import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface MapControlsProps {
    near?: number;
    far?: number;
    minDistance?: number;
    maxDistance?: number;
    zoomSpeed?: number;
    minPolarAngle?: number;
    maxPolarAngle?: number;
}

const UP = new THREE.Vector3(0, 0, 1);

export class MapControls extends OrbitControls {
    readonly camera: THREE.PerspectiveCamera;
    direction = new THREE.Vector3();

    constructor(props: MapControlsProps, domElement: HTMLCanvasElement) {
        const camera = new THREE.PerspectiveCamera(
            30,
            domElement.clientWidth / domElement.clientHeight,
            props.near ?? 200,
            props.far ?? 100000
        );
        camera.up.set(0, 0, 1);
        super(camera, domElement);
        this.camera = camera;
        this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up
        this.mouseButtons.LEFT = THREE.MOUSE.PAN;
        this.mouseButtons.MIDDLE = THREE.MOUSE.ROTATE;
        this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
        this.touches.ONE = THREE.TOUCH.PAN;
        this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
        this.zoomSpeed = props.zoomSpeed ?? 1;
        this.minDistance = props.minDistance ?? 1000;
        this.maxDistance = props.maxDistance ?? 96000;
        this.minPolarAngle = props.minPolarAngle ?? 0.001;
        this.maxPolarAngle = props.maxPolarAngle ?? Math.PI * 0.4;
        this.update();
    }

    updateCamera(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    flyOverStep() {
        const speed = 4;
        const target = this.target;
        const position = this.camera.position;
        this.direction.subVectors(target, position);
        this.direction.normalize();
        this.direction.cross(UP);
        this.direction.setLength(speed);
        position.add(this.direction);
        this.update();
    }
}