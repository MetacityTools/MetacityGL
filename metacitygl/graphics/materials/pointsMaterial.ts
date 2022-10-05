import * as THREE from 'three';

const vs3D = `
varying vec3 fscolor;

uniform float size;
uniform float scale;

void main(){
	fscolor = color;
    fsnormal = normal;
	vec3 transformed = position;
    gl_PointSize = size * ( scale / - mvPosition.z );
	gl_Position = projectionMatrix * (modelViewMatrix * vec4(transformed, 1.0));
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
                grayscale: { value: 0 },
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
            vertexColors: true,
        });
    }
}
