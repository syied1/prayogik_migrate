"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Input } from "@/components/ui/input";

export const SearchInput = () => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  const onChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        onChange={onChange}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};
