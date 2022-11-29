import { GraphicsContext } from "../context";
import { RenderingPipeline } from "./base";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as THREE from 'three';

export interface BloomProps {
    bloomStrength?: number;
    bloomThreshold?: number;
    bloomRadius?: number;
}


export class BloomRenderingPipeline extends RenderingPipeline {
    bloomPass: UnrealBloomPass;

    constructor(readonly context: GraphicsContext, props: BloomProps) {
        super();

        const params = {
            bloomStrength: props.bloomStrength ?? 1,
            bloomThreshold: props.bloomThreshold ?? 0.8,
            bloomRadius: props.bloomRadius ?? 0.05,
        };

        this.bloomPass = new UnrealBloomPass( new THREE.Vector2(0, 0), 0, 0, 0 );
        this.bloomPass.strength = params.bloomStrength;
        this.bloomPass.radius = params.bloomRadius;
        this.bloomPass.threshold = params.bloomThreshold;
    }

    runRendringLoop() {
        const context = this.context;
        const renderScene = new RenderPass( context.scene, context.navigation.camera );
        const bloomComposer = new EffectComposer( context.renderer.renderer );
        bloomComposer.addPass( renderScene );
        bloomComposer.addPass( this.bloomPass );

        const frame = async () => {
            context.preRender();
            context.cameraAnimationStep();
            bloomComposer.render();
            requestAnimationFrame(frame);
            context.postRender();
        };

        frame();
    }

    resize(width: number, height: number) {
        this.bloomPass.setSize(width, height);
    }
}