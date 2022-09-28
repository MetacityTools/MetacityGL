import { GraphicsProps, GraphicsContext } from "./graphics/context";



interface MetacityGLProps extends GraphicsProps {

}

export class MetacityGL {
    constructor() {
        console.log("Initialized MetacityGL Lib");
    }

    initialize(props: MetacityGLProps) {
        const context = new GraphicsContext(props);
    }
}