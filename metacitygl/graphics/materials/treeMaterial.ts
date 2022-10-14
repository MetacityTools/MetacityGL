import * as THREE from 'three';

const vs3D = `
attribute float dot;

attribute vec3 center;
attribute vec3 dimensions;

varying vec3 fscolor;
varying float fsdot;

void main(){
	fscolor = color / 255.0;
    fsdot = dot;
	vec3 transformed = position;
    transformed = transformed * dimensions + center;
	gl_Position = projectionMatrix * (modelViewMatrix * vec4(transformed, 1.0));
}`;

const fs3D = `
varying vec3 fscolor;
varying float fsdot;

uniform float grayscale;

void main() {
    //pseudo-phong shading
    vec3 phcolor = fscolor * fsdot * 0.2 + fscolor * 0.8;
    
    float grs = phcolor.r * 0.2126 + phcolor.g * 0.7152 + phcolor.b * 0.0722;
	vec3 gcolor = vec3(grs, grs, grs);
	vec3 color = mix(phcolor, gcolor, grayscale);
	gl_FragColor = vec4(color, 1.0);
}`;


export class TreeMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                grayscale: { value: 0 },
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
            vertexColors: true,
        });
    }
}
