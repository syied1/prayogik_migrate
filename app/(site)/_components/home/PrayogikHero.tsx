import React from "react";

export default function PrayogikHero() {
  return (
    <div className="grid gap-16">
      <div className="relative flex flex-col justify-center items-center overflow-hidden bg-[#14B8A9] text-center">
        <div className="absolute w-full object-cover">
          <svg
            className="text-white opacity-10 inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1416 460"
            fill="none"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M386 341H210v10h-22v-10H0v-2h188v-10h10V0h2v329h10v10h176v-10h10V0h2v329h10v10h80v-10h10v-74h-10v-22h22v11h154v-11h10V87h-10V65h10V0h2v65h10v9h162v-9h22v22h-9v218h10v11h100v-10h10V149h-10v-22h22v9h195v-10h10V0h2v126h10v10h206v2h-206v10h-10v158h10v10h206v2h-206v10h-10v132h-2V328h-10v-10H993v10h-10v132h-2V328h-10v-10H871v9h-22v-22h10V87h-11V76H686v11h-10v146h10v22h-10v205h-2V255h-10v-9H510v9h-10v74h10v22h-10v109h-2V351h-10v-10h-80v10h-22v-10Zm802-203v10h10v158h-10v10H993v-10h-10V149h10v-11h195Z"
            />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto grid gap-16 text-white p-12 sm:p-32">
          <h2 className="font-heading text-balance font-bold text-3xl md:text-5xl">
            Get started for free, or request a demo to discuss larger projects
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              className="h-fit relative inline-flex gap-2 items-center justify-center font-medium overflow-hidden select-none cursor-pointer outline-none min-h-13 py-2 px-8 rounded text-lg text-light border border-light"
              href="/contact"
            >
              Contact sales
            </a>
            <a
              className="h-fit relative inline-flex gap-2 items-center justify-center font-medium overflow-hidden select-none cursor-pointer outline-none min-h-13 py-2 px-8 rounded text-lg bg-light text-on-light"
              href="/"
            >
              Get started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
