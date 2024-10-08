import type { Metadata } from "next";
import { AuthProvider } from "@propelauth/nextjs/client";
import "./globals.css";
import SideBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "branchly",
  description: "Map your learning!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider authUrl={process.env.NEXT_PUBLIC_AUTH_URL!}>
        <body>
          <div className="gradient-background grid min-h-screen grid-cols-[max-content,auto]">
            <SideBar />
            <main className="">{children}</main>
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
