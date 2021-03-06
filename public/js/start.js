const graphics = require('./graphics.js');
const endGame = require('./endscreen.js');
const Sprite = require('./classes/Sprite.js');
const Wizard = require('./classes/Wizard.js');

function randomValue(max, min) {
	return Math.floor(Math.random()*(max-min+1)) + min;
};

function didMakeContact(object, item) {
	let rect1 = {
		right: object.x + object.scaledWidth,
		left: object.x,
		top: object.y,
		bottom: object.y + object.scaledHeight
	};
	let rect2 = {
		right: item.x + item.scaledWidth,
		left: itemLeft = item.x,
		top: item.y,
		bottom: item.y + item.scaledHeight
	};
		
	let contact = !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);

	return contact;
};

module.exports = function() {
	let backgroundImages = [
		new Sprite('../assets/backTrees.png',0),
		new Sprite('../assets/forestLights.png',1),
		new Sprite('../assets/middleTrees.png',2),
		new Sprite('../assets/frontTrees.png',3)
	];
	let heart = new Sprite('../assets/heart.png', 0, 90, 27, 541, 600, 47, 87, 18, 20.4);
	let wizard = new Wizard('../assets/sotaroSprite.png');

	let score = 0;
	let lives = 3;
	let fireballs = [];
	let enemies = [];
	let enemySpeed = -7;
	enemies.push(new Sprite('../assets/enemies.png', enemySpeed, 650, randomValue(260,130), 46, 55, 5, 771, 64, 77, 0));
	enemies[0].attackedWizard = false;

	let frameCount = 0;
	let attackCount = 0;
	let enemyFrameCount = 0;

	let doneJumping = true;
	let isJumping = false;
	let isAttacking = false;
	let startFireball = false;
	let fireballMoving = false;
	let gameOver = false;
	let showEndScreen = false;

	function jumpAnimation() { 
		const jumpHeight = 100;
		if (!isAttacking && !doneJumping) {
			doneJumping = wizard.jump();
			if (doneJumping) {
				isJumping = false;
				wizard.maxHeight = jumpHeight;
			}
			frameCount = 0;
		}
	}

	function attackAnimation() {
		const attackCycleCount = 5;
		attackCount++;
		startFireball = wizard.attack();
		if (attackCount >= attackCycleCount) {
			isAttacking = false;
			attackCount = 0;
			if (wizard.y < wizard.minHeight) {
				wizard.maxHeight = wizard.y;
			}
		}
		frameCount = 0;
	}

	function fireballAnimation(fireballArray) {
		fireballArray = fireballArray.filter((fireball) => {
			fireball.updateScaledValues();
			if (fireball.speed !== null) {
				fireball.drawFrame();
			};
			fireball.x += fireball.speed;
			if (fireball.x >= canvas.width + 26) {
				fireball.speed = null;
			}
			else {
				enemies = enemies.filter((enemy) => {
					if (fireball.speed !== null) {
						if (didMakeContact(fireball, enemy)) {
							enemy.speed = null;
							fireball.speed = null;
							if (enemy.x < canvas.width) {
							 	score++;
							} 
						}
					}
					return enemy.speed !== null;
				}); 
			}
			return fireball.speed !== null;
		});

		if (fireballArray.length < 1) {
			fireballMoving = false;
		}

	}

	function drawEnemies() {
		const maxYPos = 130;
		const minYPos = 260;
		const enemyFrameThreshold = 75;
		
		wizard.hurt = false;	
		enemyFrameCount++;

		if (enemyFrameCount > enemyFrameThreshold) {
			let yPos = randomValue(maxYPos, minYPos);
			let enemy = new Sprite('../assets/enemies.png', enemySpeed, 650, yPos, 46, 55, 5, 771, 64, 77, 0);
			enemy.attackedWizard = false;
			enemies.push(enemy); 
			let newYPos = randomValue(maxYPos, minYPos);
			if (randomValue(2,1) === 2) {
				while (Math.abs(yPos - newYPos) <= enemies[0].scaledHeight) {
					newYPos = randomValue(maxYPos, minYPos);
				}
				newEnemy = new Sprite('../assets/enemies.png', enemySpeed, 830, newYPos, 46, 55, 5, 771, 64, 77, 0);
				newEnemy.attackedWizard = false;
				enemies.push(newEnemy); 
			}
			enemyFrameCount = 0;
		}

		enemies = enemies.filter((enemy) => {
			enemy.drawFrame();
			enemy.x += enemy.speed;
			enemySpeed += -0.0003;
			
			if (didMakeContact(enemy, wizard)) {
				wizard.hurt = true;
				if (enemy.attackedWizard === false) {
					(lives > 1) ? lives-- : (lives--, gameOver=true);
				}
				enemy.attackedWizard = true;
			}

			if ((enemy.x + enemy.scaledWidth) < 0) {
				enemy.speed = null;
			}
			return enemy.speed !== null;
		});
	}

	function drawUI() {
		const jumpFrameThreshold = 1;
		const attackFrameThreshold = 3;

		frameCount++;
		let frameThreshold = 60/backgroundImages[3].speed;

		context.clearRect(0,0, canvas.width, canvas.height);

		graphics.drawBackground(backgroundImages);
		wizard.drawFrame();
		graphics.drawInGameInfo(score, lives, heart);
		drawEnemies();

		if (gameOver && wizard.y >= 230 && frameCount > 10) {
			frameCount = 0;
			showEndScreen = wizard.dead();
		}
		else {
			if (startFireball && !gameOver) {
				startFireball = false;
				fireballMoving = true;
				let x = wizard.x + wizard.width + 45;
				let y = wizard.y + 54;
				fireballs.push(new Sprite('../assets/sotaroSprite.png', 10, x, y, 17, 26, 482, 584));
				fireballAnimation(fireballs); 
			}
			else if (fireballMoving) {
				fireballAnimation(fireballs);
			}

			if (isAttacking && frameCount > attackFrameThreshold) {
				attackAnimation();
			}
			else if (isJumping && frameCount > jumpFrameThreshold) {
				jumpAnimation();
			}
		    else if (frameCount > frameThreshold) {
				wizard.walk();
				frameCount = 0;
			}
		}

		if (showEndScreen) {
			graphics.drawBackground(backgroundImages);
			wizard.drawFrame();
			graphics.drawInGameInfo(score, lives, heart);
			drawEnemies();
			endGame(score);
		}
		else {
			window.requestAnimationFrame(drawUI);
		}
	}

	window.addEventListener('keydown', (event) => {
		const spaceKey = 32;
		const aKey = 65;

		if (event.keyCode === spaceKey) {
			event.preventDefault();
			isJumping = true;
			doneJumping = false;
		}
		else if (event.keyCode === aKey) {
			event.preventDefault();
			if (!gameOver) {
				isAttacking = true;
			}
		}
	}, false);

	window.requestAnimationFrame(drawUI);
}