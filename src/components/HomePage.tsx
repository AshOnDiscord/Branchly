"use client";
import dynamic from "next/dynamic";
import NextUp from "./NextUp";

const NetworkGraph = dynamic(() => import("@/components/NetworkGraph"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      {/* <NetworkGraph /> */}
      <NetworkGraph />
      <NextUp nodeData={"owo"} />
    </>
  );
}
