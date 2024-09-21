import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/20/solid";

export default function SkillCard() {
  return (
    <div className="grid h-96 max-h-96 grid-rows-[1fr,max-content,max-content] gap-4 rounded-lg bg-white p-4 shadow">
      <div className="rounded border border-indigo-50"></div>

      <div className="h-[calc(1.5rem+2.5rem)] overflow-hidden">
        <h1 className="text line-clamp-1">Lorem, ipsum dolor.</h1>
        <p className="line-clamp-2 text-sm text-slate-600">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil veniam
          cum eum dolorum rerum doloremque ipsa iure accusantium, tempora
          laudantium.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-1 rounded border border-indigo-50 bg-white px-3 py-1 transition hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
          <PlusIcon className="h-4 w-4" />
          Add
        </button>
        <button className="flex items-center justify-center gap-1 rounded border border-indigo-50 bg-white px-3 py-1 transition hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
          <ArrowUpTrayIcon className="h-4 w-4" />
          Publish
        </button>
      </div>
    </div>
  );
}
