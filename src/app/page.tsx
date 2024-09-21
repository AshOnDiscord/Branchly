"use client";
import Graph from "@/models/Graph";
import { NodeData } from "@/types/GraphTypes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import NodeDatas from "@/components/Graph/data/nodes_copy";

const NetworkGraph = dynamic(() => import("@/components/Graph/NetworkGraph"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState<Graph>({} as any);
  useEffect(() => {
    fetch("http://localhost:3000/api/db/getGraphs")
      .then((res) => res.json())
      .then((data) => {
        console.log(data[0], "MONGO DB DATA");
        setData(data[0]);
      });
  }, []);
  return (
    <>
      {Object.keys(data).length > 0 && (
        <NetworkGraph
          showLessons={true}
          data={data.nodes.map((node) => {
            return {
              ...node,
              id: node._id,
            };
          })}
        />
      )}
    </>
  );
}
