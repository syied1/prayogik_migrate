// @ts-nocheck

import { StarFilledIcon } from "@radix-ui/react-icons";
import { User2, Users2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RelatedCourse({ courses }) {
  const rating = 4.5; // rating comes from database

  return (
    <div className="my-12">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Related Courses</h1>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 border h-[100px]">
          <p>No related courses found at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((item, index) => (
            <Link key={index} href={`/courses/${item.slug}`}>
              <div className="bg-white border hover:shadow border-gray-200 rounded-lg flex items-center p-4 gap-4 transition">
                <Image
                  src={item.imageUrl}
                  alt={`Course ${index + 1}`}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover"
                  priority={index === 0} // Prioritize the first image for faster loading
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.hours || "24 total hours"} • Updated:{" "}
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center mt-2 text-yellow-500 text-sm">
                    {[...Array(Math.round(rating))].map((_, i) => (
                      <StarFilledIcon key={i} />
                    ))}
                    <span className="ml-2 text-gray-600">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {item.prices.length > 0 ? (
                    <>
                      <div className="text-lg font-bold text-gray-800">
                        Discount Price: $
                        {item.prices[0].discountedAmount ||
                          item.prices[0].regularAmount}
                      </div>
                      {item.prices[0].discountedAmount && (
                        <div className="text-sm  text-gray-400">
                          Regular price:
                          <span className="line-through">
                            {" "}
                            ${item.prices[0].regularAmount}
                          </span>
                        </div>
                      )}
                      {item.prices[0].discountExpiresOn && (
                        <div className="text-sm text-red-500 mt-2">
                          Discount expires on:{" "}
                          {new Date(
                            item.prices[0].discountExpiresOn
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Price not available
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
