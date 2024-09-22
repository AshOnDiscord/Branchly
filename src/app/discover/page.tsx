import BranchCard from "@/components/BranchCard";
import Graph from "@/models/Graph";
import { getUserOrRedirect } from "@propelauth/nextjs/server/app-router";

export default async function Discover() {
  const graphs: Graph[] = await (
    await fetch("http://localhost:3000/api/db/getGraphs", { cache: "no-store" })
  ).json();

  // const publicGraphs = graphs;
  const publicGraphs = graphs.filter((graph) => graph.published);

  const user = await getUserOrRedirect();

  const userData = await (
    await fetch("http://localhost:3000/api/db/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        email: user.email,
      }),
    })
  ).json();

  console.log(user, userData);

  return (
    <main className="flex h-full flex-col gap-4 bg-indigo-50 px-12 py-8">
      <div>
        <h1 className="pb-2 text-2xl font-semibold">Discover</h1>
      </div>
      <div className="grid auto-rows-max grid-cols-3 gap-8">
        {publicGraphs.map((graph) => (
          <BranchCard key={graph.id} graph={graph} discovering={true} />
        ))}
      </div>
    </main>
  );
}
