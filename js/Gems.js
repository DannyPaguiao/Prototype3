/**
 * Synchronously load contents of file
 * Returns contents as string
 * NOTE:
 *   NOT FOR USE IN PRODUCTION
 *   Use asynchronous loading in production.
 */
var loadFile = function(url) {
    var result = null;
    $.ajax({
           url: url,
           async: false
           }).done(function(data) {
                   result = data;
                   });
    return result;
};

/*
 * Helper functions to correctly place new gems
 * onto the board space
 */
var sphere_gem_to_world = function(position) {
    return {
        x : (110 * position.x),
        y : (100 * position.y),
        z : 0
    };
};

var iso_gem_to_world = function(position) {
    return {
        x : (110 * position.x),
        y : (100 * position.y),
        z : 0
    };
};

var goal_gem_to_world = function(position) {
    return {
        x : (100 * position.x),
        y : (100 * position.y),
        z : 0
    };
};

var cube_gem_to_world = function(position) {
    return {
        x : (110 * position.x),
        y : (100 * position.y),
        z : 0
    };
};

var diamond_gem_to_world = function(position) {
    return {
        x : (110 * position.x),
        y : (100 * position.y),
        z : 0
    };
};

/*
 * Constructor for Diamond Gems
 */
var diamondGem = function(position, scene){
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'diamond';
    var diamondVertexShaderText = loadFile('shaders/diamondVert.glsl');
    var diamondFragmentShaderText = loadFile('shaders/diamondFrag.glsl');
    
    var diamondMaterial = new THREE.ShaderMaterial({
                                              vertexShader: diamondVertexShaderText,
                                              fragmentShader: diamondFragmentShaderText
                                              });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/diamondGem.js', function(geometry) {
    	
    				if(that.figure !== 'empty'){
                    that.figure = new THREE.Mesh(geometry, diamondMaterial);
                    that.figure.scale.set(35, 35, 30);
                    /*
                    that.figure.rotation.x = 0.04;
                    that.figure.rotation.y = 0.05;
                    */
                    scene.add(that.figure);
                    that.figure.position = diamond_gem_to_world(position);
                   }
                    });
    			
}


/*
 * Constructor for Cube Gems
 */
var cubeGem = function(position, scene){
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'cubegem';
    var cubeVertexShaderText = loadFile('shaders/cubeVert.glsl');
    var cubeFragmentShaderText = loadFile('shaders/cubeFrag.glsl');
    
    var cubeMaterial = new THREE.ShaderMaterial({
                                              vertexShader:
                                                  cubeVertexShaderText,
                                              fragmentShader: cubeFragmentShaderText
                                              });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/cubeGem.js', function(geometry) {
    	
    			if(that.figure !== 'empty'){
                    that.figure = new THREE.Mesh(geometry, cubeMaterial);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.x = .04;
                    that.figure.rotation.y = .005;
                    
                    scene.add(that.figure);
                    that.figure.position = cube_gem_to_world(position);
                    
               }
    });
    
}

/*
 * Constructor for Sphere Gems
 */
var sphereGem = function(position, scene){
    var sphereVertexShaderText = loadFile('shaders/sphereVert.glsl');
    var sphereFragmentShaderText = loadFile('shaders/sphereFrag.glsl');
    
    var sphereMaterial = new THREE.ShaderMaterial({
                                              vertexShader: sphereVertexShaderText,
                                              fragmentShader: sphereFragmentShaderText
                                              });
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'spheregem';

    this.figure = null;
        
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/sphereGem.js', function(geometry) {
    			
    			if(that.figure !== 'empty'){
                    that.figure = new THREE.Mesh(geometry, sphereMaterial);
                    that.figure.scale.set(40, 40, 35);
                    /*
                    that.figure.rotation.x = .04;
                    that.figure.rotation.y = .005;
                    */
                    scene.add(that.figure);
                    that.figure.position = sphere_gem_to_world(position);
               }
    });
    
}


/*
 * Constructor for Isometric Gems
 */
var isoGem = function(position, scene){
    var that = this;
    this.isEmpty = false;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'isogem';
    var isoVertexShaderText = loadFile('shaders/isoVert.glsl');
    var isoFragmentShaderText = loadFile('shaders/isoFrag.glsl');
    
    var isoMaterial = new THREE.ShaderMaterial({
                                              vertexShader:
                                                  isoVertexShaderText,
                                              fragmentShader: isoFragmentShaderText
                                              });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/isoGem.js', function(geometry) {
    
    			if(that.figure !== 'empty'){
                    that.figure = new THREE.Mesh(geometry, isoMaterial);
                    that.figure.scale.set(40, 40, 40);
                    
                    that.figure.rotation.x = .04;
                    that.figure.rotation.y = .005;
                    
                    scene.add(that.figure);
                    that.figure.position = iso_gem_to_world(position);
                }    
    });
    
}


