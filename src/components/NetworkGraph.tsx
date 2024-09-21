"use client";

import { useEffect, useState } from "react";
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import React from "react";
import GraphEvents from "./GraphEvents";
import MyGraph from "./MyGraph";
import { createNodeBorderProgram } from "@sigma/node-border";
import NodeDatas from "./nodes_copy";

const sigmaStyle = {
  height: "100vh",
  width: "auto",
};

const NetworkGraph = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient ? (
        <SigmaContainer
          style={sigmaStyle}
          settings={{
            nodeProgramClasses: {
              border: createNodeBorderProgram({
                borders: [
                  {
                    size: { value: 0.2 },
                    color: { attribute: "tempBorderColor" },
                  },
                  { size: { fill: true }, color: { attribute: "tempColor" } },
                ],
              }),
            },
          }}
        >
          <GraphEvents nodeData={NodeDatas} />
          <MyGraph nodeData={NodeDatas} />
        </SigmaContainer>
      ) : (
        <p>SSR</p>
      )}
    </>
  );
};

export default NetworkGraph;
