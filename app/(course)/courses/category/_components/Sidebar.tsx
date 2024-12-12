// @ts-nocheck

import { CategoryItem } from "@/app/(dashboard)/(routes)/search/_components/category-item";

export default function Sidebar({
  items = [],
}: {
  items?: Array<{ id: string; name: string }>;
}) {
  // Check if items is an array
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="w-full md:w-1/6 md:mb-0">
      <div>
        {/* category */}
        <h2 className="font-bold text-lg mb-2 sm:mb-4">ক্যাটাগরি</h2>
        <ul className="flex gap-1 sm:gap-0 sm:flex-col">
          {[{ id: "all", name: "All" }, ...safeItems].map((item) => (
            <li
              key={item.id} // Use item.id instead of index for better key management
              className="border rounded-md sm:border-0 text-sm px-2 sm:text-base sm:px-0 sm:mb-2"
            >
              <CategoryItem label={item.name} value={item.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
