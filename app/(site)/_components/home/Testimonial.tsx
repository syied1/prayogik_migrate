//@ts-nocheck
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Testimonial({ item, key }) {
  return (
    <Card
      key={key}
      className="px-5 py-4 mx-3 rounded-2xl mt-20 bg-gradient-to-t from-[#097568] to-[#01524D] text-white "
    >
      <CardContent className="mt-5">{item.details}</CardContent>
      <div className="flex items-center gap-4 mt-3">
        <Image
          width={50}
          height={50}
          src={item.img}
          className=" rounded-full"
          alt="testimonial image"
          priority
        />
        <div>
          <p className="font-bold">{item.name}</p>
          <p>{item.designation}</p>
        </div>
      </div>
    </Card>
  );
}
