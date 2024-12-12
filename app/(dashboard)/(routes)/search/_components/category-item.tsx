"use client";

import qs from "query-string";
import { IconType } from "react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
}

export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  // const isSelected = currentCategoryId === value;
  const isSelected =
    currentCategoryId === value || (value === "all" && !currentCategoryId);

  const onClick = () => {
    const query =
      value !== "all"
        ? {
            title: currentTitle,
            categoryId: isSelected ? null : value,
            page: 1,
          }
        : { page: 1 };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    console.log("category item:", url);
    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1 text-sm rounded-full flex items-center hover:border-teal-700 transition border border-gray-200",
        isSelected && "text-teal-600 font-bold"
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};
