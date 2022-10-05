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
uniform float grayscale;


//light always shines from the top
vec3 light = vec3(0.0, 0.0, -1.0);

void main() {
    //pseudo-phong shading
    float diffuse = abs(dot(fsnormal, light));
    vec3 phcolor = fscolor * diffuse * 0.3 + fscolor * 0.7;
    
    float grs = phcolor.r * 0.2126 + phcolor.g * 0.7152 + phcolor.b * 0.0722;
	vec3 gcolor = vec3(grs, grs, grs);
	vec3 color = mix(phcolor, gcolor, grayscale);
	gl_FragColor = vec4(color, 1.0);
}`;


export class MeshMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                grayscale: { value: 1 },
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
            vertexColors: true,
        });
    }
}
