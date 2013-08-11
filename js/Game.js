var Game = function() {
	// A Game object is the highest level object representing entire game
};

Game.prototype.init = function() {
	this.scene = new THREE.Scene();
	var that = this;
	this.boardSize = 9;
	this.offset = 4;
	this.facing = 'up';

	this.virtualBoard = new Array(this.boardSize);
	for (var i = 0; i < this.boardSize; i++) {
		this.virtualBoard[i] = [];
		for (var j = 0; j < this.boardSize; j++) {
			this.virtualBoard[i].push({});
		}

	}

	/* 0 = Empty Space
	 * 1 = Cube Gem
	 * 2 = Diamond Gem
	 * 3 = Sphere Gem
	 * 4 = Isometric Gem
	 */

	this.startingBoard = [['1', '1', '1', '1', '1', '1', '1', '1', '1'], ['1', '0', '0', '0', '0', '0', '0', '0', '1'], ['1', '0', '0', '0', '0', '0', '0', '0', '1'], ['1', '0', '0', '0', '0', '0', '0', '0', '1'], ['1', '0', '0', '0', '0', '0', '0', '0', '1'], ['1', '0', '0', '0', '0', '0', '0', '0', '1'], ['1', '0', '0', '0', '0', '0', '0', '0', '1'], ['1', '0', '0', '0', '0', '0', '0', '0', '1'], ['1', '1', '1', '1', '1', '1', '1', '1', '1']];

	for (var x = 0; x < this.boardSize; x++) {
		for (var y = 0; y < this.boardSize; y++) {

			// If there is a 0 in startingBoard set the slot's isEmpty property to true'
			if (this.startingBoard[y][x] == '0') {
				// For every slot in the board create an object Slot
				this.virtualBoard[y][x].isEmpty = true;
			}

			// If there is a 1 in startingBoard create a barrier object
			if (this.startingBoard[y][x] == '1') {
				this.virtualBoard[y][x] = new cubeGem({
					x : (x - this.offset),
					y : -(y - this.offset)
				}, this.scene);
			}

			// If there is a 2 in startingBoard create a gem object
			if (this.startingBoard[y][x] == '2') {
				this.virtualBoard[y][x] = new diamondGem({
					x : (x - this.offset),
					y : -(y - this.offset)
				}, this.scene);
			}

			if (this.startingBoard[y][x] == '3') {
				this.virtualBoard[y][x] = new sphereGem({
					x : (x - this.offset),
					y : -(y - this.offset)
				}, this.scene);
			}

			if (this.startingBoard[y][x] == '4') {
				this.virtualBoard[y][x] = new isoGem({
					x : (x - this.offset),
					y : -(y - this.offset)
				}, this.scene);
			}
		}
	}

	this.robot = new Robot({
		x : -2,
		y : -3
	}, this.scene);
	// create a new robot

	this.camera = new THREE.PerspectiveCamera(75, 4.0 / 3.0, 1, 10000);
	this.camera.position.z = 800;

	for (var x = 0; x < this.boardSize; x++) {
		for (var y = 0; y < this.boardSize; y++) {

			if (this.startingBoard[x][y] == '1' || this.startingBoard[x][y] == '2') {
				that.scene.add(this.virtualBoard[x][y].object);
			}
		}
	}



	this.scene.add(this.robot.object);
	// add robot to scene

	// Spotlight
	var spotlight = new THREE.PointLight(0xffffff, 1, 1000);
	spotlight.position.set(0, -100, 400);
	this.scene.add(spotlight);
	// Ambient light
	var ambient_light = new THREE.AmbientLight(0x202020);
	this.scene.add(ambient_light);
	// Background plane
	var bgplane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 900), new THREE.MeshLambertMaterial());
	bgplane.translateZ(-100);
	this.scene.add(bgplane);

	this.renderer = new THREE.WebGLRenderer({
		antialias : true
	});
	this.renderer.setSize(800, 600);
	this.renderer.setClearColor(0xeeeeee, 1.0);
	document.body.appendChild(this.renderer.domElement);

	// Setup keyboard events
	this.keys = {};
	$('body').keydown(function(e) {
		if (e.which) {
			if (that.keys[e.which] !== 'triggered') {
				that.keys[e.which] = true;
			}
		}
	});
	$('body').keyup(function(e) {
		if (e.which) {
			that.keys[e.which] = false;
		}
	});
};

