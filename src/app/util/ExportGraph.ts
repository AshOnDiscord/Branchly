import exp from "constants";
import Sigma from "sigma";

const ExportGraph = async (sigma: Sigma) => {
  const { width, height } = sigma.getDimensions();
  // const { width, height } = { width: 800, height: 600 };
  const pixelRatio = window.devicePixelRatio || 1;

  const tmpRoot = document.createElement("div");
  tmpRoot.style.width = `${width}px`;
  tmpRoot.style.height = `${height}px`;
  tmpRoot.style.position = "absolute";
  tmpRoot.style.right = "101%";
  tmpRoot.style.bottom = "101%";
  document.body.appendChild(tmpRoot);

  // Instantiate sigma:
  const tmpRenderer = new Sigma(
    sigma.getGraph().copy(),
    tmpRoot,
    sigma.getSettings(),
  );
  // make edges black
  tmpRenderer
    .getGraph()
    .edges()
    .forEach((edge) => {
      tmpRenderer.getGraph().setEdgeAttribute(edge, "color", "#000");
    });

  // Copy camera and force to render now, to avoid having to wait the schedule /
  // debounce frame:
  tmpRenderer.getCamera().setState(sigma.getCamera().getState());
  tmpRenderer.refresh();

  // Create a new canvas, on which the different layers will be drawn:
  const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
  canvas.setAttribute("width", width * pixelRatio + "");
  canvas.setAttribute("height", height * pixelRatio + "");
  canvas.style.backgroundColor = "transparent";
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Draw a white background first:
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, width * pixelRatio, height * pixelRatio);

  // For each layer, draw it on our canvas:
  const canvases = tmpRenderer.getCanvases();
  const inputLayers = ["edges", "nodes"];
  const layers = inputLayers
    ? inputLayers.filter((id) => !!canvases[id])
    : Object.keys(canvases);
  layers.forEach((id) => {
    ctx.drawImage(
      canvases[id],
      0,
      0,
      width * pixelRatio,
      height * pixelRatio,
      0,
      0,
      width * pixelRatio,
      height * pixelRatio,
    );
  });

  // Save the canvas as a PNG image:
  // canvas.toBlob((blob) => {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
  tmpRenderer.kill();
  tmpRoot.remove();
  if (blob) {
    const url = URL.createObjectURL(blob);
    // const aTag = document.createElement("a");
    // aTag.href = url;
    // aTag.download = "graph.png";
    // aTag.click();

    const req = await fetch("http://localhost:3000/api/db/uploadImage", {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": "application/json",
      },
    });
    URL.revokeObjectURL(url);
    const link = await req.text();
    return link;
  }
};

export default ExportGraph;
