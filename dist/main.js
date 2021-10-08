import * as THREE from "three";
// import Stats from "./jsm/libs/stats.module.js";
// import { GUI } from "./jsm/libs/dat.gui.module.js";
// import { OrbitControls } from "./jsm/controls/OrbitControls.js";
// import { SVGLoader } from "./jsm/loaders/SVGLoader.js";
// init()
// function init() {
//   const container = document.getElementById("container");
//   camera
// }
class App {
    /**
     *
     * @param {HTMLCanvasElement} canvas 画布
     * @param {*} model 模型
     * @param {*} animations 所有动画
     */
    constructor(canvas, model, animations) {
        // 场景： 创建场景 》 添加辅助网格线 》 添加模型 》 添加环境光 》 添加方向光
        this.scene = App.createScene().add(App.createGridHelper());
    }
}
/**
 * 创建场景
 * @returns scene 场景
 */
App.createScene = () => {
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0b0b0);
    return scene;
};
/**
 * 添加网格辅助线
 * @returns 网格辅助线
 */
App.createGridHelper = () => {
    const helper = new THREE.GridHelper(160, 10);
    helper.rotation.x = Math.PI / 2;
    return helper;
};
App.createGUI = () => {
    // if (this.gui) this.gui.destroy();
    // let gui = new GUI({ width: 350 });
};
