import { NodeStatus, type NodeData } from "@/types/GraphTypes";
import { useSigma } from "@react-sigma/core";
import { useEffect, useState } from "react";

interface Lesson {
  course: string;
  lesson: string;
  progress: number;
  node: NodeData;
}

// const lessons: {
//   course: string; // Course name
//   lesson: string; // Lesson name
//   progress: number; // 0-1
// }[] = [
//   {
//     course: "Version Control",
//     lesson: "Introduction to Git",
//     progress: 0.75,
//   },
//   {
//     course: "Multivariable Calculus",
//     lesson: "Partial Derivatives",
//     progress: 0.25,
//   },
//   {
//     course: "Philosophy",
//     lesson: "Existentialism",
//     progress: 0.5,
//   },
//   {
//     course: "Notetaking",
//     lesson: "Cornell Method",
//     progress: 0.1,
//   },
// ];

export default function NextUp(props: { nodeData: NodeData[] }) {
  const lessons: Lesson[] = props.nodeData.map((node) => {
    return {
      course: `Course ${node.groupID}`,
      lesson: node.displayName,
      progress: node.progress,
      node: node,
    };
  });
  const [currentlyUpdated, setCurrentlyUpdated] = useState(0);
  useEffect(() => {
    const a = () => {
      setCurrentlyUpdated((prev) => prev + 1);
      requestAnimationFrame(a);
    };
    a();
  }, []);
  return (
    <div className="fixed bottom-8 right-8 flex max-h-[36rem] w-64 flex-col gap-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="font-semibold">Next Up</h1>
      <ul className="flex flex-col gap-4 overflow-scroll">
        {lessons.map((lesson) =>
          lesson.node.status !== NodeStatus.IN_PROGRESS ? null : (
            <li key={lesson.course + lesson.lesson + currentlyUpdated}>
              <button className="grid-auto-max grid w-full overflow-hidden rounded border border-slate-200 text-left transition hover:ring-2 hover:!ring-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 active:bg-indigo-50/50">
                <div className="p-2">
                  <h2 className="text-sm text-slate-600">{lesson.course}</h2>
                  <p>{lesson.lesson}</p>
                </div>
                <div className="h-1">
                  <div
                    style={{ width: `${lesson.progress * 100}%` }}
                    className="h-full bg-indigo-500"
                  ></div>
                </div>
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
