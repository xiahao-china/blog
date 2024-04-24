export class InsertCard {
  private el?: HTMLDivElement;
  private left = 100 + Math.random() * 200;
  private top = 100 + Math.random() * 400;
  private step = 5;

  constructor() {
  }

  render = () => {
    if (this.left > this.step) this.left -= this.step;
    else this.left = 0;
    if (this.top > this.step) this.top -= this.step;
    else this.top = 0;
    (this.el as HTMLDivElement).style.top = `${this.top}px`;
    if (this.left || this.top) requestAnimationFrame(this.render);
  };
  init = (el: HTMLDivElement) => {
    this.el = el;
    this.render();
  };

}