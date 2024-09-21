import Graph from "@/models/Graph";
import { NodeData } from "@/types/GraphTypes";
// import { ObjectId } from "mongodb";
import { ObjectId } from "bson";

function hex(value: number) {
  return Math.floor(value).toString(16);
}

export default function GraphSaver(props: { nodeData: NodeData[] }) {
  const name = new ObjectId().toString().slice(0, 7);
  const description = new ObjectId().toString();
  const author = new ObjectId();

  const data: Graph = {
    _id: new ObjectId(),
    name,
    description,
    author,
    subscribers: [],
    published: false,
    nodes: props.nodeData.map((node) => ({
      ...node,
      _id: new ObjectId(),
    })),
  };

  const saveGraph = () => {
    fetch("/api/saveGraph", {
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
  };

  return <></>;
}