Game.prototype.render = function(t) {
	// Bob the camera a bit
	this.camera.position.x = 0;
	this.camera.position.y = -400;
	this.camera.lookAt(this.scene.position);
	this.renderer.render(this.scene, this.camera);
};

Game.prototype.legalMove = function(position) {
	/* True = allows movement
	 * False = hinders movement
	 *
	 * Check if desired position is off of the edge of the board horizontally
	 */
	if (position.x < -this.offset || position.x > this.offset) {
		return false;
	}
	// Check if desired position is off of the edge of the board horizontally
	if (position.y < -this.offset || position.y > this.offset) {
		return false;
	}
	// Check if desired position is filled with an object
	if (this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty) {
		return true;
	} else {
		return false;
	}
	return true;
};

// Function for creating a gem
Game.prototype.createGem = function(position) {

	if (this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty) {

		// Calculate a random number between 0-100 to determine what gem you are shooting next
		//var randNum = Math.floor(Math.random() * (101));
		var newPosition = {
			x : position.x,
			y : position.y
		};

		// If the random number is between 0 and 20 create a Diamond
		//if(randNum >= 0.0 && randNum <= 20.0){
		this.virtualBoard[-position.y + this.offset][position.x + this.offset] = new diamondGem(position, this.scene);
	/*	  }
		 // If the random number is between 20 and 40 create a Sphere
		 if(randNum > 20.0 && randNum <= 40.0){
		 this.virtualBoard[-position.y + this.offset][position.x + this.offset]= new sphereGem(position, this.scene);
		 }
		 // If the random number is between 40 and 60 create an Isometric Gem
		 if(randNum > 40.0 && randNum <= 60.0){
		 this.virtualBoard[-position.y + this.offset][position.x + this.offset]= new isoGem(position, this.scene);
		 }
		 // If the random number is between 60 and 100 create a Cube Gem
		 if(randNum > 60.0 && randNum <= 100.0){
		 this.virtualBoard[-position.y + this.offset][position.x + this.offset]= new cubeGem(position, this.scene);
		 }
		 */
		
		this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty = false;
		//this.scene.remove(this.virtualBoard[-position.y + this.offset][position.x + this.offset]);
		//this.scene.add(this.virtualBoard[-position.y + this.offset][position.x + this.offset].object);
		this.checkRow(position);

	}

};

Game.prototype.legalPosition = function(position) {
	// returns true or false if the move is within the board's limits
	if (position.x < -this.offset || position.x > this.offset) {
		return false;
	}
	// Check if desired position is off of the edge of the board horizontally
	if (position.y < -this.offset || position.y > this.offset) {
		return false;
	}
	return true;
};

Game.prototype.isEmptySquare = function(position) {
	// returns true or false if input position is empty

	if (this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty) {
		return true;
	} else {
		return false;
	}
};

