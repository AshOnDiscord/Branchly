"use client";

import { useEffect, useState } from "react";
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import React from "react";
import GraphEvents from "./GraphEvents";
import GraphLoader from "./GraphLoader";
import { createNodeBorderProgram } from "@sigma/node-border";
import NextUp from "@/components/NextUp";
import { NodeData } from "@/types/GraphTypes";
import GraphSaver from "./GraphSaver";
import { v6 } from "uuid";

const sigmaStyles = {
  height: "100vh",
  width: "auto",
};

const NetworkGraph = (props: {
  showLessons: boolean;
  data: NodeData[];
  disabled: boolean;
  edgeBlack: boolean;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [statusT, setStatusT] = useState(v6());

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    defaultEdgeColor: props.edgeBlack ? "#000" : "#fff", // Set edge color based on prop
    allowInvalidContainer: true,
  };

  return (
    <>
      {isClient ? (
        <>
          <SigmaContainer
            style={sigmaStyles}
            settings={sigmaSettings}
            className="relative !bg-transparent"
          >
            {!props.disabled && <GraphEvents nodeData={props.data} />}
            <GraphLoader nodeData={props.data} />
            <GraphSaver nodeData={props.data} />
            {props.showLessons && <NextUp nodeData={props.data} />}
          </SigmaContainer>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default NetworkGraph;
