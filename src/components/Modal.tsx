// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { pipeline } from "@xenova/transformers";
import computeCosineSimilarity from "compute-cosine-similarity";
import WikiViewer from "./WikiViewer";

const Modal = ({ isOpen, onClose, label, description }) => {
  const [wikiArticles, setWikiArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [wikibooksArticles, setWikibooksArticles] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedWikiId, setSelectedWikiId] = useState<number | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [descriptionEmbedding, setDescriptionEmbedding] = useState<number[]>(
    [],
  );
  const playerRef = useRef<YT.Player | null>(null);
  const wikiRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const extractorRef = useRef<any>(null);
  const [topArticles, setTopArticles] = useState([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(true);
  const [gunningFogIndexSum, setGunningFogIndexSum] = useState(0);
  const [totalVideoMinutes, setTotalVideoMinutes] = useState(0);

  const fetchWikipediaArticles = async (
    query: string,
    currentEmbedding: number[],
  ) => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=6&format=json&origin=*`,
        { signal: abortControllerRef.current?.signal },
      );
      const data = await res.json();
      setWikiArticles(data.query.search);
      fetchArticleContents(data.query.search, currentEmbedding);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted for Wikipedia articles.");
      }
    }
  };

  const fetchArticleContents = async (
    articles: any[],
    currentEmbedding: number[],
  ) => {
    setLoading(true); // Start loading
    const similarities = [];

    const countSyllables = (word) => {
      const syllablePattern = /[aeiouy]{1,2}/g;
      return (word.match(syllablePattern) || []).length;
    };

    const calculateGunningFogIndex = (text) => {
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const words = text.split(/\s+/).filter(Boolean);
      const complexWords = words.filter(
        (word) => countSyllables(word) >= 3,
      ).length;

      const wordCount = words.length;
      const sentenceCount = sentences.length;

      return (
        0.4 *
        (wordCount / sentenceCount + (100 * complexWords) / wordCount)
      ).toFixed(2);
    };

    for (const article of articles) {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(article.title)}&prop=extracts&explaintext=true&origin=*`,
          { signal: abortControllerRef.current?.signal },
        );
        const data = await res.json();
        const page = Object.values(data.query.pages)[0];
        const fullExtract = page.extract || "";

        if (extractorRef.current) {
          const output = await extractorRef.current([fullExtract], {
            pooling: "mean",
            normalize: true,
          });
          const sentenceEmbedding = Array.from(output[0].data);

          if (sentenceEmbedding.length !== currentEmbedding.length) {
            console.error("Mismatched embedding lengths:", {
              sentenceLength: sentenceEmbedding.length,
              descriptionLength: currentEmbedding.length,
            });
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
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted for article contents.");
          break; // Break the loop if fetching is aborted
        }
      }
    }

    similarities.sort((a, b) => b.similarity - a.similarity);
    const topThreeArticles = similarities.slice(0, 3);
    setTopArticles(topThreeArticles);
    const sumGunningFogIndex = topThreeArticles.reduce((sum, article) => {
      return sum + parseFloat(article.gunningFogIndex);
    }, 0);
    setGunningFogIndexSum(sumGunningFogIndex);

    setLoading(false); // Stop loading
  };

  const fetchVideos = async (query: string) => {
    const res = await fetch(
      `https://inv.tux.pizza/api/v1/search?q=${encodeURIComponent(query)}`,
    );
    const data = await res.json();

    if (Array.isArray(data)) {
      const filteredVideos = data
        .filter((video) => video.type === "video")
        .slice(0, 3);

      const videosToDisplay = filteredVideos.map((video) => ({
        title: video.title,
        videoId: video.videoId,
        author: video.author,
        length: video.lengthSeconds, // Add lengthSeconds here
        url: `https://www.youtube.com/watch?v=${video.videoId}`,
      }));

      setVideos(videosToDisplay);

      // Calculate total length in minutes and round up
      const totalLength = videosToDisplay.reduce(
        (sum, video) => sum + video.length,
        0,
      );
      const totalMinutes = Math.ceil(totalLength / 60); // Round up to the nearest minute
      console.log("Total video length in minutes (rounded up):", totalMinutes);
      setTotalVideoMinutes(totalMinutes);
    } else {
      console.error("No items found in the response", data);
      setVideos([]);
    }
  };

  const fetchWikibooksArticles = async (query: string) => {
    try {
      const res = await fetch(
        `https://en.wikibooks.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`,
        { signal: abortControllerRef.current?.signal },
      );
      const data = await res.json();
      setWikibooksArticles(data.query.search);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted for Wikibooks articles.");
      }
    }
  };

  useEffect(() => {
    const loadExtractor = async () => {
      extractorRef.current = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
      );
    };
    loadExtractor();
  }, []);

  useEffect(() => {
    const computeDescriptionEmbedding = async () => {
      if (extractorRef.current && description) {
        const output = await extractorRef.current([description], {
          pooling: "mean",
          normalize: true,
        });
        const descriptionArray = Array.from(output[0].data);
        setDescriptionEmbedding(descriptionArray);
        console.log("Computed description embedding:", descriptionArray);
        fetchWikipediaArticles(label, descriptionArray);
      }
    };
    if (isOpen) {
      abortControllerRef.current = new AbortController(); // Initialize new controller on open
      fetchVideos(label);
      fetchWikibooksArticles(label);
      if (extractorRef.current) {
        computeDescriptionEmbedding();
      } else {
        const waitForExtractor = async () => {
          while (!extractorRef.current) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          computeDescriptionEmbedding();
        };
        waitForExtractor();
      }
    } else {
      abortControllerRef.current?.abort(); // Abort ongoing requests when closed
      setGunningFogIndexSum(0); // Reset the Gunning Fog Index sum to 0
    }
  }, [isOpen, label]);

  const openVideoModal = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const closeVideoModal = () => {
    setSelectedVideoId(null);
    playerRef.current?.destroy();
  };

  const closeWikiModal = () => {
    setSelectedWikiId(null);
    setSelectedBookId(null);
    wikiRef.current?.remove();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (selectedVideoId) {
      const onYouTubeIframeAPIReady = () => {
        playerRef.current = new YT.Player("youtube-player", {
          height: "90%",
          width: "100%",
          videoId: selectedVideoId,
          events: {
            onStateChange: onPlayerStateChange,
          },
        });
      };

      const loadYouTubeAPI = () => {
        if (typeof YT === "undefined") {
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
          document.body.appendChild(script);
        } else {
          onYouTubeIframeAPIReady();
        }
      };

      loadYouTubeAPI();
    }
  }, [selectedVideoId]);

  useEffect(() => {
    if (selectedWikiId) {
      wikiRef.current = document.createElement("iframe");
      wikiRef.current.src = `https://en.wikipedia.org/?curid=${selectedWikiId}`;
      wikiRef.current.style.width = "100%";
      wikiRef.current.style.height = "90vh";
      document.body.appendChild(wikiRef.current);
    }
  }, [selectedWikiId]);

  const onPlayerStateChange = (event: any) => {
    if (event.data === 0) {
      console.log("Video completed, good job!");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div ref={modalRef} style={modalStyles.modal}>
        <h2>{label}</h2>
        <p>{description}</p>

        {/* TOTAL POINTS */}
        <h2 style={{ color: "red" }}>
          {" "}
          Total number of points possible:&nbsp;
          {parseInt(1.5 * gunningFogIndexSum) + parseInt(totalVideoMinutes)}
        </h2>

        <h2>
          Related Wikipedia Articles: (Total Gunning Fog Index:{" "}
          {gunningFogIndexSum.toFixed(2)})
        </h2>

        {loading ? (
          <div style={modalStyles.loading}>Loading...</div>
        ) : (
          <ul style={modalStyles.articleList}>
            {topArticles.map(
              ({ article, fullExtract, wordCount, gunningFogIndex }) => (
                <li key={article.pageid}>
                  {/* <a
                    href={`https://en.wikipedia.org/?curid=${article.pageid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={modalStyles.link}
                  > */}
                  <button
                    onClick={() => setSelectedWikiId(article.pageid)}
                    style={modalStyles.link}
                  >
                    {article.title} ({wordCount} words, Gunning Fog Index:{" "}
                    {gunningFogIndex})
                  </button>
                  {/* </a> */}
                </li>
              ),
            )}
          </ul>
        )}

        <h2>Extra textbook:</h2>
        <ul style={modalStyles.articleList}>
          {wikibooksArticles.map((article) => (
            <li key={article.pageid}>
              {/* <a
                href={`https://en.wikibooks.org/?curid=${article.pageid}`}
                target="_blank"
                rel="noopener noreferrer"
                style={modalStyles.link}
              > */}
              <button
                onClick={() => setSelectedBookId(article.pageid)}
                style={modalStyles.link}
              >
                {article.title}
              </button>
              {/* </a> */}
            </li>
          ))}
        </ul>

        <h2>YouTube Videos: (Total time: {totalVideoMinutes} minutes)</h2>
        {videos.length > 0 ? (
          <ul>
            {videos.map((video) => (
              <li key={video.videoId}>
                <button
                  onClick={() => openVideoModal(video.videoId)}
                  style={modalStyles.videoButton}
                >
                  {video.title} by {video.author}
                  {video.length
                    ? ` (${Math.floor(video.length / 60)}:${String(video.length % 60).padStart(2, "0")})`
                    : ""}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No videos found.</p>
        )}
      </div>
      {selectedVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full">
            <button
              onClick={closeVideoModal}
              className="absolute right-2 top-2 text-2xl text-white"
            >
              &times;
            </button>
            <div id="youtube-player" style={modalStyles.playerContainer}></div>
          </div>
        </div>
      )}
      {(selectedWikiId || selectedBookId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full bg-white">
            <button
              onClick={closeWikiModal}
              className="absolute right-2 top-2 text-2xl text-black"
            >
              &times;
            </button>
            {/* <iframe
              src={`https://en.wikipedia.org/?curid=${selectedWikiId}`}
              style={modalStyles.playerContainer}
            ></iframe> */}
            <WikiViewer
              apiUrl={
                selectedBookId === null
                  ? "https://en.wikipedia.org/w/api.php"
                  : "https://en.wikibooks.org/w/api.php"
              }
              pageNumber={(selectedWikiId ?? selectedBookId) as number}
              finished={() => {}}
            />
          </div>
        </div>
      )}
      {selectedVideoId + "yt"} {selectedWikiId + "wiki"}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    zIndex: "50",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
    width: "30%",
    height: "70%",
    overflowY: "auto",
    position: "relative",
  },
  articleList: {
    listStyleType: "none",
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontSize: "16px",
    padding: "5px 0",
    display: "block",
  },
  videoButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#007bff",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px 0",
    display: "block",
  },
  playerContainer: {
    marginTop: "20px",
    height: "90vh",
    width: "100%",
  },
  loading: {
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
    padding: "10px 0",
  },
};

export default Modal;
