export default class SwipeTabs {
  constructor(element) {
    this.element = element;
    this.tabs = Array.from(this.element.querySelectorAll(".tab-btn"));
    this.startX = 0;
    this.scrollLeft = 0;
    this.isDown = false;

    this.element.addEventListener("mousedown", this.startDragging.bind(this));
    this.element.addEventListener("touchstart", this.startDragging.bind(this));
    this.element.addEventListener("mousemove", this.drag.bind(this));
    this.element.addEventListener("touchmove", this.drag.bind(this));
    this.element.addEventListener("mouseleave", this.stopDragging.bind(this));
    this.element.addEventListener("mouseup", this.stopDragging.bind(this));
    this.element.addEventListener("touchend", this.stopDragging.bind(this));
  }

  startDragging(e) {
    this.isDown = true;
    this.element.classList.add("active");
    this.startX =
      e.type === "touchstart"
        ? e.touches[0].pageX - this.element.offsetLeft
        : e.pageX - this.element.offsetLeft;
    this.scrollLeft = this.element.scrollLeft;
  }

  stopDragging() {
    this.isDown = false;
    this.element.classList.remove("active");
  }

  drag(e) {
    if (!this.isDown) return;
    e.preventDefault();
    const x =
      e.type === "touchmove"
        ? e.touches[0].pageX - this.element.offsetLeft
        : e.pageX - this.element.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.element.scrollLeft = this.scrollLeft - walk;
  }
}
