// @ts-nocheck
import React from "react";
import Hero from "./hero";
import Sidebar from "./sidebar";

export default function LayoutWrapper({ children, hasCourseAccess }) {
  return (
    <div>
      {/* slug hero */}
      <Hero />
      {/* slug content */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            <main className="min-h-screen">{children}</main>
          </div>
          <div className="flex-initial w-full lg:w-96 z-10">
            {/* <div className="h-full w-full lg:-mt-[380px] bg-white border border-gray-200 shadow-sm p-4 lg:p-8"> */}
            {/* call sidebar */}
            <div className="sticky top-4 min-h-max w-full lg:-mt-[350px] bg-white  shadow-lg">
              <Sidebar />
              {/* sidebar */}
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
