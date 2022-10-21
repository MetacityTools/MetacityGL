import { TreeQuery, SubTreeQuery, QuadrantData, TreeConfig } from "./types";
import * as Utils from "../../../utils"

interface QuadTreeProps {
    data: QuadrantData;
    bmin: [number, number];
    bmax: [number, number];
    color: [number, number, number];
    styles: Utils.Styles.Style[];
}

export class QuadTreeSettings {
    LOADING_RADIUS: number = 500;
    REQEST_TILE_RADIUS: number = 12;
    DIST_FACTOR = 2.5;
    DIST_Z_FACTOR = 2;
    RAD_FACTOR = 2;
    visualizeTree = true;
    zOffset = 0;

    constructor(public config: TreeConfig) {
        this.update(config);
    }

    update(config: TreeConfig) {
        this.RAD_FACTOR = config.radFactor ?? this.RAD_FACTOR;
        this.LOADING_RADIUS = (config.loadingRadius ?? 500) ** this.RAD_FACTOR;
        this.REQEST_TILE_RADIUS = (config.requestTileRadius ?? 12) ** this.RAD_FACTOR;
        this.DIST_FACTOR = config.distFactor ?? this.DIST_FACTOR;
        this.DIST_Z_FACTOR = config.distZFactor ?? this.DIST_Z_FACTOR;
        this.visualizeTree = config.visualizeTree ?? this.visualizeTree;
        this.zOffset = config.zOffset ?? this.zOffset;
    }
}

export const settings = new QuadTreeSettings({});

export class QuadTree {
    center: { x: number, y: number, z: number };
    dimensions: { x: number, y: number, z: number };
    metadata: { [key: string]: number | string };
    color: number[];
    size: number;
    depth: number;
    url?: string;

    tileLoaded = false;

    ne?: QuadTree;
    nw?: QuadTree;
    sw?: QuadTree;
    se?: QuadTree;

    cachcedSpaceRequired = 0;

    constructor(props: QuadTreeProps, depth: number = 0) {
        const { data, bmin, bmax, color, styles } = props;

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
        this.metadata = data.metadata ?? {};
        this.metadata["height"] = this.dimensions.z;

        this.applyStyles(styles);
        //if (depth < 8)
            this.initChildren(props, data, depth);
        this.cachcedSpaceRequired = this.spaceRequired();
    }


    private initChildren(props: QuadTreeProps, data: QuadrantData, depth: number) {
        const loadingLevel = (this.url !== undefined);

        if (loadingLevel && !settings.visualizeTree)
            return;

        if (data.ne) {
            this.ne = new QuadTree({
                data: data.ne,
                bmin: [this.center.x, this.center.y],
                bmax: props.bmax,
                color: props.color,
                styles: props.styles,
            }, depth + 1);
        }

        if (data.se) {
            this.se = new QuadTree({
                data: data.se,
                bmin: [this.center.x, props.bmin[1]],
                bmax: [props.bmax[0], this.center.y],
                color: props.color,
                styles: props.styles,
            }, depth + 1);
        }

        if (data.sw) {
            this.sw = new QuadTree({
                data: data.sw,
                bmin: props.bmin,
                bmax: [this.center.x, this.center.y],
                color: props.color,
                styles: props.styles,
            }, depth + 1);
        }

        if (data.nw) {
            this.nw = new QuadTree({
                data: data.nw,
                bmin: [props.bmin[0], this.center.y],
                bmax: [this.center.x, props.bmax[1]],
                color: props.color,
                styles: props.styles,
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

    query(position: { x: number, y: number, z: number }, q: TreeQuery) {
        this.loadTileModel(position, q);

        if (!settings.visualizeTree || !q.array)
            return;

        this.buildTreeModel(position, q);
    }

    private loadTileModel(position: { x: number; y: number; z: number; }, q: TreeQuery) {
        if (this.tileLoaded) {
            return;
        }

        const { distSqr, radiusSqr } = this.computeDistances(position);

        if (this.url && distSqr < radiusSqr * settings.REQEST_TILE_RADIUS) {
            this.tileToQuery(position, q);
        }

        if (!this.url && distSqr < radiusSqr * settings.REQEST_TILE_RADIUS) {
            this.nw?.loadTileModel(position, q);
            this.ne?.loadTileModel(position, q);
            this.sw?.loadTileModel(position, q);
            this.se?.loadTileModel(position, q);
        }

        return;
    }

    private buildTreeModel(position: { x: number; y: number; z: number; }, q: TreeQuery) {
        if (this.tileLoaded)
            return;

        const { distSqr, radiusSqr } = this.computeDistances(position);

        if (!this.isLeaf && distSqr < radiusSqr * settings.LOADING_RADIUS) {
            this.ne?.buildTreeModel(position, q);
            this.se?.buildTreeModel(position, q);
            this.sw?.buildTreeModel(position, q);
            this.nw?.buildTreeModel(position, q);
        } else {
            //append geometry of current node
            this.nodeToModel(q);
        }

    }

    private tileToQuery(position: { x: number; y: number; z: number; }, q: TreeQuery) {
        this.tileLoaded = true;
        const pch = {
            name: this.url!,
            size: this.size,
            model: {
                array: new Float32Array(this.cachcedSpaceRequired),
                filled: 0,
            }
        };
        this.buildLeafModel(position, pch.model);
        q.tilesToLoad.push(pch);
    }

    private buildLeafModel(position: { x: number; y: number; z: number; }, q: SubTreeQuery) {
        if (!this.isLeaf) {
            this.ne?.buildLeafModel(position, q);
            this.se?.buildLeafModel(position, q);
            this.sw?.buildLeafModel(position, q);
            this.nw?.buildLeafModel(position, q);
        } else {
            this.nodeToModel(q);
        }
    }

    private nodeToModel(q: SubTreeQuery) {
        if (!settings.visualizeTree || !q.array)
            return;

        q.array[q.filled++] = this.center.x;
        q.array[q.filled++] = this.center.y;
        q.array[q.filled++] = this.center.z + settings.zOffset;
        q.array[q.filled++] = this.dimensions.x;
        q.array[q.filled++] = this.dimensions.y;
        q.array[q.filled++] = this.dimensions.z;
        q.array[q.filled++] = this.color[0];
        q.array[q.filled++] = this.color[1];
        q.array[q.filled++] = this.color[2];
    }

    private computeDistances(position: { x: number; y: number; z: number; }) {
        const distSqr = Math.abs(position.x - this.center.x) ** (settings.DIST_FACTOR) + Math.abs(position.y - this.center.y) ** (settings.DIST_FACTOR) +  Math.abs(position.z - this.center.z) ** (settings.DIST_Z_FACTOR);
        const radiusSqr = Math.max(this.dimensions.x, this.dimensions.y) ** (settings.RAD_FACTOR);
        return { distSqr, radiusSqr };
    }

    private get isLeaf() {
        return !this.ne && !this.nw && !this.se && !this.sw;
    }

    spaceRequired() {
        let s = 0;

        if (this.isLeaf)
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