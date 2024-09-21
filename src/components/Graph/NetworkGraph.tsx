"use client";

import { useEffect, useState } from "react";
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import React from "react";
import GraphEvents from "./GraphEvents";
import GraphLoader from "./GraphLoader";
import { createNodeBorderProgram } from "@sigma/node-border";
import NextUp from "@/components/NextUp";
import GraphExporter from "./GraphExporter";
import { NodeData } from "@/types/GraphTypes";
import GraphSaver from "./GraphSaver";

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

const NetworkGraph = (props: {
  showLessons: boolean;
  data: NodeData[];
  disabled: boolean;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient ? (
        <SigmaContainer style={sigmaStyles} settings={sigmaSettings}>
          {!props.disabled && <GraphEvents nodeData={props.data} />}
          <GraphLoader nodeData={props.data} />
          <GraphExporter />
          <GraphSaver nodeData={props.data} />
          {props.showLessons && <NextUp nodeData={props.data} />}
        </SigmaContainer>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default NetworkGraph;