/*
 * Constructor for Goal Gem
 */
var goalGem = function(position, scene, material){
    var that = this;
    this.isEmpty = true;
    this.boardPosition = position || {
        x : 0,
        y : 0
    };
    this.type = 'goalgem';
    
    var perlinText = loadFile('shaders/perlin.glsl');
    var goalVertexShaderText = loadFile('shaders/goalVert.glsl');
    var goalFragmentShaderText = loadFile('shaders/goalFrag.glsl');

    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/isoGem.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, material);
                    that.figure.scale.set(40, 40, 40);
                    
                    that.figure.rotation.x = 40;
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    
                    scene.add(that.figure);
                    that.figure.position = goal_gem_to_world(position);
                    });
    
}

/*
 * Constructor for the next gem indicator
 */
var nextGem = function(scene, random){
    var that = this;
    this.randNum = random;
    
    this.type = 'nextgem';
    
    var diamondVertexShaderText = loadFile('shaders/diamondVert.glsl');
    var diamondFragmentShaderText = loadFile('shaders/diamondFrag.glsl');
    
    var diamondMaterial = new THREE.ShaderMaterial({
                                              vertexShader: diamondVertexShaderText,
                                              fragmentShader: diamondFragmentShaderText
                                              });
    
    var cubeVertexShaderText = loadFile('shaders/cubeVert.glsl');
    var cubeFragmentShaderText = loadFile('shaders/cubeFrag.glsl');
    
    var cubeMaterial = new THREE.ShaderMaterial({
                                              vertexShader:
                                                  cubeVertexShaderText,
                                              fragmentShader: cubeFragmentShaderText
                                              });
    
    var sphereVertexShaderText = loadFile('shaders/sphereVert.glsl');
    var sphereFragmentShaderText = loadFile('shaders/sphereFrag.glsl');
    
    var sphereMaterial = new THREE.ShaderMaterial({
                                              vertexShader: sphereVertexShaderText,
                                              fragmentShader: sphereFragmentShaderText
                                              });
                                              
    var isoVertexShaderText = loadFile('shaders/isoVert.glsl');
    var isoFragmentShaderText = loadFile('shaders/isoFrag.glsl');
    
    var isoMaterial = new THREE.ShaderMaterial({
                                              vertexShader:
                                                  isoVertexShaderText,
                                              fragmentShader: isoFragmentShaderText
                                              });
    this.figure = null;
    
    var jsonLoader = new THREE.JSONLoader();
    /*
     * Determine what the next gem 
     * that is going to be shot is going to be
     */
    if(this.randNum >= 0.0 && this.randNum <= 25.0){						
 	
 	// Display Diamond on Next Gem Indicator
    jsonLoader.load('models/diamondGem.js', function(geometry) {
    
    		
                    that.figure = new THREE.Mesh(geometry, diamondMaterial);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position.x = 850;
                    that.figure.position.y = -50;
                
    });
    }
    // Display Sphere Gem
     if(this.randNum > 25.0 && this.randNum <= 50.0){
    jsonLoader.load('models/sphereGem.js', function(geometry) {
    
    			
                  	that.figure = new THREE.Mesh(geometry, sphereMaterial);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position.x = 850;
                    that.figure.position.y = -50;
               
    });
    }
    // Display Isometric Gem
     if(this.randNum > 50.0 && this.randNum <= 75.0){
    jsonLoader.load('models/isoGem.js', function(geometry) {
    
    		
                    that.figure = new THREE.Mesh(geometry, isoMaterial);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.x = 40;
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position.x = 850;
                    that.figure.position.y = -50;
                
    });
    }
    
    // Display Cube Gem
     if(this.randNum > 75.0 && this.randNum <= 100.0){
    jsonLoader.load('models/cubeGem.js', function(geometry) {
    
    			
                    that.figure = new THREE.Mesh(geometry, cubeMaterial);
                    that.figure.scale.set(40, 40, 40);
                    that.figure.rotation.x = 10;
                    that.figure.rotation.y = 55;
                    that.figure.rotation.z = 100;
                    scene.add(that.figure);
                    that.figure.position.x = 750;
                    that.figure.position.y = -50;
                   
    });
    }
    
}
