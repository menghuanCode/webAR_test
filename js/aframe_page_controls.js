/* global AFRAME, THREE */
AFRAME.registerComponent("page-controls", {
  init: function () {
    let self = this;
    let el = this.el;
    let pageEl = (this.pageEl = document.querySelector("[layer]"));
    pageEl.object3D.position.set(0, 1.8, -2.5);

    this.pageIndex = 0;
    this.pages = [
      {
        page: "page1",
      },
      {
        page: "page2",
      },
      {
        page: "page3",
      },
      {
        page: "page4",
      },
      {
        page: "page5",
      },
    ];

    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.friction = 2.0;
    this.onThumbstickChanged = this.onThumbstickChanged.bind(this);
    this.turnPage = this.turnPage.bind(this);
    el.addEventListener("thumbstickmoved", this.onThumbstickChanged);
    el.addEventListener("triggerdown", this.turnPage);
    document.addEventListener("click", this.turnPage);

    el.addEventListener("bbuttondown", function () {
      self.zoomOut = true;
    });

    el.addEventListener("ybuttondown", function () {
      self.zoomOut = true;
    });

    el.addEventListener("bbuttoup", function () {
      self.zoomOut = false;
    });

    el.addEventListener("ybuttoup", function () {
      self.zoomOut = false;
    });

    el.addEventListener("abuttondown", function () {
      self.zoomOut = true;
    });

    el.addEventListener("xbuttondown", function () {
      self.zoomOut = true;
    });

    el.addEventListener("abuttonup", function () {
      self.zoomOut = false;
    });

    el.addEventListener("xbuttonup", function () {
      self.zoomOut = false;
    });

    el.addEventListener("thumbstickdown", function () {
      pageEl.components.layer.toggleCompositorLayout();
    });

    this.el.sceneEl.addEventListener("enter-vr", function () {
      pageEl.object3D.position.set(0, 1.8, -1.5);
    });
  },

  /**
   * 随着手势改变
   * @param {*} evt
   */
  onThumbstickChanged(evt) {
    this.acceleration.x = evt.detail.x * 80;
    this.acceleration.y = -evt.detail.y * 80;
  },

  /**
   * 翻页
   */
  turnPage() {
    let pages = this.pages;
    let pageId;
    this.pageIndex = (this.pageIndex + 1) % pages.length;
    pageId = pages[this.pageIndex].page;
    this.pageEl.setAttribute("layer", "src", "#" + pageId);
  },
});
