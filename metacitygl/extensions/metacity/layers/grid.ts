import * as MetacityGL from "../../../metacitygl";
import { LayerProps } from "../props";
import { Layer, LayoutMetacityTile } from "./base";



interface MetacityLayout {
    tileWidth: number;
    tileHeight: number;
    tiles: LayoutMetacityTile[];
}

type vec3 = MetacityGL.Utils.Types.vec3;

export class GridLayer extends Layer {
    layout?: MetacityLayout;

    constructor(props: LayerProps) {
        super(props);
    }

    setup() {
        console.log(this.layout);

        if (!this.context)
            return;


        this.initPlaceholders();
        this.context.onNavChange = (t, p) => this.loadTiles(t, p);
        this.loadTiles(this.context.navigation.target, this.context.navigation.position);
    }

    initPlaceholders() {
        if (!this.layout) return;
        if (!this.context)
        return;

        const c = MetacityGL.Utils.Color.colorHexToArr(this.colorPlaceholder);
        for (let tile of this.layout.tiles) {
            const cOff = (Math.random() - 1.0) * 15;
            const placeholder = MetacityGL.Graphics.Models.TileModel.create({
                center: [(tile.x + 0.5) * this.layout.tileWidth, (tile.y + 0.5) * this.layout.tileHeight, 0],
                width: this.layout.tileWidth * 0.95,
                height: this.layout.tileHeight * 0.95,
                color: [c[0] + cOff, c[1] + cOff, c[2] + cOff],
            });
            tile.placeholder = placeholder;
            this.context.add(placeholder);
        }
    }

    loadTiles(target: vec3, position: vec3) {
        if (!this.layout) return;

        const dx = this.layout.tileWidth * 0.5;
        const dy = this.layout.tileHeight * 0.5;
        this.layout.tiles.forEach((tile) => {
            const d = GridLayer.dist(tile.x * this.layout!.tileWidth + dx, tile.y * this.layout!.tileHeight + dy, target.x, target.y);
            if (d < this.radius && !tile.loaded) {
                this.loadTile(tile);
            }
        });
    }

    static dist(xa: number, ya: number, xb: number, yb: number) {
        return Math.sqrt(Math.pow(xa - xb, 2) + Math.pow(ya - yb, 2));
    }
}