// Toon shade the iso gem

varying vec3 vNormal;

vec4 transform(float u) {
	// Give different shades to 
	// sections of the model 
    if (u > 0.95)
        return vec4(0.5,0.5,1.0,1.0);
    else if (u > 0.5)
        return vec4(0.3,0.3,0.8,1.0);
    else if (u > 0.25)
        return vec4(0.2,0.2,0.4,1.0);
    else
        return vec4(0.1,0.1,0.2,1.0);
}
void main() {
    vec3 light = vec3(0.7, 0.7, 1.0);
    // normalize light vector
    light = normalize(light);
    float prod = max(0.0, dot(normalize(vNormal), light));
    gl_FragColor = transform(prod);
}