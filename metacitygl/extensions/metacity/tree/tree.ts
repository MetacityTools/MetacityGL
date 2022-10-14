import { TreeQuery, SubTreeQuery, QuadrantData, TreeConfig } from "./types";
import * as Utils from "../../../utils"

interface QuadTreeProps {
    data: QuadrantData;
    bmin: [number, number];
    bmax: [number, number];
    color: [number, number, number];
    styles: Utils.Styles.Style[];
    aboveLoadingLevel?: boolean;
    config: TreeConfig;
}

export class QuadTree {
    min: { x: number, y: number, z: number };
    max: { x: number, y: number, z: number };
    center: { x: number, y: number, z: number };
    dimensions: { x: number, y: number, z: number };
    metadata: { [key: string]: number | string };
    color: number[];
    depth: number;
    aboveLoadingLevel: boolean;
    url?: string;
    size: number;

    tileLoaded = false;

    ne?: QuadTree;
    nw?: QuadTree;
    sw?: QuadTree;
    se?: QuadTree;

    LOADING_RADIUS: number = 300;
    REQEST_TILE_RADIUS: number = 280;
    DIST_FACTOR = 2.25;
    DIST_Z_FACTOR = 2;
    RAD_FACTOR = 2;

    cachcedSpaceRequired = 0;
    cachedDistSqr = 0;
    cachedRadiusSqr = 0;
    visualizeTree = true;
    zOffset = 0;


    constructor(props: QuadTreeProps, depth: number = 0) {
        const { data, bmin, bmax, color, styles } = props;
        this.aboveLoadingLevel = props.aboveLoadingLevel ?? true;

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
        this.metadata = data.metadata ?? {};
        this.metadata["height"] = this.dimensions.z;

        this.LOADING_RADIUS = (props.config.loadingRadius ?? this.LOADING_RADIUS) ** this.RAD_FACTOR;
        this.REQEST_TILE_RADIUS = (props.config.requestTileRadius ?? this.REQEST_TILE_RADIUS) ** this.RAD_FACTOR;
        this.DIST_FACTOR = props.config.distFactor ?? this.DIST_FACTOR;
        this.DIST_Z_FACTOR = props.config.distZFactor ?? this.DIST_Z_FACTOR;
        this.RAD_FACTOR = props.config.radFactor ?? this.RAD_FACTOR;
        this.visualizeTree = props.config.visualizeTree ?? this.visualizeTree;
        this.zOffset = props.config.zOffset ?? this.zOffset;

        this.applyStyles(styles);
        this.initChildren(props, data, depth);
        this.cachcedSpaceRequired = this.spaceRequired();
    }


    private initChildren(props: QuadTreeProps, data: QuadrantData, depth: number) {
        const childLoading = props.aboveLoadingLevel && this.url !== undefined;
        if (data.ne) {
            this.ne = new QuadTree({
                data: data.ne,
                bmin: [this.center.x, this.center.y],
                bmax: [this.max.x, this.max.y],
                color: props.color,
                styles: props.styles,
                aboveLoadingLevel: childLoading,
                config: props.config
            }, depth + 1);
        }

        if (data.se) {
            this.se = new QuadTree({
                data: data.se,
                bmin: [this.center.x, this.min.y],
                bmax: [this.max.x, this.center.y],
                color: props.color,
                styles: props.styles,
                aboveLoadingLevel: childLoading,
                config: props.config
            }, depth + 1);
        }

        if (data.sw) {
            this.sw = new QuadTree({
                data: data.sw,
                bmin: [this.min.x, this.min.y],
                bmax: [this.center.x, this.center.y],
                color: props.color,
                styles: props.styles,
                aboveLoadingLevel: childLoading,
                config: props.config
            }, depth + 1);
        }

        if (data.nw) {
            this.nw = new QuadTree({
                data: data.nw,
                bmin: [this.min.x, this.center.y],
                bmax: [this.center.x, this.max.y],
                color: props.color,
                styles: props.styles,
                aboveLoadingLevel: childLoading,
                config: props.config
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
        this.allChildrenModelLoaded(position, q);
        this.buildTreeModel(position, q);
    }

    private allChildrenModelLoaded(position: { x: number; y: number; z: number; }, q: TreeQuery) {
        if (this.tileLoaded) {
            return true;
        }

        const { distSqr, radiusSqr } = this.computeDistances(position);
        this.cachedRadiusSqr = radiusSqr;
        this.cachedDistSqr = distSqr;

        if (this.isLeaf && distSqr < radiusSqr * this.REQEST_TILE_RADIUS) {
            return true;
        }

        if (!this.isLeaf && distSqr < radiusSqr * this.REQEST_TILE_RADIUS) {
            const nw =  this.nw ? this.nw?.allChildrenModelLoaded(position, q) : true;
            const ne =  this.ne ? this.ne?.allChildrenModelLoaded(position, q) : true;
            const sw =  this.sw ? this.sw?.allChildrenModelLoaded(position, q) : true;
            const se =  this.se ? this.se?.allChildrenModelLoaded(position, q) : true;
            const countYes = (nw ? 1 : 0) + (ne ? 1 : 0) + (sw ? 1 : 0) + (se ? 1 : 0);

            if (countYes > 2)
            {
                if (this.url !== undefined) this.tileToQuery(position, q);
                return true;
            }

        }

        return false;
    }

    private buildTreeModel(position: { x: number; y: number; z: number; }, q: TreeQuery) {
        if (this.tileLoaded)
            return;

        const { distSqr, radiusSqr } = this.computeDistances(position);

        if (!this.isLeaf && distSqr < radiusSqr * this.LOADING_RADIUS) {
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
        if (!this.visualizeTree || !q.array)
            return;

        q.array[q.filled++] = this.center.x;
        q.array[q.filled++] = this.center.y;
        q.array[q.filled++] = this.center.z + this.zOffset;
        q.array[q.filled++] = this.dimensions.x;
        q.array[q.filled++] = this.dimensions.y;
        q.array[q.filled++] = this.dimensions.z;
        q.array[q.filled++] = this.color[0];
        q.array[q.filled++] = this.color[1];
        q.array[q.filled++] = this.color[2];
    }

    private computeDistances(position: { x: number; y: number; z: number; }) {
        const distSqr = Math.abs(position.x - this.center.x) ** (this.DIST_FACTOR) + Math.abs(position.y - this.center.y) ** (this.DIST_FACTOR) +  Math.abs(position.z - this.center.z) ** (this.DIST_Z_FACTOR);
        const radiusSqr = Math.max(this.max.x - this.min.x, this.max.y - this.min.y) ** (this.RAD_FACTOR);
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