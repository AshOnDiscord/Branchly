"use client";
import { Field, Input } from "@headlessui/react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import NetworkGraphPreview from "@/components/Graph/NetworkGraph";
import SearchBar from "@/components/SearchBar";
import { NodeData, PartialNode } from "@/types/GraphTypes";
import { mapNode } from "@/components/Graph/data/nodes";
import axios from "axios";
import * as cheerio from "cheerio";

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
  const playerRef = useRef(null);

  // Fetch YouTube videos
  const fetchVideos = async (query) => {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&key=${API_KEY}`,
    );
    const data = await res.json();
    const filteredVideos = data.items.filter(
      (video) => video.id.kind === "youtube#video",
    );
    setVideos(filteredVideos);
  };

  // Fetch Wikipedia articles
  const fetchWikipediaArticles = async (query) => {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`,
    );
    const data = await res.json();
    setWikiArticles(data.query.search);
  };

  // Fetch Wikibooks articles
  const fetchWikibooksArticles = async (query) => {
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

  const handleSubmit = async (e) => {
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

  const openModal = (videoId) => {
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
  }, [isModalOpen, selectedVideoId]);

  const onPlayerStateChange = (event) => {
    if (event.data === 0) {
      console.log("Video completed, good job!");
    }
  };

  return (
    <div className="relative">
      <div>
        {isGraphCreated ? (
          <NetworkGraphPreview showLessons={false} nodeDatas={response} />
        ) : null}
      </div>
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 top-0 z-10 flex h-screen flex-col items-center justify-center bg-white transition duration-500",
          isGraphCreated ? "opacity-0" : "opacity-100",
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
        <SearchBar
          onSearch={(q) => {
            fetchVideos(q);
            fetchWikipediaArticles(q);
            fetchWikibooksArticles(q);
          }}
        />
        <div className="mt-6">
          <h2 className="text-lg font-bold text-indigo-600">YouTube Videos</h2>
          <ul>
            {videos.map((video) => {
              const videoId = video.id.videoId;
              return (
                <li key={videoId}>
                  <button
                    onClick={() => openModal(videoId)}
                    className="text-indigo-600 hover:underline"
                  >
                    {video.snippet.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-6">
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
        </div>

        <div className="mt-6">
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
        </div>

        {isModalOpen && (
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
        )}
      </div>
    </div>
  );
}
