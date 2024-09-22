import { AllTasks, Tensor } from "@xenova/transformers";
import wiki from "wikijs";
import computeCosineSimilarity from "compute-cosine-similarity";

export const fetchWikipediaArticles = async (
  query: string,
  summary: string,
  extractorRef: AllTasks["feature-extraction"],
) => {
  const articles = await (wiki() as any).search(query, 6);
  const currentEmbedding = Array.from(
    await extractorRef([summary], { pooling: "mean", normalize: true }),
  )[0].data;
  const articleContent = await fetchArticleContents(
    articles.results,
    currentEmbedding,
    extractorRef,
  );
  return { articles, articleContent };
};

const fetchArticleContents = async (
  articles: any[],
  currentEmbedding: number[],
  extractorRef: AllTasks["feature-extraction"],
) => {
  const similarities = [];

  for (const article of articles) {
    try {
      const page = await (wiki() as any).page(article);
      const fullExtract = await page.rawContent();

      if (extractorRef) {
        const output: Tensor = await extractorRef([fullExtract], {
          pooling: "mean",
          normalize: true,
        });
        const sentenceEmbedding: number[] = Array.from((output as any)[0].data);

        if (sentenceEmbedding.length !== currentEmbedding.length) {
          console.error(
            "Sentence embedding and current embedding have different lengths.",
            sentenceEmbedding.length,
            currentEmbedding.length,
          );
          continue;
        }

        const similarity = computeCosineSimilarity(
          sentenceEmbedding,
          currentEmbedding,
        );
        console.log(
          `Cosine similarity between extract and description: ${similarity}`,
        );

        const wordCount = fullExtract.split(/\s+/).length;
        const gunningFogIndex = calculateGunningFogIndex(fullExtract);
        console.log(
          `Gunning Fog Index for "${article.title}":`,
          gunningFogIndex,
        );

        similarities.push({
          article,
          similarity,
          fullExtract,
          wordCount,
          gunningFogIndex,
        });
      } else {
        console.error("Extractor not found.");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted for article contents.");
        break; // Break the loop if fetching is aborted
      }
    }
  }

  similarities.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
  const topThreeArticles = similarities.slice(0, 3);
  const sumGunningFogIndex = topThreeArticles.reduce((sum, article) => {
    return sum + parseFloat(article.gunningFogIndex);
  }, 0);

  return {
    topThreeArticles,
    sumGunningFogIndex,
  };
};

const fetchWikibooksArticles = async (query: string) => {
  // try {
  //   const res = await fetch(
  //     `https://en.wikibooks.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`,
  //   );
  //   const data = await res.json();
  //   setWikibooksArticles(data.query.search);
  // } catch (error) {
  //   if (error.name === "AbortError") {
  //     console.log("Fetch aborted for Wikibooks articles.");
  //   }
  // }
};

const countSyllables = (word: string) => {
  const syllablePattern = /[aeiouy]{1,2}/g;
  return (word.match(syllablePattern) || []).length;
};

const calculateGunningFogIndex = (text: string) => {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const complexWords = words.filter((word) => countSyllables(word) >= 3).length;

  const wordCount = words.length;
  const sentenceCount = sentences.length;

  return (
    0.4 *
    (wordCount / sentenceCount + (100 * complexWords) / wordCount)
  ).toFixed(2);
};
