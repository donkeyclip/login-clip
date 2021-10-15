import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
// import initParams from "./initParams";
import ThreeDefinition from "@donkeyclip/motorcortex-threejs";
const threejs = loadPlugin(ThreeDefinition);

const torus = {
  class: ["torus"],
  geometry: { type: "TorusGeometry", parameters: [10, 1.5, 5, 100] },
  material: {
    type: "MeshPhongMaterial",
    parameters: [
      {
        color: "#ff5722",
        flatShading: false,
        shininess: 2,
      },
    ],
  },
  settings: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
};
const torusArray = [];

const randomMatrix = [];
for (let i = 0; i < 10; i++) {
  const r = Math.random();
  let random = 4;
  if (r < 0.25) random = 1;
  else if (r < 0.5) random = 2;
  else if (r < 0.75) random = 3;
  randomMatrix.push(random);

  const torusClone = JSON.parse(JSON.stringify(torus));
  torusClone.id = "torus_" + i;

  // position
  torusClone.settings.position.x =
    Math.random() * 20 * (Math.random() > 0.5 ? -1 : 1);
  torusClone.settings.position.y =
    Math.random() * 20 * (Math.random() > 0.5 ? -1 : 1);
  torusClone.settings.position.z =
    Math.random() * 30 * (Math.random() > 0.5 ? -1 : 1);

  // rotation
  torusClone.settings.rotation.x = random * 3.14;
  torusClone.settings.rotation.y = random * 3.14;
  torusClone.settings.rotation.z = random * 3.14;
  torusArray.push(torusClone);
}
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

const threeclip = new threejs.Clip(
  {
    renderers: {
      type: "WebGLRenderer",
      parameters: [{ alpha: true, antialias: true }],
      settings: {
        shadowMap: {
          enabled: true,
        },
        setClearColor: ["#111"],
        physicallyCorrectLights: true,
      },
    },
    scenes: {},
    lights: [
      {
        id: "light_purple",
        type: "AmbientLight",
        parameters: ["#777", 1],
        settings: {
          position: { set: [50, 0, 0] },
        },
      },
      {
        id: "light_spot",
        type: "SpotLight",
        parameters: ["#fff", 80],
        settings: {
          castShadow: true,
          position: { set: [50, 0, 10] },
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
    entities: torusArray,
    controls: { enable: true, enableEvents: true, maxPolarAngle: Math.PI },
  },
  {
    selector: ".container",
    containerParams: { width: "1920px", height: "1080px" },
  }
);

for (let i = 0; i < 10; i++) {
  const torusAnimation = new threejs.ObjectAnimation(
    {
      animatedAttrs: {
        rotation: {
          x: randomMatrix[i] * 3.14 * 2,
          y: randomMatrix[i] * 3.14 * 2,
          z: randomMatrix[i] * 3.14 * 2,
        },
      },
    },
    {
      selector: "!#torus_" + i,
      duration: 50000,
    }
  );
  threeclip.addIncident(torusAnimation, 0);
}

clip.addIncident(threeclip, 0);
