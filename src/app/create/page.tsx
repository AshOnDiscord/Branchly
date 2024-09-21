"use client";
import { Field, Input } from "@headlessui/react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import NetworkGraph from "@/components/Graph/NetworkGraph";
import SearchBar from "@/components/SearchBar";

export default function CreatePage() {
  const [inputValue, setInputValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const playerRef = useRef(null);

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
    setResponse("");
    await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: inputValue }),
    })
      .then((res) => res.text())
      .then((data) => setResponse(data))
      .catch((err) => console.error(err));
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
    // Event 0 means the video has ended
    if (event.data === 0) {
      console.log("Video completed, good job!"); // Log message
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
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
        <div className="mt-4 text-lg text-indigo-800">{response}</div>
      )}
      <NetworkGraph showLessons={true} />;
      <SearchBar onSearch={fetchVideos} />
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
  );
}
