import * as THREE from "three";


export interface RendererProps {
    background?: number;
    antialias?: boolean;
}


export class Renderer {
    readonly renderer: THREE.WebGLRenderer;

    constructor(props: RendererProps, canvas: HTMLCanvasElement, container: HTMLElement) {
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: props.antialias ?? false,
            powerPreference: 'high-performance',
        });
        this.renderer.setClearColor(props.background ?? 0x000000, 1);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    resize(width: number, height: number) {
        this.renderer.setSize(width, height);
    }
}

