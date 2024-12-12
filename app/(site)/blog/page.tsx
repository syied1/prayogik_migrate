import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="py-16">
      <div className="bg-white min-h-[30vh] rounded-md border border-gray-100 shadow-sm mx-auto flex max-w-7xl items-start justify-between gap-x-6 p-6 lg:px-8">
        <h1 className="mt-2 text-3xl md:text-3xl font-bold mb-[30px]">ব্লগ</h1>
        {/* Content */}
        <div className="space-y-[30px]">{/* content */}</div>
      </div>
    </div>
  );
}
