import * as THREE from 'three';

const vs3D = `
varying vec3 fscolor;

void main(){
	fscolor = color;
	vec3 transformed = position;

	gl_Position = projectionMatrix * (modelViewMatrix * vec4( transformed, 1.0));
}`;

const fs3D = `
varying vec3 fscolor;

void main() {
	gl_FragColor = vec4(fscolor, 1.0);
}`;


export class MeshMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
            vertexColors: true,
        });
    }
}
