import * as THREE from 'three';

const vs3D = `
attribute vec3 instanceShift;
attribute float dot;

uniform vec3 modelColor;

varying vec3 fscolor;
varying float fsdot;

void main(){
	fscolor = modelColor / 255.0;
    fsdot = dot;
	vec3 transformed = position + instanceShift;
	gl_Position = projectionMatrix * (modelViewMatrix * vec4(transformed, 1.0));
}`;

const fs3D = `

uniform float grayscale;

varying vec3 fscolor;
varying float fsdot;

void main() {
    //pseudo-phong shading
    vec3 phcolor = fscolor * fsdot * 0.2 + fscolor * 0.8;
    
    float grs = phcolor.r * 0.2126 + phcolor.g * 0.7152 + phcolor.b * 0.0722;
	vec3 gcolor = vec3(grs, grs, grs);
	vec3 color = mix(phcolor, gcolor, grayscale);
	gl_FragColor = vec4(color, 1.0);
}`;


export class InstancedMeshMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                grayscale: { value: 0 },
                modelColor: { value: [255, 255, 255] },
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
        });
    }
}
