import * as THREE from 'three';

const vs3D = `
varying vec3 fscolor;
attribute vec3 instanceShift;

uniform vec3 modelColor;
uniform float size;

void main(){
	fscolor = modelColor;

    vec3 CameraRight_worldspace = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
    vec3 CameraUp_worldspace = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);
    vec3 transformed = instanceShift + (CameraRight_worldspace * position.x + CameraUp_worldspace * position.y) * size;

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
                size: { value: 10 },
                grayscale: { value: 0 },
                modelColor: { value: [1, 1, 1] },
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
        });
    }
}
