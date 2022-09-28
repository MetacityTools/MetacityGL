import * as THREE from 'three';
import { Navigation, NavigationProps } from './core/navigation';
import { GPUPicker } from './core/gpuPicker'
import { Renderer, RendererProps } from './core/renderer';


export interface GraphicsContextProps extends NavigationProps, RendererProps {
    onFrame?: (time: number, timeMax: number) => void;
    container: HTMLDivElement;
}


export class GraphicsContext {
    readonly renderer: Renderer;
    readonly scene: THREE.Scene;
    readonly labelScene: THREE.Scene;
    readonly navigation: Navigation;
    readonly picker: GPUPicker;
    readonly container: HTMLDivElement;

    private speed_: number = 0;
    private time_: number = 0;
    private timeframe_: [number, number] = [Infinity, -Infinity];

    private onFrameFn: ((time: number, timeMax: number) => void) | undefined;
    private beforeFrameUpdateFns: ((time: number) => void)[] = [];

    constructor(props: GraphicsContextProps) {
        this.container = props.container;
        this.renderer = new Renderer(props, this.container);
        this.scene = new THREE.Scene();
        this.labelScene = new THREE.Scene();
        this.navigation = new Navigation(props);
        this.picker = new GPUPicker(this.renderer.renderer, this.navigation.camera);
        this.onFrameFn = props.onFrame;

        let time = Date.now();
        const frame = async () => {
            //time management
            time = this.updateTime(time);

            //update
            this.beforeFrameUpdateFns.forEach(fn => fn(this.time_));

            //rendering
            this.navigation.controls.update();
            this.renderer.renderer.render(this.scene, this.navigation.camera);
            //this.renderer.renderer.render(this.picker.pickingScene, this.navigation.camera);
            this.renderer.labelRenderer.render(this.labelScene, this.navigation.camera);
            requestAnimationFrame(frame);
        };

        this.updateSize();
        frame();
    }

    private updateTime(time: number) {
        if (this.speed_ !== 0) {
            const delta = (Date.now() - time) / 1000 * this.speed_;
            this.time_ = (this.time_ + delta) % this.timeframe_[1];
        }
        
        this.scene.userData.time = this.time_;
        
        if (this.onFrameFn)
        this.onFrameFn(this.time_, this.timeframe_[1]);
        
        time = Date.now();
        return time;
    }

    get timeframe() {
        return this.timeframe_;
    }

    get timeRunning() {
        return this.timeframe_[1] !== -Infinity;
    }

    set time(t: number) {
        this.time_ = t;
        this.scene.userData.time = t;
    }

    set timeframe(timeframe: [number, number]) {
        this.timeframe_[0] = Math.min(this.timeframe_[0], timeframe[0]);
        this.timeframe_[1] = Math.max(this.timeframe_[1], timeframe[1]);

        if (this.speed_ === 0)
            this.speed_ = 1;
    }

    set speed(value: number) {
        if(this.timeRunning)
            this.speed_ = value;
    }

    set onBeforeFrame(fn: (time: number) => void) {
        this.beforeFrameUpdateFns.push(fn);
    }

    updateSize() {
        let width, height;
        const { container } = this;
        
        if (container.parentNode) {
            let parent = container.parentNode as HTMLElement;
            width = parent.clientWidth;
            height = parent.clientHeight;
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        
        this.renderer.resize(width, height);
        this.navigation.controls.updateCamera(width, height);

        if (container) {
            container.style.width = width + 'px';
            container.style.height = height + 'px';    
        }
    };
}
