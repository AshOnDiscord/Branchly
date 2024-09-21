"use client";

import { Field, Input } from "@headlessui/react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState, useEffect } from "react";

export default function CreatePage() {
  const [inputValue, setInputValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "Version Control",
    "Multivariable Calculus",
    "Philosophy",
    "Notetaking",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <Field className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={clsx(
            "w-[36rem] rounded-xl border-none bg-indigo-50 px-6 py-4 text-2xl text-indigo-800 transition-all placeholder:text-indigo-300 focus:ring-2 focus:ring-indigo-300",
          )}
          placeholder={placeholders[placeholderIndex]}
          autoFocus
          style={{
            transition: "placeholder-color 0.3s ease",
          }}
        />
        {
          <button
            className={clsx(
              "absolute right-2 top-1/2 -translate-y-1/2 transform rounded-xl border-4 border-indigo-50 bg-indigo-600 text-white transition duration-200 ease-in-out",
              "flex h-[3rem] w-[3rem] items-center justify-center", // Set width and height
              inputValue ? "opacity-100" : "opacity-0",
            )}
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        }
      </Field>
    </div>
  );
}
