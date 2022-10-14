import { TreeGeometry, TreeModel, TreeQuadrantData } from "./types";
import * as Utils from "../../../utils"

interface QuadTreeProps {
    data: TreeQuadrantData;
    bmin: [number, number];
    bmax: [number, number];
    color: [number, number, number];
    styles: Utils.Styles.Style[];
    bellowLoadingLevel?: boolean;
    radiusLoading?: number;
    radiusTileRequest?: number;
    visualizeTree?: boolean;
}

export class QuadTree {
    min: { x: number, y: number, z: number };
    max: { x: number, y: number, z: number };
    center: { x: number, y: number, z: number };
    dimensions: { x: number, y: number, z: number };
    metadata: { [key: string]: number | string };
    color: number[];
    depth: number;
    bellowLoadingLevel: boolean;
    url?: string;
    size: number;

    tileLoaded = false;

    ne?: QuadTree;
    nw?: QuadTree;
    sw?: QuadTree;
    se?: QuadTree;

    LOADING_RADIUS: number = 128 * 128 * 4 * 4;
    REQEST_TILE_RADIUS: number = 16 * 16;
    POW_FACTOR = 0.5;

    cachcedSpaceRequired = 0;
    visualizeTree = true;


    constructor(props: QuadTreeProps, depth: number = 0) {
        const { data, bmin, bmax, color, styles } = props;
        this.bellowLoadingLevel = props.bellowLoadingLevel || false;
        
        this.min = { x: bmin[0], y: bmin[1], z: data.z[0] };
        this.max = { x: bmax[0], y: bmax[1], z: data.z[1] };

        this.center = {
            x: (bmin[0] + bmax[0]) * 0.5,
            y: (bmin[1] + bmax[1]) * 0.5,
            z: (data.z[0] + data.z[1]) * 0.5
        };

        this.dimensions = {
            x: bmax[0] - bmin[0],
            y: bmax[1] - bmin[1],
            z: data.z[1] - data.z[0]
        };

        this.color = color;
        this.size = data.size;
        this.url = data.file;
        this.depth = depth;
        this.metadata = data.metadata;
        this.metadata["height"] = this.dimensions.z;

        this.LOADING_RADIUS = props.radiusLoading ?? this.LOADING_RADIUS;
        this.REQEST_TILE_RADIUS = props.radiusTileRequest ?? this.REQEST_TILE_RADIUS;

        this.applyStyles(styles);
        this.initChildren(props, data, depth);
        this.cachcedSpaceRequired = this.spaceRequired();
    }


    private initChildren(props: QuadTreeProps, data: TreeQuadrantData, depth: number) {
        const childLoading = props.bellowLoadingLevel || this.url !== undefined;
        if (data.ne) {
            this.ne = new QuadTree({
                data: data.ne,
                bmin: [this.center.x, this.center.y],
                bmax: [this.max.x, this.max.y],
                color: props.color,
                styles: props.styles,
                bellowLoadingLevel: childLoading
            }, depth + 1);
        }

        if (data.se) {
            this.se = new QuadTree({
                data: data.se,
                bmin: [this.center.x, this.min.y],
                bmax: [this.max.x, this.center.y],
                color: props.color,
                styles: props.styles,
                bellowLoadingLevel: childLoading
            }, depth + 1);
        }

        if (data.sw) {
            this.sw = new QuadTree({
                data: data.sw,
                bmin: [this.min.x, this.min.y],
                bmax: [this.center.x, this.center.y],
                color: props.color,
                styles: props.styles,
                bellowLoadingLevel: childLoading
            }, depth + 1);
        }

        if (data.nw) {
            this.nw = new QuadTree({
                data: data.nw,
                bmin: [this.min.x, this.center.y],
                bmax: [this.center.x, this.max.y],
                color: props.color,
                styles: props.styles,
                bellowLoadingLevel: childLoading
            }, depth + 1);
        }
    }

