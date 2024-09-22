"use client";
import WikiViewer from "@/components/WikiViewer";

export default function Page() {
  return <WikiViewer pageNumber={66256} finished={() => alert("done")} />;
}
