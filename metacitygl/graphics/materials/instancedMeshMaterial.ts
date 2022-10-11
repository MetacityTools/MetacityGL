import * as THREE from 'three';

const vs3D = `
varying vec3 fscolor;
varying vec3 fsnormal;

attribute vec3 instanceShift;

uniform vec3 modelColor;

void main(){
	fscolor = modelColor;
    fsnormal = normal;
	vec3 transformed = position + instanceShift;
	gl_Position = projectionMatrix * (modelViewMatrix * vec4(transformed, 1.0));
}`;

const fs3D = `
varying vec3 fscolor;
varying vec3 fsnormal;
uniform float grayscale;


//light always shines from the top
vec3 light = vec3(0.0, 0.0, -1.0);

void main() {
    //pseudo-phong shading
    float diffuse = abs(dot(fsnormal, light));
    vec3 phcolor = fscolor * diffuse * 0.2 + fscolor * 0.8;
    
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
                modelColor: { value: [1, 1, 1] },
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
        });
    }
}
