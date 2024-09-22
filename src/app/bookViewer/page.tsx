"use client";
import WikiViewer from "@/components/WikiViewer";

export default function Page() {
  return (
    <WikiViewer
      apiUrl="https://en.wikibooks.org/w/api.php"
      pageNumber={71452}
      finished={() => alert("done")}
    />
  );
}
