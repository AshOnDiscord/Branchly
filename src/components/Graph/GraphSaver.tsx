import Graph from "@/models/Graph";
import { NodeData } from "@/types/GraphTypes";
import ExportGraph from "../../app/util/ExportGraph";
import { useSigma } from "@react-sigma/core";
import { v7 } from "uuid";
import { useUser } from "@propelauth/nextjs/client";

function hex(value: number) {
  return Math.floor(value).toString(16);
}

export default function GraphSaver(props: { nodeData: NodeData[] }) {
  const user = useUser().user!;

  const sigma = useSigma();
  const author = user.userId;

  const saveGraph = () => {
    const name: string =
      prompt("Enter the name of the graph") || v7().slice(0, 7);
    const description: string =
      prompt("Enter the description of the graph") || v7();

    const data: Graph = {
      _id: v7(),
      name,
      description,
      author,
      subscribers: [],
      published: false,
      nodes: props.nodeData.map(
        (node) =>
          ({
            ...node,
            _id: node.id,
          }) as any,
      ),
    };

    console.log(data.nodes.map((node) => node._id));

    const preview = ExportGraph(sigma).then((preview) => {
      data.preview = preview;
      fetch("/api/db/uploadGraph", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          alert("Graph saved successfully");
        } else {
          alert("Graph save failed");
        }
      });
    });
  };

  return (
    <button className="absolute left-0 top-0 block" onClick={saveGraph}>
      Upload
    </button>
  );
}
