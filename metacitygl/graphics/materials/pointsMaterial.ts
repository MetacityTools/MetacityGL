import * as THREE from 'three';

const vs3D = `
varying vec3 fscolor;

uniform vec3 modelColor;
uniform float size;
uniform float scale;

void main(){
	fscolor = modelColor;
	vec3 transformed = position;
	vec4 mvPosition = (modelViewMatrix * vec4(transformed, 1.0));
    gl_PointSize = size * scale / -mvPosition.z;
	gl_Position = projectionMatrix * mvPosition;
}`;

const fs3D = `
varying vec3 fscolor;
uniform float grayscale;

void main() {
    float grs = fscolor.r * 0.2126 + fscolor.g * 0.7152 + fscolor.b * 0.0722;
	vec3 gcolor = vec3(grs, grs, grs);
	vec3 color = mix(fscolor, gcolor, grayscale);
	gl_FragColor = vec4(color, 1.0);
}`;


export class PointsMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                size: { value: 10 },
                scale: { value: 1000 },
                grayscale: { value: 0 },
                modelColor: { value: [1, 1, 1] },
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
        });
    }
}
