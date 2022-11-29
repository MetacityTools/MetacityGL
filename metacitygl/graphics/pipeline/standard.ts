import { GraphicsContext } from "../context";
import { RenderingPipeline } from "./base";



export class StandardRenderingPipeline extends RenderingPipeline {
    constructor(readonly context: GraphicsContext) {
        //pass
        super();
    }

    runRendringLoop() {
        const context = this.context;

        const frame = async () => {
            context.preRender();
            context.cameraAnimationStep();
            context.renderer.renderer.render(context.scene, context.navigation.camera);
            requestAnimationFrame(frame);
            context.postRender();
        };

        frame();
    }

    resize(width: number, height: number) {
        //pass
    }
}