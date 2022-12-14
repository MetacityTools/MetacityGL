import * as THREE from 'three';

const vs3D = `
attribute vec3 idcolor;
attribute vec3 lineStart;
attribute vec3 lineEnd;

uniform float thickness;
uniform float space;

varying vec3 fscolor;

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
	fscolor = idcolor;
	vec3 transformed = position;
	
    vec3 dir = lineEnd - lineStart;
    float dist = length(dir);
    mat4 rot = getRotationMat(dir);
	float end = float(transformed.x >= 0.9);
	
	transformed.x = end * (dist + (transformed.x - 1.0) * thickness) + ((1.0 - end) * transformed.x * thickness); //subtract one because its the original length of the template line
	
	//offset in -y direction
	transformed.y *= thickness;
	transformed.y -= space;
	transformed = lineStart + (rot * vec4(transformed, 1.0)).xyz;
	
	gl_Position = projectionMatrix * (modelViewMatrix * vec4( transformed, 1.0));
}`;

const fs3D = `
varying vec3 fscolor;

void main() {
	gl_FragColor = vec4(fscolor, 1.0);
}`;


export class DoubleLinePickMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                thickness: { value: 20 },
				space: { value: 2 }
            },
            vertexShader: vs3D,
            fragmentShader: fs3D,
            side: THREE.DoubleSide,
        });
    }
}
