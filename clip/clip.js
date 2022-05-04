import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
import ThreeDefinition from "@donkeyclip/motorcortex-threejs";
const threejs = loadPlugin(ThreeDefinition);
import initParams from "./initParams";
import initParamsValidationRules from "./initParamsValidationRules";

export const clip = new HTMLClip({
  html: `
    <div class="container"></div>`,
  css: `
  .container {
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items: center;
  }
  `,
  host: document.getElementById("clip"),
  initParamsValidationRules,
  initParams:initParams[0].value,
  containerParams: {
    width: "1920px",
    height: "1080px",
  },
});

const instances = [];
const randomMatrix = [];
const count = 7;
for (let i = 0; i < count; i++) {
  const random = Math.random();
  randomMatrix.push(random);
  instances.push([
    i,
    [
      (Math.random() + 0.2) * 7 * (Math.random() > 0.5 ? -1 : 1),
      (Math.random() + 0.2) * 7 * (Math.random() > 0.5 ? -1 : 1),
      (Math.random() + 0.2) * 7 * (Math.random() > 0.5 ? -1 : 1),
    ],
    [random * 3.14, random * 3.14, random * 3.14],
  ]);
}

const instance = {
  id: "instance",
  geometry: { type: "TorusBufferGeometry", parameters: [10, 1.3, 32, 100] },
  material: {
    type: "MeshLambertMaterial",
    parameters: [
      {
        color: "@initParams.hoopColor",
        shininess: 2,
      },
    ],
  },
  settings: {
    count,
    instance: instances,
  },
  class: ["instance"],
};

const threeclip = new threejs.Clip(
  {
    renderers: {
      type: "WebGLRenderer",
      parameters: [{ powerPreference: "high-performance" }],
      settings: {
        setClearColor: ["@initParams.backgroundColor"],
      },
    },
    scenes: {},
    lights: [
      {
        id: "light_spot_pink",
        type: "PointLight",
        parameters: ["@initParams.light1"],
        settings: {
          position: { set: [-30, 0, 10] },
        },
      },
      {
        id: "ambient_light",
        type: "AmbientLight",
        parameters: ["@initParams.light2", 0.1],
        settings: {
          position: { set: [0, 0, 0] },
        },
      },
      {
        id: "light_spot_blue",
        type: "PointLight",
        parameters: ["@initParams.light3"],
        settings: {
          position: { set: [30, -0, 10] },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      type: "PerspectiveCamera",
      settings: {
        position: { x: 0, y: 0, z: 50 },
        far: 10000,
        near: 1,
      },
    },
    entities: [instance],
    controls: { enable: false, enableEvents: false, maxPolarAngle: Math.PI },
  },
  {
    selector: ".container",
    containerParams: { width: "1920px", height: "1080px" },
  }
);

const newInstances = JSON.parse(JSON.stringify(instances));
for (let i = 0; i < newInstances.length; i++) {
  const rotate = randomMatrix[i] * 3.14 + 3.14 * 2;
  newInstances[i][2] = [rotate, rotate, rotate];
}

const rotation = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      instance: newInstances,
    },
  },
  {
    selector: "!#instance",
    duration: 80000,
  }
);
threeclip.addIncident(rotation, 0);

threeclip.addIncident(rotation, 0);
clip.addIncident(threeclip, 0);
