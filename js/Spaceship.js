import {Missile} from './Missile.js';
import {Game} from './Game.js'



export class Spaceship {
    missiles = [];
    #modifier = 10;
    #leftArrow = false;
    #rightArrow = false;

    constructor(element,container) {
        this.element = element;
        this.container = container
    }
    setPosition() {
        this.element.style.bottom = '0px';
        this.element.style.left = `${window.innerWidth / 2 - this.#getPosition()}px`; //wysrodkowanie statku
    }
    #getPosition() {
        return this.element.offsetLeft + this.element.offsetWidth /2
    }
    #gameLoop = () => { //strzalkowa bo gubimy kontekst this
        this.#whatKey()
        requestAnimationFrame(this.#gameLoop) //rekurencja metoda sama sie wywoluje w srodku metody
    }
    #whatKey() {
        if(this.#leftArrow && this.#getPosition() > 12) {
           this.element.style.left = `${parseInt(this.element.style.left,10) - this.#modifier}px`;
        }
        if(this.#rightArrow && this.#getPosition() + 12 < window.innerWidth) {
          this.element.style.left = `${parseInt(this.element.style.left,10) + this.#modifier}px`;
        }
    }
    #shoot() {
       const missile = new Missile(
           this.#getPosition(), 
           this.element.offsetTop,
           this.container,
       );
       missile.init();
       this.missiles.push(missile);
    }

    init() {
       this.#eventListeners()
       this.setPosition()
       this.#gameLoop()
    }
    #eventListeners() {
        window.addEventListener('keydown',({keyCode}) => {
          switch(keyCode) {
              case 37:
                  this.#leftArrow = true;
                  break;
              case 39:
                  this.#rightArrow = true;
                  break;
          }
        })
        window.addEventListener('keyup',({keyCode}) => {
            switch(keyCode) {
                case 32:
                    this.#shoot()
                    break;
                case 37:
                    this.#leftArrow = false;
                    break;
                case 39:
                    this.#rightArrow = false;
                    break;
            }
          })
    }
        
}