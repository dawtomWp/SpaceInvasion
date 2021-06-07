import {Spaceship} from './Spaceship.js';
import {Enemy} from './Enemy.js';


export class Game {
  #elements = {
    spaceship: document.querySelector('[data-spaceship]'),
    container: document.querySelector('[data-container]'),
    lives: document.querySelector('[data-lives'),
    score: document.querySelector('[data-score'),
    modal: document.querySelector('[data-modal]'),
    scoreInfo: document.querySelector('[data-score-info]'),
    button: document.querySelector('[data-button]'),
    startGame: document.querySelector('[data-start-game]'),
    startGameModal:document.querySelector('[data-game-start-modal]'),
    apocalypseShoot:document.querySelector('[data-ultimate]')
  };
  #ship = new Spaceship(this.#elements.spaceship, this.#elements.container);
  #checkPositionInterval = null;
  #createEnemyInterval = null;
  #enemies = [];
  #lives = null;
  #score = null;
  #powerShot = 3;
  #enemiesInterval = null;
  #apocalypseShoot = null;


  pressStart() {
    this.#ship.init();
    this.#eventListeners();

    this.#newGame();
    this.#elements.button.addEventListener('click', () => this.#newGame());
    this.#elements.startGameModal.style.display="none"
  }
  init() {
     this.#elements.startGame.addEventListener('click', () => this.pressStart())
  }

  #newGame() {
    this.#elements.modal.classList.add('hide');
    this.#enemiesInterval = 30;
    this.#lives = 3;
    this.#score = 0;
    this.#apocalypseShoot = this.#ship.powerShot
    this.#updateLivesText();
    this.#updateScoreText();
    this.#ship.element.style.left = '0px';
    this.#ship.setPosition();
    this.#createEnemyInterval = setInterval(() => this.#randomNewEnemy(),1000)
    this.#checkPositionInterval = setInterval(()=> this.#checkPosition(),1)
  }
  #endGame() {

    this.#elements.modal.classList.remove('hide');
    this.#elements.scoreInfo.textContent = `You loose! Your score is ${this.#score}`;
    this.#enemies.forEach((enemy) => enemy.explode())
    this.#enemies.length = 0;
    this.#ship.powerShot = 4;
    clearInterval(this.#createEnemyInterval);
    clearInterval(this.#checkPositionInterval);

  }
  #randomNewEnemy() {
    const randomNumber = Math.floor(Math.random()*5) + 1;
    randomNumber % 5 ? this.#createNewEnemy(  this.#elements.container,
      this.#enemiesInterval,
      'enemy','explosion') : this.#createNewEnemy(  this.#elements.container,
        this.#enemiesInterval *2,
        'enemy--big',
        'explosion',
        3
        )
  }
  #eventListeners() {
    window.addEventListener('keydown',({keyCode}) => {
      switch(keyCode) {
          case 82:
              this.#destroyAll()
              break;
      }
    })
  }


  #createNewEnemy(...params) {
    const enemy = new Enemy(
      ...params
    )
    enemy.init();
    this.#enemies.push(enemy)
 
  }
  #destroyAll() {
    this.#updateUltimate()
    if(this.#powerShot >= 0) {
    //  this.#ship.apocalypse();
      this.#enemies.forEach((enemy) => enemy.explode())
      let destroyedShips = this.#enemies.length
      this.#score += destroyedShips - 1
      this.#updateScore()
      this.#enemies.length = 0;
    } else {
       console.log('No ammo')
    }
  }
  #updateUltimate() {
    this.#powerShot--
    this.#updateApocalypseText();
    if(this.#powerShot >= 0) {
    this.#elements.container.classList.add('ultimate')
    setTimeout(()=> this.#elements.container.classList.remove('ultimate'),100);
    }
  }
  #updateScore() {
    this.#score++;
    if(!(this.#score % 2)) {
      this.#enemiesInterval--
    } //co 2 punkt
  
    this.#updateScoreText()
  }
  #updateLives() {
    this.#lives--
    this.#updateLivesText();
    this.#elements.container.classList.add('hit')
    setTimeout(()=> this.#elements.container.classList.remove('hit'),100);
    if(!this.#lives) {
      this.#endGame()
    }

  }
  #updateApocalypseText() {
    if(this.#powerShot >= 0) {
      this.#elements.apocalypseShoot.textContent = `Doom Shot: ${this.#powerShot}`
    }


  }
  #updateScoreText() {
    this.#elements.score.textContent = `Score: ${this.#score}`
  }
  #updateLivesText() {
    this.#elements.lives.textContent = `Lives: ${this.#lives}`
  }

  #checkPosition() {

    this.#enemies.forEach((enemy,enemyIndex,enemiesArr)=> {
      const enemyPosition = {
        top: enemy.element.offsetTop,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        left: enemy.element.offsetLeft
      }
      if(enemyPosition.top > window.innerHeight) {
        enemy.explode();
        enemiesArr.splice(enemyIndex,1);
        this.#updateLives();
      }
      this.#ship.missiles.forEach((missile,missileIndex,missileArr)=> {
        const missilePosition = {
          top: missile.element.offsetTop,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft
        }
        if(missilePosition.bottom >= enemyPosition.top && missilePosition.top <= enemyPosition.bottom && missilePosition.right >= enemyPosition.left && missilePosition.left <= enemyPosition.right) {
          enemy.hit();
          if(!enemy.lives) {
            enemiesArr.splice(enemyIndex,1)
          }  
          missile.removeMissile();
          missileArr.splice(missileIndex,1);
          this.#updateScore();
        }
        if(missilePosition.bottom < 0) {
          missile.removeMissile();
          missileArr.splice(missileIndex,1)
        }
      })
    })
  }
}

window.onload = function() {
  const game = new Game();
  game.init()
}