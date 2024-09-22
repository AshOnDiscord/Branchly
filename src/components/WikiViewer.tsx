"use client";
import { useEffect, useRef, useState } from "react";
import wiki from "wikijs";

export default function WikiViewer(props: {
  apiUrl?: string;
  pageNumber: number;
  finished: () => void;
}) {
  const fetch = async () => {
    (
      wiki({
        apiUrl: props.apiUrl ?? `https://en.wikipedia.org/w/api.php`,
      }) as any
    )
      .findById(props.pageNumber)
      .then((page: any) => {
        setPage(page);
        console.log(page);

        // Get title
        setTitle(page.title);
        updateProgress();

        // Get image
        page.mainImage().then((image: string) => {
          console.log(image);
          setImage(image);
          updateProgress();
        });

        // Get summary
        page.summary().then((summary: string) => {
          console.log(summary);
          setSummary(summary);
          updateProgress();
        });

        // Get and process HTML
        page.html().then((html: string) => {
          console.log(html);
          setHtml(html);
          updateProgress();
        });
      });
  };
  const [pageNumber, setPageTitle] = useState(props.pageNumber);
  const [page, setPage] = useState(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [html, setHtml] = useState("");
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const progressTrack = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const contentWrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageNumber) {
      fetch();
    }
  }, [pageNumber]);

  const onscroll = (e: any) => updateProgress();
  const updateProgress = () => {
    const currY = contentWrapper.current!.scrollTop;
    const postHeight = contentWrapper.current!.clientHeight;
    const scrollHeight = content.current!.scrollHeight;
    const scrollPercent = (currY / (scrollHeight - postHeight)) * 100;
    setScrollPercentage(scrollPercent);

    progressBar.current!.style.width = scrollPercent + "%";
    console.log(scrollPercent, currY, postHeight, scrollHeight);
    if (scrollPercent > 80 && page && title && summary && image && html) {
      props.finished();
    }
  };

  return (
    <div
      className="h-screen overflow-scroll"
      onScroll={onscroll}
      ref={contentWrapper}
    >
      <div className="flex flex-col items-center justify-center" ref={content}>
        <div className="sticky top-0 w-full" ref={progressTrack}>
          <div className="h-2 bg-purple-500 transition" ref={progressBar} />
        </div>
        <div className="prose w-[min(65ch,100%)] py-8">
          {title ? <h1>{title}</h1> : <h1>Loading...</h1>}
          {summary ? (
            <div dangerouslySetInnerHTML={{ __html: summary }}></div>
          ) : (
            <div className="h-32 w-full bg-purple-300/50"></div>
          )}
          {image ? (
            <img src={image} alt="" />
          ) : (
            <div className="h-32 w-full bg-purple-300/50"></div>
          )}
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
          ) : (
            <div className="h-32 w-full bg-purple-300/50"></div>
          )}
        </div>
      </div>
    </div>
  );
}
