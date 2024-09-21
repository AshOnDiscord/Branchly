import { Button } from "@headlessui/react";
import { useSigma } from "@react-sigma/core";
import Sigma from "sigma";

export default function GraphExporter() {
  const sigma = useSigma();
  const exportGraph = () => {
    // const { width, height } = sigma.getDimensions();
    const { width, height } = { width: 800, height: 600 };
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
      sigma.getGraph(),
      tmpRoot,
      sigma.getSettings(),
    );

    // Copy camera and force to render now, to avoid having to wait the schedule /
    // debounce frame:
    tmpRenderer.getCamera().setState(sigma.getCamera().getState());
    tmpRenderer.refresh();

    // Create a new canvas, on which the different layers will be drawn:
    const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
    canvas.setAttribute("width", width * pixelRatio + "");
    canvas.setAttribute("height", height * pixelRatio + "");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // Draw a white background first:
    ctx.fillStyle = "#fff";
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
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sigma.png";
        a.click();
        URL.revokeObjectURL(url);
      }

      // Cleanup:
      tmpRenderer.kill();
      tmpRoot.remove();
    }, "image/png");
  };

  return (
    <Button onClick={exportGraph} className="absolute right-0 top-0">
      Export Graph
    </Button>
  );
}
