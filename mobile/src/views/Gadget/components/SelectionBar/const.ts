export class SelectionBar {
  private listEl: HTMLDivElement;
  private childrenMaxIndex = 0;
  private currentIndex = 0;
  private onChangeIndex: (val: number) => void;

  private decisionRatio = 0.4;
  private itemWidth = 0;
  private itemMargin = 0;

  private startTouchIndex = 0;
  private hasStart = false;
  private startX = 0;
  private currentIndexX = 0;
  private currentX = 0;

  checkBlockInfo() {
    const len = this.listEl.children.length;
    this.childrenMaxIndex = len - 1;
    this.itemWidth = this.listEl.children[0].getBoundingClientRect().width;
    this.itemMargin =
      (this.listEl.getBoundingClientRect().width - this.itemWidth * len) /
      (len - 1);
    this.currentIndexX =
      (this.itemWidth + this.itemMargin) * this.currentIndex * -1;
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.checkBlockInfo();
    const clickIntervalX =
      this.listEl.getBoundingClientRect().x -
      (event.target as Element).getBoundingClientRect().x;
    this.startTouchIndex =
      Math.abs(clickIntervalX) > this.itemMargin
        ? Math.floor(
            Math.abs(clickIntervalX) / (this.itemWidth + this.itemMargin)
          )
        : 0;
    this.startX = event.targetTouches[0].screenX;
  }

  onTouchMove(event: TouchEvent) {
    this.hasStart = true;
    requestAnimationFrame(() => {
      const calcVal =
        event.targetTouches[0].screenX - this.startX + this.currentIndexX;
      this.currentX = calcVal > 0 ? 0 : calcVal;
      this.listEl.setAttribute(
        "style",
        `transform: translateX(${this.currentX}px);`
      );
    });
  }

  public changeIndex = (index: number, aimX?: number) => {
    if (this.currentIndex !== index) {
      this.currentX =
        (this.itemWidth + this.itemMargin) * this.currentIndex * -1;
      this.currentIndex = index;
    }
    const cAimX = aimX ? aimX : (this.itemWidth + this.itemMargin) * index * -1;

    if (Math.abs(this.currentX - cAimX) < 2) {
      this.listEl.setAttribute("style", `transform: translateX(${cAimX}px);`);
    } else {
      requestAnimationFrame(() => {
        this.currentX = this.currentX + (this.currentX - cAimX) * -0.2;
        this.listEl.setAttribute(
          "style",
          `transform: translateX(${this.currentX}px);`
        );
        this.changeIndex(index, cAimX);
      });
    }
  };

  onTouchEnd() {
    if (!this.hasStart) {
      this.changeIndex(this.startTouchIndex);
      this.onChangeIndex(this.startTouchIndex);
      return;
    }
    this.hasStart = false;
    this.currentIndex =
      Math.floor(Math.abs(this.currentX) / (this.itemWidth + this.itemMargin)) +
      Number(
        Math.abs(this.currentX) % this.itemWidth >
          this.itemWidth * this.decisionRatio
      );
    if (this.currentIndex < 0) this.currentIndex = 0;
    if (this.currentIndex > this.childrenMaxIndex)
      this.currentIndex = this.childrenMaxIndex;
    this.currentIndexX =
      (this.itemWidth + this.itemMargin) * -1 * this.currentIndex;
    this.listEl.setAttribute(
      "style",
      `transform: translateX(${this.currentIndexX}px);`
    );
    this.onChangeIndex(this.currentIndex);
  }

  constructor(el: HTMLDivElement, onChangeIndex: (val: number) => void) {
    this.listEl = el;
    this.onChangeIndex = onChangeIndex;
    this.checkBlockInfo();
    el.addEventListener("touchstart", this.onTouchStart.bind(this));
    el.addEventListener("touchmove", this.onTouchMove.bind(this));
    el.addEventListener("touchend", this.onTouchEnd.bind(this));
  }
}
