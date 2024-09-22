import { getUserOrRedirect } from "@propelauth/nextjs/server/app-router";
import dynamic from "next/dynamic";

const CreatePage = dynamic(() => import("./createPage"), {
  ssr: false,
});

export default async function Discover() {
  const user = await getUserOrRedirect();

  const userData = await (
    await fetch("https://branchly-b3xd.vercel.app//api/db/getUser", {
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

  return <CreatePage />;
}
