import { User } from "@propelauth/nextjs/client";

// account creation function - client side
const SetupUser = async (user: User) => {
  await fetch("/api/db/setupUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.userId,
      email: user.email,
    }),
  });
};
