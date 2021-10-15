import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
// import initParams from "./initParams";
import ThreeDefinition from "@donkeyclip/motorcortex-threejs";
const threejs = loadPlugin(ThreeDefinition);

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
    color: {{ initParams.color }};
  }
  `,
  host: document.getElementById("clip"),
  containerParams: {
    width: "1920px",
    height: "1080px",
  },
  // initParamsValidationRules: {
  //   color: {
  //     label: "Text Color",
  //     type: "color",
  //     optional: true,
  //     default: "white",
  //   },
  // },
  // initParams: initParams[1].value,
});

const instances = [];
const randomMatrix = [];
const count = 20;
for (let i = 0; i < count; i++) {
  const r = Math.random();
  let random = 4;
  if (r < 0.25) random = 1;
  else if (r < 0.5) random = 2;
  else if (r < 0.75) random = 3;
  randomMatrix.push(random);

  // position
  instances.push([
    i,
    [
      Math.random() * 20 * (Math.random() > 0.5 ? -1 : 1),
      Math.random() * 20 * (Math.random() > 0.5 ? -1 : 1),
      Math.random() * 20 * (Math.random() > 0.5 ? -1 : 1),
    ],
    [random * 3.14, random * 3.14, random * 3.14],
  ]);
}

const instance = {
  id: "instance",
  geometry: { type: "TorusBufferGeometry", parameters: [10, 1.5, 32, 100] },
  material: {
    type: "MeshLambertMaterial",
    parameters: [
      {
        color: "#fff",
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
        setClearColor: ["#111"],
        // physicallyCorrectLights: true,
      },
    },
    scenes: {},
    lights: [
      {
        id: "light_purple",
        type: "AmbientLight",
        parameters: ["#111", 0.2],
        settings: {
          position: { set: [50, 0, 0] },
        },
      },
      {
        id: "light_spot_blue",
        type: "PointLight",
        parameters: ["#f00", 1],
        settings: {
          position: { set: [50, 0, 0] },
        },
      },
      {
        id: "light_spot_pink",
        type: "PointLight",
        parameters: ["#00f", 1],
        settings: {
          position: { set: [-50, 0, 0] },
        },
      },
      // {
      //   id: "light_spot_pink",
      //   type: "SpotLight",
      //   parameters: ["#9b657b", 1],
      //   settings: {
      //     position: { set: [-50, 0, 0] },
      //   },
      // },
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
    controls: { enable: true, enableEvents: false, maxPolarAngle: Math.PI },
  },
  {
    selector: ".container",
    containerParams: { width: "1920px", height: "1080px" },
  }
);

const newInstances = JSON.parse(JSON.stringify(instances));
for (let i = 0; i < newInstances.length; i++) {
  const rotate = randomMatrix[i] * 3.14 * 2;
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
    duration: 6000,
  }
);
threeclip.addIncident(rotation, 0);

// const rotation = new threejs.ObjectAnimation(
//   {
//     animatedAttrs: {
//       instance: [
//         [0, [-10, 0, 0], [3.14, 0, 0]],
//         [1, [0, -10, 0], [0, 3.14, 0]],
//         [2, [10, 0, 0], [3.14, 0, 3.14]],
//       ],
//     },
//   },
//   {
//     selector: "!#instance",
//     duration: 2000,
//   }
// );
// const rotation1 = new threejs.ObjectAnimation(
//   {
//     animatedAttrs: {
//       instance: [
//         [0, [0, 0, 0], [6.28, 0, 0]],
//         [1, [0, 0, 0], [0, 6.28, 0]],
//         [2, [0, 0, 0], [6.28, 6.28, 0]],
//       ],
//     },
//   },
//   {
//     selector: "!#instance",
//     duration: 2000,
//   }
// );
threeclip.addIncident(rotation, 0);
// threeclip.addIncident(rotation1, 2000);
clip.addIncident(threeclip, 0);
