import * as THREE from 'three';

const vs3D = `
varying vec3 fscolor;
varying vec3 fsnormal;

void main(){
	fscolor = color;
    fsnormal = normal;
	vec3 transformed = position;

	gl_Position = projectionMatrix * (modelViewMatrix * vec4(transformed, 1.0));
}`;

const fs3D = `
varying vec3 fscolor;
varying vec3 fsnormal;

//light always shines from the top
vec3 light = vec3(0.0, 0.0, 1.0);

void main() {
    //pseudo-phong shading
    float diffuse = max(dot(fsnormal, light), 0.0);
    vec3 color = fscolor * diffuse * 0.5 + fscolor * 0.5;
	gl_FragColor = vec4(color, 1.0);
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
