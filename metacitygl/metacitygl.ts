import { GraphicsContextProps, GraphicsContext } from "./graphics/context";
import { Visualization } from "./ui/visualization";
import { Driver, DriverProps } from "./drivers/driver";
import { Model } from "./graphics/models/model";
import * as Graphics from "./graphics";

interface MetacityGLProps extends GraphicsContextProps {

}

class MetacityGL {
    context: GraphicsContext | undefined;
    drivers: Driver<DriverProps>[] = [];
    
    private initialized: boolean = false;
    
    constructor() {
        window.onresize = () => {
            if (this.context) 
                this.context.updateSize();
        };
    }

    initialize(props: MetacityGLProps) {
        this.context = new GraphicsContext(props);
        if (!this.initialized) {
            this.initialized = true;
            this.drivers.forEach((driver) => {
                this.initDriver(driver);
            });
        }

        props.canvas.onpointermove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const id = this.context!.picker.pick(x, y);
            const metadata = this.getMetadata(id);
            if (metadata) {
                console.log(id);
                console.log(metadata);
                //TODO hover dialog
            }
        }
    }

    addDriver(driver: Driver<DriverProps>) {
        this.drivers.push(driver);
        if (this.initialized)
            this.initDriver(driver);
    }

    addModel(model: Model, pickable?: boolean) {
        if (this.context && model) {
            this.context.scene.add(model);

            if (pickable) {
                const pickModel = model.clone();
                pickModel.toPickable();
                this.context.picker.addPickable(pickModel);
            }
        }
        return model;
    }

    private async initDriver(driver: Driver<DriverProps>) {
        await driver.onInit();
        if(this.context) {
            this.context.navigation.onchange = (target: THREE.Vector3, position: THREE.Vector3) => {
                driver.onViewUpdate(target, position);
            }
        }
    }

    private getMetadata(id: number) {
        for (let i = 0; i < this.drivers.length; i++) {
            const driver = this.drivers[i];
            if (driver.metadata[id])
                return driver.metadata[id];
        }
        return undefined;
    }
}

export {
    MetacityGL,
    Visualization,
    Driver,
    Graphics
}

export type {
    DriverProps,
}