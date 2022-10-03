import * as THREE from 'three';


const vs3D = `
attribute vec3 color;
attribute vec3 positionStart;
attribute vec3 positionEnd;
attribute vec3 dimensions;
attribute float visible;

uniform float time;
uniform float timeStart;
uniform float timeEnd;
uniform float shift;

varying vec3 fscolor;
varying vec3 fsnormal;

/**
 * Create rotation matrix from field vector.
 * The returned matrix can rotate vector (1, 0, 0)
 * into the desired setup.
 */
mat4 getRotationMat(vec3 vector)
{
	vec3 unit = vec3(1, 0, 0);
	vec3 f = normalize(vector);
	vec3 cross = cross(f, unit);
	vec3 a = normalize(cross);
	float s = length(cross);

	if (s == 0.0)
	{
		if (f.x == -1.0)
			return mat4(-1.0, 0.0, 0.0, 0.0,
						0.0, -1.0, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.0, 0.0, 0.0, 1.0);
		return mat4(1.0);
	}


	float c = dot(f, unit);
	float oc = 1.0 - c;
	return mat4(oc * a.x * a.x + c,        oc * a.x * a.y - a.z * s,  oc * a.z * a.x + a.y * s,  0.0,
                oc * a.x * a.y + a.z * s,  oc * a.y * a.y + c,        oc * a.y * a.z - a.x * s,  0.0,
                oc * a.z * a.x - a.y * s,  oc * a.y * a.z + a.x * s,  oc * a.z * a.z + c,        0.0,
                0.0,                       0.0,                       0.0,                       1.0);
}


void main(){
	fscolor = color;
	fsnormal = normal;
	vec3 transformed = position;
	
	if (time < timeStart || time > timeEnd) {
		gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
		return;
	}

	if (visible < 0.5) {
		gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
		return;
	}

	transformed = transformed * dimensions;

    vec3 dir = positionEnd - positionStart;
	if (length(dir) > 0.0) {
		vec3 ndir = normalize(dir);
		transformed += vec3(0.0, -shift, 0.0);
		transformed = (getRotationMat(ndir) * vec4(transformed, 1.0)).xyz;
	}
    float t = (time - timeStart) / (timeEnd - timeStart);
    transformed += positionStart + t * dir;
	
	gl_Position = projectionMatrix * (modelViewMatrix * vec4(transformed, 1.0));
}`;

const fs3D = `
varying vec3 fscolor;
varying vec3 fsnormal;
uniform float grayscale;

//light from the top
vec3 light = vec3(0.0, 0.0, 1.0);

void main() {
	//pseudo-phong shading
    float diffuse = max(dot(fsnormal, light), 0.0);
    vec3 phcolor = fscolor * diffuse * 0.1 + fscolor * 0.9;

	float grs = phcolor.r * 0.2126 + phcolor.g * 0.7152 + phcolor.b * 0.0722;
	vec3 gcolor = vec3(grs, grs, grs);
	vec3 color = mix(phcolor, gcolor, grayscale);
	gl_FragColor = vec4(color, 1.0);
}`;



export class AgentMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                time: { value: 0 },
                timeStart: { value: 0 },
                timeEnd: { value: 1 },
                shift: { value: 0 },
				grayscale: { value: 1 },
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
            transparent: false
        });
    }
}