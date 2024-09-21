"use client";
import {
  HomeIcon,
  BookOpenIcon,
  BookmarkIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
    <div className="bg-purple-800">
      <div className="sticky top-0 flex min-h-screen min-w-48 flex-1 flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Image
              className="h-12 w-auto pr-10"
              width={64}
              height={64}
              src="/logos/branchly-export.svg"
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
                    ? "bg-purple-600 text-white"
                    : "text-neutral-50 hover:bg-purple-500 hover:bg-opacity-75",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                )}
              >
                <item.icon
                  className="mr-3 h-6 w-6 flex-shrink-0 text-purple-300"
                  aria-hidden="true"
                />
                <span className="flex-1">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-purple-500 p-4">
          <a href="#" className="group block w-full flex-shrink-0">
            <div className="flex items-center">
              <div>
                <Image
                  className="inline-block h-9 w-9 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  width={36}
                  height={36}
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
