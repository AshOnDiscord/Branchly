import { getUserOrRedirect } from "@propelauth/nextjs/server/app-router";
import HomePage from "./homePage";

export default async function Page() {
  const user = await getUserOrRedirect();
  console.log(user);

  return <HomePage />;
}
