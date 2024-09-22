"use client";
import Graph from "@/models/Graph";
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/20/solid";
import { BookmarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useUser } from "@propelauth/nextjs/client";
import clsx from "clsx";
import Image from "next/image";

export default function BranchCard({
  graph,
  discovering,
}: {
  graph: Graph;
  discovering: boolean;
}) {
  const publish = () => {
    fetch("/api/db/publishGraph", {
      method: "POST",
      body: JSON.stringify({
        graphId: graph._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        alert("Graph published successfully");
      } else {
        alert("Graph publish failed");
      }
    });
  };

  const subscribe = () => {
    fetch("/api/db/subscribeGraph", {
      method: "POST",
      body: JSON.stringify({
        graphId: graph._id,
        userId: user.userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        alert("Graph added successfully");
      } else {
        alert("Graph subscription failed");
      }
    });
  };

  const user = useUser().user!;
  const addGraph = () => {
    fetch("/api/db/personalMerge", {
      method: "POST",
      body: JSON.stringify({
        graph: graph._id,
        userId: user.userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        alert("Graph added successfully");
      } else {
        alert("Graph add failed");
      }
    });
  };

  return (
    <div className="grid h-96 max-h-96 grid-rows-[1fr,max-content,max-content] gap-4 rounded-lg bg-white p-4 shadow">
      <div className="flex items-center justify-center overflow-hidden rounded border border-indigo-50">
        {graph.preview && (
          <Image
            src={graph.preview}
            className="h-full w-full object-cover"
            alt="Graph Preview"
            width={800}
            height={450}
          />
        )}
      </div>

      <div className="h-[calc(1.5rem+2.5rem)] overflow-hidden">
        <div className="flex">
          <h1 className="text line-clamp-1 font-semibold">{graph.name}</h1>
          <p className="whitespace-pre">{" by "}</p>
          <h2>{graph.authorEmail}</h2>{" "}
          {/* make sure to later map to author name */}
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">
          {graph.description}
        </p>
      </div>
      <div
        className={clsx(
          "grid grid-cols-2 gap-2",
          "*:flex *:items-center *:justify-center *:gap-1 *:rounded *:border *:border-indigo-50 *:bg-white *:px-3 *:py-1 *:transition",
          "hover:*:bg-indigo-500 hover:*:text-white focus:*:outline-none focus:*:ring-2 focus:*:ring-indigo-500 focus:*:ring-offset-1",
        )}
      >
        <button onClick={addGraph}>
          <PlusIcon className="h-4 w-4" />
          Add
        </button>
        {discovering ? (
          <button onClick={subscribe}>
            <BookmarkIcon className="h-4 w-4" />
            Save
          </button>
        ) : user ? (
          graph.author === user.userId ? (
            <button onClick={publish}>
              <ArrowUpTrayIcon className="h-4 w-4" />
              Publish
            </button>
          ) : (
            <button onClick={subscribe}>
              <TrashIcon className="h-4 w-4" />
              Remove
            </button>
          )
        ) : (
          <button>
            <TrashIcon className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
