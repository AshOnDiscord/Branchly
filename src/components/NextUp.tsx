import { NodeStatus, type NodeData } from "@/types/GraphTypes";

interface Lesson {
  course: string;
  lesson: string;
  progress: number;
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
  const lessons: Lesson[] = props.nodeData
    .filter((node) => {
      return node.status === NodeStatus.IN_PROGRESS;
    })
    .map((node) => {
      return {
        course: `Course ${node.groupID}`,
        lesson: node.displayName,
        progress: node.progress,
      };
    });
  console.log(lessons, "LESSONS");
  return (
    <div className="fixed bottom-8 right-8 flex w-64 flex-col gap-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="font-semibold">Next Up</h1>
      <ul className="flex flex-col gap-4">
        {lessons.map((lesson) => (
          <li key={lesson.course + lesson.lesson}>
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
        ))}
      </ul>
    </div>
  );
}
