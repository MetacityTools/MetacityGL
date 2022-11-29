import * as THREE from 'three';
import { Navigation, NavigationProps } from './core/navigation';
import { GPUPicker } from './core/gpuPicker'
import { Renderer, RendererProps } from './core/renderer';
import { Metadata } from '../utils/types';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import services from '../extensions/services';
import { StandardRenderingPipeline } from './pipeline/standard';
import { RenderingPipeline } from './pipeline/base';
import { BloomProps, BloomRenderingPipeline } from './pipeline/bloom';


export interface UserInputProps extends NavigationProps, RendererProps, BloomProps {
    bloom?: boolean;
}

export interface GraphicsContextProps extends UserInputProps {
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
}


export class GraphicsContext {
    public flyover = false;
    
    readonly renderer: Renderer;
    readonly scene: THREE.Scene;
    readonly navigation: Navigation;
    readonly picker: GPUPicker;
    readonly container: HTMLDivElement;
    readonly stats: Stats;
    readonly services = services;
    private metadata: Metadata;
    private pipeline: RenderingPipeline;

    private _speed: number = 0;
    private _time: number = 0;
    private _realTime: number = 0;
    private _timeMin = Infinity;
    private _timeMax = -Infinity;

    private beforeFrameUpdateFns: ((time: number) => void)[] = [];


    constructor(props: GraphicsContextProps) {
        this.container = props.container;
        this.renderer = new Renderer(props, props.canvas, this.container);
        this.scene = new THREE.Scene();
        this.navigation = new Navigation(props, props.canvas);
        this.picker = new GPUPicker(this.renderer.renderer, this.navigation.camera);
        this.metadata = {};
        this.stats = Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
        this.setupStats();

        const frame = async () => {
            this.preRender();
            this.cameraAnimationStep();
            this.renderer.renderer.render(this.scene, this.navigation.camera);
            requestAnimationFrame(frame);
            this.postRender();
        };

        if (props.bloom)
            this.pipeline = new BloomRenderingPipeline(this, props);
        else 
            this.pipeline = new StandardRenderingPipeline(this);

        this.updateSize();
        this._realTime = Date.now();
        this.pipeline.runRendringLoop();
    }

    preRender() {
        this.stats.begin();
        //time management
        this.updateTime();
        //update
        this.beforeFrameUpdateFns.forEach(fn => fn(this._time));
    }

    cameraAnimationStep() {
        //rendering
        if (this.flyover) {
            this.navigation.controls.flyOverStep();
        } else {
            this.navigation.controls.update();
        }
    }

    postRender() {
        this.stats.end();
    }

    private updateTime() {
        if (this._speed !== 0) {
            const delta = (Date.now() - this._realTime) / 1000 * this._speed;
            this._time = (this._time + delta) % this._timeMax;

            if (this._time < this._timeMin)
                this._time = this._timeMin;
        }
            
        this.scene.userData.time = this._time;
        this._realTime = Date.now();
    }

    private setupStats() {
        this.stats.dom.style.display = 'none';
        document.onkeydown = (e) => {
            console.log(e.key);
            if (e.key === 's') {
                this.toggleStats();
            }

            if (e.key === 'f') {
                this.toggleFlyover();
            }
        }
    }

    toggleStats() {
        this.stats.dom.style.display = this.stats.dom.style.display === 'none' ? 'block' : 'none';
    }

    toggleFlyover() {
        this.flyover = !this.flyover;
    }

    set time(t: number) {
        this._time = t;
        this.scene.userData.time = t;
    }

    get time() {
        return this._time;
    }

    get timeMin() {
        return this._timeMin;
    }

    set timeMin(value: number) {
        this._timeMin = Math.min(value, this._timeMax);
    }

    get timeMax() {
        return this._timeMax;
    }

    set timeMax(value: number) {
        this._timeMax = Math.max(value, this._timeMax);
    }
    
    set speed(value: number) {
        this._speed = value;
    }

    get speed() {
        return this._speed;
    }

    get timeRunning() {
        return this._speed !== 0 && this._timeMax > this._timeMin;
    }

    set onNavChange(fn: (target: THREE.Vector3, position: THREE.Vector3) => void) {
        this.navigation.onChange = fn;
    }

    set onBeforeFrame(fn: (time: number) => void) {
        this.beforeFrameUpdateFns.push(fn);
    }

    add(model: any, metadata?: Metadata) {
        this.scene.add(model);
        model.onAdd(this);
        
        if (metadata) {
            for(const key in metadata) {
                this.metadata[key] = metadata[key];
            }
            const pickModel = model.clone();
            pickModel.toPickable();
            this.picker.addPickable(pickModel);
        }
    }

    remove(model: any) {
        this.scene.remove(model);
    }

    removeAll() {
        this.scene.children.forEach(child => this.scene.remove(child));
    }

    getMetadata(key: number) {
        return this.metadata[key];
    }

    pick(x: number, y: number) {
        const id = this.picker.pick(x, y);
        if (id in this.metadata) {
            return {
                metadata: this.metadata[id],
                id
            };
        }
    }

    updateSize() {
        let width, height;
        const { container } = this;
        
        if (container) {
            width = container.clientWidth;
            height = container.clientHeight;
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        
        this.renderer.resize(width, height);
        console.log('resize', this);
        this.pipeline.resize(width, height);
        this.navigation.controls.updateCamera(width, height);
    };
}
