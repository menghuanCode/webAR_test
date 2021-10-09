import * as THREE from "./three/build/three.module.js";
import Stats from "./three/examples/jsm/libs/stats.module.js";

import { GUI } from "./three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "./three/examples/jsm/loaders/SVGLoader.js";


const prefix = "./js/three/examples";

class App {
  gui;
  guiData;
  scene;
  camera;
  renderer;
  controls;

  container;

  /**
   *
   * @param 容器 container 画布
   * @param {*} animations 所有动画
   */
  constructor(container, animations) {
    this.container = container;
    // 场景： 创建场景
    this.scene = App.createScene();

    // 镜头
    this.camera = App.createCamera();
    // let loader = new SVGLoader();

    // 渲染器
    this.renderer = App.createRenderer();

    // 控制器
    this.controls = App.createControls(this.camera, this.renderer);

    // 统计创建
    this.stats = App.createStats();

    this.init();
    this.update();
  }

  init() {
    this.container.appendChild(this.renderer.domElement);
    this.container.appendChild(this.stats.dom);

    window.addEventListener("resize", () => this.onWindowResize());
  }

  update() {
    this.resize();

    // console.log(1)
    this.renderer.render(this.scene, this.camera);

    // 帧更新，渲染刷新
    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  /**
   * 当 window 窗口改变时
   */
  onWindowResize() {
    // 重置渲染的大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 重置摄像头的比例
    this.camera.aspect = window.innerWidth / window.innerHeight;
    // 更新摄像机的投影矩阵，必须在参数更改后调用
    this.camera.updateProjectionMatrix();

    console.log("onWindowResize");
  }

  resize() {}

  /**
   * 创建场景
   * @returns scene 场景
   */
  static createScene = () => {
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0b0b0);
    return scene;
  };

  /**
   * 添加网格辅助线
   * @returns 网格辅助线
   */
  static createGridHelper = () => {
    const helper = new THREE.GridHelper(160, 10);
    helper.rotation.x = Math.PI / 2;
    return helper;
  };

  //  * 创建镜头
  //  * @returns 镜头
  //  */
  static createCamera() {
    let camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    camera.position.set(0, 0, 200);
    return camera;
  }

  static createRenderer() {
    // 注册 Web GL 渲染器
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    // 设置比例
    renderer.setPixelRatio(window.devicePixelRatio);
    // 设置大小
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
  }

  /**
   * 创建控制器
   * @param {*} camera 镜头
   * @param {*} renderer 渲染器
   */
  static createControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
  }

  static createStats() {
    const stats = new Stats();
    return stats;
  }
}

const container = document.getElementById("container");
const button = document.getElementById("button");
const app = new App(container);

const loader = new SVGLoader();

const guiData = {
  currentURL: prefix + "/models/svg/tiger.svg",
  drawFillShapes: true,
  drawStrokes: true,
  fillShapesWireframe: false,
  strokesWireframe: false,
};

/**
 * 加载SVG
 * @param {*} guiData gui Data
 */
const loadSVG = (guiData) => {
  loader.load(guiData.currentURL, function (data) {
    // 得到 svg 的所有路径
    const { paths } = data;

    // 创建一个组
    const group = new THREE.Group();
    group.scale.multiplyScalar(0.25);
    group.position.x = -70;
    group.position.y = 70;
    group.scale.y *= -1;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      // 当前路径填充颜色

      const {
        fill: fillColor,
        fillOpacity,
        stroke: strokeColor,
        strokeOpacity,
      } = path.userData.style;
      // 如果是要绘制填充形狀并且有填充颜色
      if (
        guiData.drawFillShapes &&
        fillColor !== undefined &&
        fillColor !== "none"
      ) {
        // 网状基础材料
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(fillColor),
          opacity: fillOpacity,
          transparent: fillOpacity < 1,
          size: THREE.DoubleSide,
          depthWrite: false,
          wireframe: guiData.fillShapesWireframe,
        });

        // 形状
        const shapes = SVGLoader.createShapes(path);
        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        }
      }

      // 绘制线条
      if (
        guiData.drawStrokes &&
        strokeColor !== undefined &&
        strokeColor !== "none"
      ) {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(strokeColor),
          opacity: strokeOpacity,
          transparent: strokeOpacity < 1,
          side: THREE.DoubleSide,
          depthWrite: false,
          wireframe: guiData.strokesWireframe,
        });

        for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
          const subPath = path.subPaths[j];
          const geometry = SVGLoader.pointsToStroke(
            subPath.getPoints(),
            path.userData.style
          );
          if (geometry) {
            const mesh = new THREE.Mesh();
            group.add(mesh);
          }
        }
      }
    }

    app.scene.clear();
    app.scene.add(group);
  });
};

drawInit();

button.addEventListener("click", function () {
  console.log("我要开始切换了");
  drawInit();
});

function drawInit() {
  loadSVG(guiData);
  const shade = document.createElement("div");
  shade.setAttribute("class", "shade");
  container.appendChild(shade);

  shade.addEventListener("click", function () {
    console.log("shade");
    shade.remove();
    const newGroup = Object.assign({}, guiData, {
      currentURL: prefix + "/models/svg/threejs.svg",
    });

    loadSVG(newGroup);
  });
}