    private applyStyles(styles: Utils.Styles.Style[]) {
        let c;
        for (let i = 0; i < styles.length; i++)
            c = styles[i].apply(this.metadata) ?? c;

        if (c)
            this.color = Utils.Color.colorHexToArr(c);
    }

    geometry(position: { x: number, y: number, z: number }, g: TreeGeometry) {
        if (this.tileLoaded)
            return;

        const { distSqr, radiusSqr } = this.computeDistances(position);
        
        if (!this.bellowLoadingLevel) {
            const canFullLoad = this.url !== undefined;
            const fullLoad = this.requestFullLoad(distSqr, radiusSqr);

            if (fullLoad && canFullLoad && g.tilesToLoad) {
                this.tileLoaded = true;
                
                const pch = {
                    name: this.url!,
                    size: this.size,
                    model: {
                        array: new Float32Array(this.cachcedSpaceRequired),
                        filled: 0,
                    }
                }

                this.buildModel(distSqr, radiusSqr, position, pch.model);
                g.tilesToLoad.push(pch);
                return;
            } 
        } 
        
        this.buildModel(distSqr, radiusSqr, position, g);
    }

    private computeDistances(position: { x: number; y: number; z: number; }) {
        const distSqr = Math.abs(position.x - this.center.x) ** (2 + this.POW_FACTOR) + Math.abs(position.y - this.center.y) ** (2 + this.POW_FACTOR) + (position.z - this.center.z) ** 2;
        const radiusSqr = Math.max(this.max.x - this.min.x, this.max.y - this.min.y) ** 2;
        return { distSqr, radiusSqr };
    }

    private buildModel(distSqr: number, radiusSqr: number, position: { x: number; y: number; z: number; }, g: TreeModel) {
        if (!this.isLeaf && distSqr < radiusSqr * this.LOADING_RADIUS) {
            this.ne?.geometry(position, g as any); //TODO
            this.se?.geometry(position, g as any);
            this.sw?.geometry(position, g as any);
            this.nw?.geometry(position, g as any);
        } else {
            //append geometry of current node

            if (!this.visualizeTree || !g.array)
                return;

            g.array[g.filled++] = this.center.x;
            g.array[g.filled++] = this.center.y;
            g.array[g.filled++] = this.center.z;
            g.array[g.filled++] = this.dimensions.x;
            g.array[g.filled++] = this.dimensions.y;
            g.array[g.filled++] = this.dimensions.z;
            g.array[g.filled++] = this.color[0];
            g.array[g.filled++] = this.color[1];
            g.array[g.filled++] = this.color[2];
        }
    }

    private requestFullLoad(distSqr: number, radiusSqr: number): boolean {
        if (this.tileLoaded) {
            return true;
        }

        if (this.isLeaf && distSqr < radiusSqr * this.REQEST_TILE_RADIUS) {    
            return true;
        } 

        if (!this.isLeaf && distSqr < radiusSqr * this.REQEST_TILE_RADIUS) {
            const nw = this.nw ? this.nw?.requestFullLoad(distSqr, radiusSqr) : true;
            const ne = this.ne ? this.ne?.requestFullLoad(distSqr, radiusSqr) : true;
            const sw = this.sw ? this.sw?.requestFullLoad(distSqr, radiusSqr) : true;
            const se = this.se ? this.se?.requestFullLoad(distSqr, radiusSqr) : true;
            return nw && ne && sw && se;
        }

        return false;
    }

    private get isLeaf() {
        return !this.ne && !this.nw && !this.se && !this.sw;
    }

    spaceRequired() {
        let s = 0;

        if(this.isLeaf)
            s += 9;

        if (this.ne)
            s += this.ne.spaceRequired();
        if (this.se)
            s += this.se.spaceRequired();
        if (this.sw)
            s += this.sw.spaceRequired();
        if (this.nw)
            s += this.nw.spaceRequired();
            
        return s;
    }
}