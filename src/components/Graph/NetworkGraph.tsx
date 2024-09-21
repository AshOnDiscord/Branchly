"use client";

import { useEffect, useState } from "react";
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import React from "react";
import GraphEvents from "./GraphEvents";
import GraphLoader from "./GraphLoader";
import { createNodeBorderProgram } from "@sigma/node-border";
import NodeDatas from "./data/nodes_copy";
import NextUp from "@/components/NextUp";
import GraphExporter from "./GraphExporter";

const sigmaStyles = {
  height: "100vh",
  width: "auto",
};

const sigmaSettings = {
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
};

const NetworkGraph = (props: { showLessons: boolean }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient ? (
        <SigmaContainer style={sigmaStyles} settings={sigmaSettings}>
          <GraphEvents nodeData={NodeDatas} />
          <GraphLoader nodeData={NodeDatas} />
          <GraphExporter />
          {props.showLessons && <NextUp nodeData={NodeDatas} />}
        </SigmaContainer>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default NetworkGraph;
