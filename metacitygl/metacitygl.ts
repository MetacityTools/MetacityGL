import { GraphicsContextProps, GraphicsContext } from "./graphics/context";
import { Driver, DriverProps } from "./drivers/driver";
import { Model } from "./graphics/models/model";
import * as Graphics from "./graphics";
import * as Components from "./components";
import { HoverLabels } from "./graphics/core/labels";

interface MetacityGLProps extends GraphicsContextProps {
    onHover?: (id: number, metadata: any) => HTMLElement;
}

class MetacityGL {
    context: GraphicsContext | undefined;
    drivers: Driver<DriverProps>[] = [];
    private onInitFns_: (() => void)[] = []; 
    
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

        const labels = new HoverLabels(this.context.labelScene);

        props.canvas.onpointermove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const id = this.context!.picker.pick(x, y);
            const metadata = this.getMetadata(id);
            if (metadata && props.onHover) {
                console.log(id);
                console.log(metadata);
                labels.add(metadata.bbox, props.onHover(id, metadata), id);
            } else {
                labels.clear();
            }
        }

        props.canvas.onpointerup = (e) => {
            this.context?.navigation.update();
        };

        this.onInitFns_.forEach((fn) => {
            fn();
        });
        this.onInitFns_ = [];
    }

    addDriver(driver: Driver<DriverProps>) {
        this.drivers.push(driver);
        if (this.initialized)
            this.initDriver(driver);
    }

    addModel(model: Model, pickable?: boolean) {
        if (this.context && model) {
            this.context.scene.add(model);
            model.onAdd(this.context);

            if (pickable) {
                const pickModel = model.clone();
                pickModel.toPickable();
                this.context.picker.addPickable(pickModel);
            }
        }
        return model;
    }

    set onInit(fn: () => void) {
        if (this.initialized)
            fn();
        else
            this.onInitFns_.push(fn);
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
    Driver,
    Components,
    Graphics
}

export type {
    DriverProps,
}