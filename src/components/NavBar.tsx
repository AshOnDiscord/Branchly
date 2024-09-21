"use client";
import {
  HomeIcon,
  BookOpenIcon,
  BookmarkIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { createRef, useState } from "react";

const navigation = [
  { name: "Home", icon: HomeIcon, href: "/" },
  { name: "Discover", icon: BookOpenIcon, href: "/discover" },
  {
    name: "Saved",
    icon: BookmarkIcon,
    href: "/saved",
  },
  { name: "Create", icon: PlusCircleIcon, href: "/create" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function SideBar() {
  // const pathname = usePathname();
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="bg-indigo-700">
      <div className="sticky top-0 flex min-h-screen flex-1 flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
              alt="skillink"
            />
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2" aria-label="Sidebar">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.href === pathname
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                )}
              >
                <item.icon
                  className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                  aria-hidden="true"
                />
                <span className="flex-1">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-indigo-800 p-4">
          <a href="#" className="group block w-full flex-shrink-0">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Profile</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
