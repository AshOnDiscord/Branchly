"use client";
import { Field, Input } from "@headlessui/react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import NetworkGraphPreview from "@/components/Graph/NetworkGraph";
import { NodeData } from "@/types/GraphTypes";
import { mapNode } from "@/components/Graph/data/nodes";

export default function CreatePage() {
  const [inputValue, setInputValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [response, setResponse] = useState<NodeData[]>([]);
  const [videos, setVideos] = useState([]);
  const [wikiArticles, setWikiArticles] = useState([]);
  const [wikibooksArticles, setWikibooksArticles] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGraphCreated, setIsGraphCreated] = useState(false);
  // @ts-expect-error
  const playerRef = useRef<YT.Player>(null);

  const fetchVideos = async (query: any) => {
    const res = await fetch(
      `https://invidious.nerdvpn.de/api/v1/search?q=${encodeURIComponent(query)}`,
    );
    const data = await res.json();

    // Check if data is an array and filter for videos
    if (Array.isArray(data)) {
      const filteredVideos = data
        .filter((video) => video.type === "video") // Filter to keep only videos
        .slice(0, 10); // Take the top 10 videos

      // Map the filtered videos to include only the necessary data
      const videosToDisplay = filteredVideos.map((video) => ({
        title: video.title,
        videoId: video.videoId,
        author: video.author,
        url: `https://www.youtube.com/watch?v=${video.videoId}`, // Construct URL
      }));

      setVideos(videosToDisplay as any); // Update state with the top 10 videos
    } else {
      console.error("No items found in the response", data);
      setVideos([]);
    }
  };

  // Fetch Wikipedia articles
  const fetchWikipediaArticles = async (query: any) => {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`,
    );
    const data = await res.json();
    setWikiArticles(data.query.search);
  };

  // Fetch Wikibooks articles
  const fetchWikibooksArticles = async (query: any) => {
    const res = await fetch(
      `https://en.wikibooks.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`,
    );
    const data = await res.json();
    setWikibooksArticles(data.query.search);
  };

  const placeholders = [
    "Version Control",
    "Multivariable Calculus",
    "Philosophy",
    "Notetaking",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!inputValue) return;
    setResponse([]);
    setWikiArticles([]);
    setVideos([]);
    setWikibooksArticles([]);

    await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: inputValue }),
    })
      .then((res) => res.text())
      .then((data) => {
        const jsonData = JSON.parse(data);
        console.log("Final JSON for NetworkGraph:", jsonData); // Log the final JSON here
        setResponse(mapNode(jsonData));
        setIsGraphCreated(true);
      })
      .catch((err) => console.error(err));

    // Fetch YouTube videos, Wikipedia articles, and MathWorld articles
    fetchVideos(inputValue);
    fetchWikipediaArticles(inputValue);
    fetchWikibooksArticles(inputValue);
  };

  const openModal = (videoId: any) => {
    setSelectedVideoId(videoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideoId(null);
    playerRef.current?.destroy();
  };

  useEffect(() => {
    if (isModalOpen && selectedVideoId) {
      const onYouTubeIframeAPIReady = () => {
        // @ts-expect-error
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
        // @ts-expect-error
        if (typeof YT === "undefined") {
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
          document.body.appendChild(script);
        } else {
          onYouTubeIframeAPIReady();
        }
      };

      loadYouTubeAPI();
    }
  }, [isModalOpen, selectedVideoId]);

  const onPlayerStateChange = (event: any) => {
    if (event.data === 0) {
      console.log("Video completed, good job!");
    }
  };

  return (
    <div className="relative">
      <div>
        {isGraphCreated ? (
          <NetworkGraphPreview
            showLessons={false}
            disabled={false}
            data={response}
            edgeBlack={true}
          />
        ) : null}
      </div>
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 top-0 z-10 flex h-screen flex-col items-center justify-center bg-transparent transition duration-500",
          isGraphCreated ? "hidden opacity-0" : "opacity-100",
        )}
      >
        <form onSubmit={handleSubmit}>
          <Field className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              className={clsx(
                "w-[36rem] rounded-xl border-none bg-indigo-50 px-6 py-4 text-2xl text-indigo-800 transition-all placeholder:text-indigo-300 focus:ring-2 focus:ring-indigo-300",
              )}
              placeholder={placeholders[placeholderIndex]}
              autoFocus
              style={{
                transition: "placeholder-color 0.3s ease",
              }}
            />
            <button
              type="submit"
              className={clsx(
                "absolute right-2 top-1/2 -translate-y-1/2 transform rounded-xl border-4 border-indigo-50 bg-indigo-600 text-white transition duration-200 ease-in-out",
                "flex h-[3rem] w-[3rem] items-center justify-center",
                inputValue ? "opacity-100" : "opacity-0",
              )}
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </Field>
        </form>
        {response && (
          <div className="mt-4 text-lg text-indigo-800">
            {JSON.stringify(response)}
          </div>
        )}
        {/* <SearchBar
          onSearch={(q) => {
            fetchVideos(q);
            fetchWikipediaArticles(q);
            fetchWikibooksArticles(q);
          }}
        /> */}
        {/* <div className="mt-6">
          <h2 className="text-lg font-bold text-indigo-600">YouTube Videos</h2>
          {videos.length > 0 ? (
            <ul>
              {videos.map((video) => (
                <li key={video.videoId}>
                  <a
                    href={video.url} // Use constructed URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {video.title} by {video.author}{" "}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-indigo-500">No videos found.</p>
          )}
        </div> */}

        {/* <div className="mt-6">
          <h2 className="text-lg font-bold text-indigo-600">
            Wikipedia Articles
          </h2>
          {wikiArticles.length > 0 ? (
            <ul>
              {wikiArticles.map((article) => (
                <li key={article.pageid}>
                  <a
                    href={`https://en.wikipedia.org/?curid=${article.pageid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-indigo-500">No articles found.</p>
          )}
        </div> */}

        {/* <div className="mt-6">
          <h2 className="text-lg font-bold text-indigo-600">
            Wikibooks Articles
          </h2>
          {wikibooksArticles.length > 0 ? (
            <ul>
              {wikibooksArticles.map((article) => (
                <li key={article.pageid}>
                  <a
                    href={`https://en.wikibooks.org/?curid=${article.pageid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-indigo-500">No articles found.</p>
          )}
        </div> */}

        {/* {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative w-full">
              <button
                onClick={closeModal}
                className="absolute right-2 top-2 text-2xl text-white"
              >
                &times;
              </button>
              <div id="youtube-player" className="h-[90vh] w-full"></div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