Game.prototype.checkType = function(position){
	// Check what type the object in the given position is
	// return a number depending on the type of object it is
	//console.log(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type)
	if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type == 'diamond'){
		return 1;
	}
	if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type == 'cubegem'){
		return 2;
	}
	if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type == 'spheregem'){
		return 3;
	}
	if(this.virtualBoard[-position.y + this.offset][position.x + this.offset].type == 'isogem'){
		return 4;
	}
	return 0;
	
	
};
Game.prototype.threeRow = function(position) {
	// Check if there is three in a row of a gem from the given position going to the right
	// Returns true or false
	// If off the board return false
/*
	var pos = {
		x : position.x,
		y : position.y
	};

	var newPosition = {
		x : position.x + 1,
		y : position.y
	};
	var newPosition2 = {
		x : position.x + 2,
		y : position.y
	};
	*/

	if (this.legalPosition(position) && this.legalPosition({x: position.x + 1, y: position.y}) && this.legalPosition({x: position.x + 2, y: position.y})) {
		if((this.checkType(position) == 1) && (this.checkType({x: position.x + 1, y: position.y}) == 1) && (this.checkType({x:position.x + 2, y: position.y}) == 1)){
			console.log(this.checkType(position));
			return true;
		}
		if((this.checkType(position) == 2) && (this.checkType({x: position.x + 1, y: position.y}) == 2) && (this.checkType({x:position.x + 2, y: position.y}) == 2)){
			return true;
		}
		if((this.checkType(position) == 3) && (this.checkType({x: position.x + 1, y: position.y}) == 3) && (this.checkType({x:position.x + 2, y: position.y}) == 3)){
			return true;
		}
		if((this.checkType(position) == 4) && (this.checkType({x: position.x + 1, y: position.y}) == 4) && (this.checkType({x:position.x + 2, y: position.y}) == 4)){
			return true;
		}	
		if((this.checkType(position) == 0) && (this.checkType({x: position.x + 1, y: position.y}) == 0) && (this.checkType({x:position.x + 2, y: position.y}) == 0)){
			return false;
		}
	}

	
	return false;

};
Game.prototype.checkRow = function(position) {
	// Check a row for sets of three gems of the same type in a row
	// For every 3 gems found on a row in this row delete them

	var that = this;
		var newPosition = {
			x : position.x,
			y : position.y

		};

		//console.log(this.virtualBoard[-position.y + this.offset][position.x + this.offset]);
		if (this.threeRow(newPosition)) {
			console.log(this.threeRow(newPosition));
			//console.log(this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset]);
			this.virtualBoard[-position.y + this.offset][position.x + this.offset].isEmpty = true;
			this.virtualBoard[-position.y + this.offset][(position.x + 1) + this.offset].isEmpty = true;
			this.virtualBoard[-position.y + this.offset][(position.x + 2) + this.offset].isEmpty = true;
			
			//this.virtualBoard[-position.y + this.offset][position.x + this.offset].destroyGem();
			//console.log(this.virtualBoard[newPosition.y + this.offset][newPosition.x + this.offset])
			
			
			//var killObj = this.virtualBoard[-position.y + this.offset][position.x + this.offset]; 
			//this.scene.remove(killObj);
			
			this.scene.remove(this.virtualBoard[-position.y + this.offset][position.x + this.offset].figure);

/*
			this.destroyGem(newPosition);
			this.destroyGem(newPosition2);
			this.destroyGem(newPosition3);
*/
		}

	

};

Game.prototype.destroyGem = function(position) {
	var newPosition = {
		x : position.x,
		y : position.y
	};
	this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset].isEmpty == true;
	//console.log(this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset])
	this.scene.remove(this.virtualBoard[-newPosition.y + this.offset][newPosition.x + this.offset].object);

};

// Function returns # of free spaces to the right
Game.prototype.countSpacesRight = function(position) {
	var spaces = 0;
	var newPosition = {
		x : position.x + 1,
		y : position.y
	};
	if (!this.legalPosition(position)) {
		return 0;
	}
	while (this.isEmptySquare(newPosition)) {

		newPosition.x++;
		spaces++;
	}

	return spaces;
};

Game.prototype.countSpacesLeft = function(position) {
	var spaces = 0;
	var newPosition = {
		x : position.x - 1,
		y : position.y
	};
	if (!this.legalPosition(position)) {
		return 0;
	}
	while (this.isEmptySquare(newPosition)) {

		newPosition.x--;
		spaces++;
	}

	return spaces;
};

Game.prototype.countSpacesUp = function(position) {
	var spaces = 0;
	var newPosition = {
		x : position.x,
		y : position.y + 1
	};
	if (!this.legalPosition(position)) {
		return 0;
	}
	while (this.isEmptySquare(newPosition)) {

		newPosition.y++;
		spaces++;
	}

	return spaces;
};

