"use client";
import Graph from "@/models/Graph";
import User from "@/models/User";
import { useUser } from "@propelauth/nextjs/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import NodeDatas from "@/components/Graph/data/nodes_copy";

const NetworkGraph = dynamic(() => import("@/components/Graph/NetworkGraph"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState<Graph | Pick<Graph, "nodes">>({} as any);

  const user = useUser().user!;

  console.log(user, "USER");

  useEffect(() => {
    if (!user) return;
    fetch("http://localhost:3000/api/db/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        email: user.email,
      }),
    })
      .then((res) => res.json())
      .then((data: User) => {
        console.log(data, "MONGO DB DATA");
        console.log(data.tree, "MONGO DB DATA TREE");
        setData(data.tree);
      });
  }, [user]);

  return (
    <>
      {data && Object.keys(data).length > 0 && (
        <NetworkGraph
          showLessons={true}
          disabled={false}
          edgeBlack={false}
          data={data.nodes}
        />
      )}
    </>
  );
}
