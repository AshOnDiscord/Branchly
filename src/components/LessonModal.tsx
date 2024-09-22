import { NodeData, NodeId } from "@/types/GraphTypes";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import wiki from "wikijs";

export default function LessonModal({
  lesson,
  nodes,
  closeModal,
}: {
  lesson: NodeId;
  nodes: NodeData[];
  closeModal: () => void;
}) {
  const node = nodes.find((n) => n.id === lesson)!;
  const [articles, setArticles] = useState<string[]>([]);
  useEffect(() => {
    wiki()
      .search(node.displayName, 6)
      .then((articles) => {
        setArticles(articles.results);
      });
  }, [lesson]);
  return (
    <>
      <Dialog
        open={true}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={closeModal}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-white/100 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
            >
              <DialogTitle className="text-xl font-bold">
                {node.displayName}
              </DialogTitle>

              <div>
                <h2 className="font-semibold">Articles</h2>
                <ul>
                  {articles.map((article) => (
                    <li key={article}>{article}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p>{node.description}</p>
                <Button className="bg-black/75 text-white" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
