export class Enemy {
    constructor(container,intervalMove,enemyClass,explosionClass, lives =1) {
        this.container = container;
        this.enemyClass = enemyClass;
        this.element = document.createElement('div');
        this.explosionClass = explosionClass;
        this.interval = null;
        this.intervalMove = intervalMove;
        this.lives = lives;

    }
    init() {
        this.#setEnemy();
        this.#updatePosition();
    }
    #setEnemy() {
        this.element.classList.add(this.enemyClass)
        this.container.appendChild(this.element);
        this.element.style.top = '0px'
        this.element.style.left =`${this.#randomPosition()}px`
    }
    #randomPosition() {
        return Math.floor(Math.random() * (window.innerWidth - this.element.offsetWidth))
    }
    #updatePosition() {
        this.interval = setInterval(() => this.#setNewPosition(),this.intervalMove)

    }
    #setNewPosition() {
        this.element.style.top = `${this.element.offsetTop + 1}px`
    }
    remove() {
      clearInterval(this.interval)
      this.element.remove();
    }
    hit() {
        this.lives--;
        if(!this.lives) {
            this.explode()
        }
    }
    explode() {
        this.element.classList.remove(this.enemyClass);
        this.element.classList.add(this.explosionClass);
        clearInterval(this.interval);
        const animationTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--explosions-animation-time'),10)
        setTimeout(()=> this.element.remove(),animationTime)
    }
}
