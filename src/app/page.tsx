import dynamic from "next/dynamic";

const NetworkGraph = dynamic(() => import("@/components/Graph/NetworkGraph"), {
  ssr: false,
});

export default function Home() {
  return <NetworkGraph showLessons={true} />;
}
