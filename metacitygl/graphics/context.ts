import * as THREE from 'three';
import { Navigation, NavigationProps } from './core/navigation';
import { GPUPicker } from './core/gpuPicker'
import { Renderer, RendererProps } from './core/renderer';
import { Metadata } from '../utils/types';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import services from '../extensions/services';


export interface GraphicsContextProps extends NavigationProps, RendererProps {
    container: HTMLDivElement;
}


export class GraphicsContext {
    readonly renderer: Renderer;
    readonly scene: THREE.Scene;
    readonly navigation: Navigation;
    readonly picker: GPUPicker;
    readonly container: HTMLDivElement;
    readonly stats: Stats;
    readonly services = services;
    private metadata: Metadata;

    private _speed: number = 0;
    private _time: number = 0;
    private _timeMin = Infinity;
    private _timeMax = -Infinity;

    private beforeFrameUpdateFns: ((time: number) => void)[] = [];

    constructor(props: GraphicsContextProps) {
        this.container = props.container;
        this.renderer = new Renderer(props, this.container);
        this.scene = new THREE.Scene();
        this.navigation = new Navigation(props);
        this.picker = new GPUPicker(this.renderer.renderer, this.navigation.camera);
        this.metadata = {};
        this.stats = Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
        this.setupStats();

        let time = Date.now();
        const frame = async () => {
            this.stats.begin();
            //time management
            time = this.updateTime(time);

            //update
            this.beforeFrameUpdateFns.forEach(fn => fn(this._time));

            //rendering
            this.navigation.controls.update();
            this.renderer.renderer.render(this.scene, this.navigation.camera);
            requestAnimationFrame(frame);
            this.stats.end();
        };

        this.updateSize();
        frame();
    }

    private updateTime(time: number) {
        if (this._speed !== 0) {
            const delta = (Date.now() - time) / 1000 * this._speed;
            this._time = (this._time + delta) % this._timeMax;

            if (this._time < this._timeMin)
                this._time = this._timeMin;
        }
        
        this.scene.userData.time = this._time;
        time = Date.now();
        return time;
    }

    private setupStats() {
        this.stats.dom.style.display = 'none';
        document.onkeydown = (e) => {
            console.log(e.key);
            if (e.key === 's') {
                this.toggleStats();
            }
        }
    }

    toggleStats() {
        this.stats.dom.style.display = this.stats.dom.style.display === 'none' ? 'block' : 'none';
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
        this.navigation.controls.updateCamera(width, height);
    };
}
