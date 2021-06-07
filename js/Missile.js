export class Missile {
    constructor(x,y,container) {
      this.x = x;
      this.y = y;
      this.container = container;
      this.element = document.createElement('div');
      this.interval = null;
    }
    removeMissile() {
        clearInterval(this.interval)
        this.element.remove();
    }
    init() {
      this.element.classList.add('missile');
      this.container.appendChild(this.element);
      this.element.style.left = `${this.x - this.element.offsetWidth/2}px`
      this.element.style.top = `${this.y - this.element.offsetHeight}px`
      this.interval = setInterval(() => this.element.style.top = `${this.element.offsetTop -1}px`, 5 )
    }
}
