"use client";
import wiki from "wikijs";
import { fetchWikipediaArticles } from "../util/Scraper/Wikipedia";
import { pipeline } from "@xenova/transformers";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2").then(
      (extractor) => {
        fetchWikipediaArticles(
          "Graph theory",
          "Graph theory introductory sentences",
          extractor,
        )
          .then((articles) => articles)
          .then((articles) => console.log(articles));
      },
    );
  });
  // console.log(await (await wiki().page("apple")).rawContent());
  return <div></div>;
}
