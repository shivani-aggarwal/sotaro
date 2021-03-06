const Sprite = require('./Sprite.js');

module.exports = class Wizard extends Sprite {
	constructor(img,speed=0, x=30, y=230, height=69, width=46, 
				xSpriteCoord=70, ySpriteCoord=17, scaledHeight=120, scaledWidth=80,
				yVelocity=0, maxHeight=100, minHeight=230,
				walkIndex=0, jumpIndex=0, attackIndex=0, deadIndex=0, hurt=false) {

		super(img, speed, x, y, height, width, 
			  xSpriteCoord, ySpriteCoord, scaledHeight, scaledWidth, yVelocity);
		this.maxHeight = maxHeight;
		this.minHeight = minHeight;
		this.walkIndex = walkIndex;
		this.jumpIndex = jumpIndex;
		this.attackIndex = attackIndex;
		this.deadIndex = deadIndex;
		this.hurt = false;
	}

	walk() {
		const walkingSprite = [
			{
				xSpriteCoord: 47,
				ySpriteCoord: 109,
				width: 39,
				height: 68
			},
			{
				xSpriteCoord: 127,
				ySpriteCoord: 106,
				width: 43,
				height: 69
			},
			{
				xSpriteCoord: 208,
				ySpriteCoord: 107,
				width: 45,
				height: 68
			},
			{
				xSpriteCoord: 287,
				ySpriteCoord: 105,
				width: 43,
				height: 69
			}
		];

		this.xSpriteCoord = walkingSprite[this.walkIndex].xSpriteCoord;
		this.ySpriteCoord = walkingSprite[this.walkIndex].ySpriteCoord;
		this.width = walkingSprite[this.walkIndex].width;
		this.height = walkingSprite[this.walkIndex].height;
		this.checkIfHurt();
		this.updateScaledValues();

		this.drawFrame();

		this.walkIndex++;
		if (this.walkIndex >= walkingSprite.length) {
			this.walkIndex = 0;
		}
	}

	jump() {

		let initalVelocity = -10;
		if (this.yVelocity !== 0) {
			initalVelocity = this.yVelocity;
		}

		const jumpingSprite = [
			{
				xSpriteCoord: 106,
				ySpriteCoord: 187,
				width: 44,
				height: 78,
				yVelocity: initalVelocity
			},
			{
				xSpriteCoord: 171,
				ySpriteCoord: 189,
				width: 43,
				height: 78,
				yVelocity: 10
			},
			{
				xSpriteCoord: 70,
				ySpriteCoord: 17,
				width: 46,
				height: 69,
				yVelocity: 0
			}
		]; 

		let doneJumping = false; 
	 
		if ( (this.y === this.maxHeight && this.yVelocity === -10) ) {
			this.jumpIndex = 1;
		}
		else if ( (this.y === this.minHeight && this.yVelocity === 10) || 
			      (this.y === this.minHeight && this.jumpIndex === 1) ) {
			this.jumpIndex = 2; 
		}

		this.xSpriteCoord = jumpingSprite[this.jumpIndex].xSpriteCoord;
		this.ySpriteCoord = jumpingSprite[this.jumpIndex].ySpriteCoord;
		this.width = jumpingSprite[this.jumpIndex].width;
		this.height = jumpingSprite[this.jumpIndex].height;
		this.checkIfHurt();
		this.updateScaledValues();

		this.yVelocity = jumpingSprite[this.jumpIndex].yVelocity;
		this.y += this.yVelocity;

		this.drawFrame();

		if (this.jumpIndex >= 2) {
			this.jumpIndex = 0;
			doneJumping = true;
			return doneJumping;
		}
	}

	attack() {

		const attackingSprite = [
			{
				xSpriteCoord: 83,
				ySpriteCoord: 551,
				width: 49,
				height: 70
			},
			{
				xSpriteCoord: 152,
				ySpriteCoord: 553,
				width: 59,
				height: 71
			},
			{
				xSpriteCoord: 232,
				ySpriteCoord: 554,
				width: 56,
				height: 70
			},
			{
				xSpriteCoord: 315,
				ySpriteCoord: 555,
				width: 49,
				height: 68
			},
			{
				xSpriteCoord: 385,
				ySpriteCoord: 556,
				width: 46,
				height: 69
			}
		];

		let startFireball = false;

		this.xSpriteCoord = attackingSprite[this.attackIndex].xSpriteCoord;
		this.ySpriteCoord = attackingSprite[this.attackIndex].ySpriteCoord;
		this.width = attackingSprite[this.attackIndex].width;
		this.height = attackingSprite[this.attackIndex].height;
 		if (this.y <= this.maxHeight || this.y >= this.minHeight) {
			this.yVelocity *= -1;
		}
		if (this.y === this.minHeight) {
			this.yVelocity = 0;
		}
		this.y += this.yVelocity;

		this.checkIfHurt();
		this.updateScaledValues();
		this.drawFrame();

		if (this.attackIndex === 1) {
			startFireball = true;
		}

		this.attackIndex++;
		if (this.attackIndex >= attackingSprite.length) {
			this.attackIndex = 0;
		}

		return startFireball;
	}

	checkIfHurt() {
		if (this.hurt) {
			this.xSpriteCoord = 42;
			this.ySpriteCoord = 201;
			this.width = 46;
			this.height = 63;
		}
	}

	dead() {
		let complete = false;
		const deadSprite = [
			{
				xSpriteCoord: 93,
				ySpriteCoord: 289,
				width: 45,
				height: 62
			},
			{
				xSpriteCoord: 147,
				ySpriteCoord: 315,
				width: 76,
				height: 34
			},
			{
				xSpriteCoord: 230,
				ySpriteCoord: 320,
				width: 75,
				height: 28
			}
		];

		if (this.deadIndex > 0) {
			this.y = 300;
		}

		this.xSpriteCoord = deadSprite[this.deadIndex].xSpriteCoord;
		this.ySpriteCoord = deadSprite[this.deadIndex].ySpriteCoord;
		this.width = deadSprite[this.deadIndex].width;
		this.height = deadSprite[this.deadIndex].height;
		this.updateScaledValues();

		this.drawFrame();

		this.deadIndex++;
		if (this.deadIndex >= deadSprite.length) {
			this.deadIndex = 0;
			complete = true;
		}

		return complete;
	}

}