Game.prototype.countSpacesDown = function(position) {
	var spaces = 0;
	var newPosition = {
		x : position.x,
		y : position.y - 1
	};
	if (!this.legalPosition(position)) {
		return 0;
	}
	while (this.isEmptySquare(newPosition)) {

		newPosition.y--;
		spaces++;
	}

	return spaces;
};

// Function that counts the free spaces in a direction
Game.prototype.countSpaces = function(position, direction) {
	var spaces = 0;

	if (direction == 'right') {

		return this.countSpacesRight(position);
	}
	if (direction == 'up') {

		return this.countSpacesUp(position);
	}
	if (direction == 'left') {

		return this.countSpacesLeft(position);
	}
	if (direction == 'down') {

		return this.countSpacesDown(position);
	}
	return spaces;
};

Game.prototype.handleInput = function() {

	// Left (A Key)
	if (this.keys[65] === true) {
		this.keys[65] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x - 1,
			y : this.robot.boardPosition.y
		};
		// check neighbors if there's a block
		if (this.legalMove(newPosition)) {
			this.robot.moveTo(newPosition);

		}
	}
	// Right (D key)
	if (this.keys[68] === true) {
		this.keys[68] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x + 1,
			y : this.robot.boardPosition.y
		};
		if (this.legalMove(newPosition)) {
			this.robot.moveTo(newPosition);
		}
	}
	// Up (W key)
	if (this.keys[87] === true) {
		this.keys[87] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x,
			y : this.robot.boardPosition.y + 1
		};
		if (this.legalMove(newPosition)) {
			this.robot.moveTo(newPosition);
		}
	}
	// Down (S key)
	if (this.keys[83] === true) {
		this.keys[83] = 'triggered';
		var newPosition = {
			x : this.robot.boardPosition.x,
			y : this.robot.boardPosition.y - 1
		};
		if (this.legalMove(newPosition)) {
			this.robot.moveTo(newPosition);
		}
	}
	// Spacebar
	if (this.keys[32] === true) {
		this.keys[32] = 'triggered';
		that = this;

		// determine what direction character is facing
		
		var newPosition = {
			x : this.robot.boardPosition.x,
			y : this.robot.boardPosition.y
		};
		if (this.facing == 'right') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.x += moveSpaces;

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					//console.log(newPosition);
					this.createGem(newPosition);

				}
			}
		}

		if (this.facing == 'up') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.y += moveSpaces;
			//console.log(moveSpaces);

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					this.createGem(newPosition);

				}
			}
		}
		if (this.facing == 'left') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.x -= moveSpaces;
			//console.log(moveSpaces);

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					this.createGem(newPosition);

				}
			}

		}
		if (this.facing == 'down') {
			var moveSpaces = this.countSpaces(newPosition, this.facing);
			newPosition.y -= moveSpaces;
			//console.log(moveSpaces);

			if (!moveSpaces == 0) {
				if (this.legalPosition(newPosition)) {
					this.createGem(newPosition);

				}
			}

		}

	}

	// Inputs for determining where the character is facing
	// Up arrow key
	if (this.keys[38] === true) {
		this.keys[38] = 'triggered';

		this.facing = 'up';
	}
	// Left arrow key
	if (this.keys[37] === true) {
		this.keys[37] = 'triggered';

		this.facing = 'left';
	}
	// Down arrow key
	if (this.keys[40] === true) {
		this.keys[40] = 'triggered';

		this.facing = 'down';
	}
	// Right arrow key
	if (this.keys[39] === true) {
		this.keys[39] = 'triggered';

		this.facing = 'right';
	}

};

Game.prototype.start = function() {
	var that = this;
	var time0 = new Date().getTime();
	// milliseconds since 1970
	var loop = function() {
		var time = new Date().getTime();
		// Render visual frame
		that.render(time - time0);
		// Respond to user input
		that.handleInput();
		// Loop
		requestAnimationFrame(loop, that.renderer.domElement);
	};
	loop();
}; 