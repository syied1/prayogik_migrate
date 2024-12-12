// @ts-nocheck

"use client";
import { useState } from "react";
import CheckoutButton from "@/components/checkoutButton/checkoutButton";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroup } from "@radix-ui/react-radio-group";
import moment from "moment";

export default function SingleCoursePrice({ course, access, userId }) {
  const [selectedPrice, setSelectedPrice] = useState(course.prices[0].id);

  const handleValueChange = (value) => {
    setSelectedPrice(value); // Update selected price in state
  };

  const isDiscountExpired = (expiresAt) => {
    const currentDate = new Date();
    const discountExpiryDate = new Date(expiresAt);
    return currentDate.getTime() > discountExpiryDate.getTime();
  };
  // console.log("user id  from single-course-price", userId);
  return (
    <div>
      <div>
        <RadioGroup onValueChange={handleValueChange} value={selectedPrice}>
          {course.prices.map((price) => (
            <div
              key={price.id}
              className="flex items-start space-x-2 gap-2 border border-gray-200 rounded-md mb-2 p-2 cursor-pointer"
            >
              <RadioGroupItem value={price.id} id={price.id} />{" "}
              {/* show offer according to offere expires date */}
              {isDiscountExpired(price?.discountExpiresOn) ? (
                <Label
                  className="w-full flex flex-col items-start gap-1 cursor-pointer"
                  htmlFor={price.id}
                >
                  <div className="flex gap-1 items-center">
                    <div className="flex gap-1 items-center">
                      <span>৳ {price.regularAmount}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {" / "}
                      {price.frequency.toLowerCase()}
                    </span>
                  </div>
                </Label>
              ) : (
                <Label
                  className="w-full flex flex-col items-start gap-1 cursor-pointer"
                  htmlFor={price.id}
                >
                  <div className="flex gap-1 items-center">
                    <div className="flex gap-1 items-center">
                      <span>৳ {price.discountedAmount}</span>
                      <span className="text-sm text-gray-500 line-through">
                        {price.regularAmount}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {" / "}
                      {price.frequency.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex gap-1 text-xs">
                    <span className="text-gray-500">offer expires on:</span>
                    <span>
                      {moment(price.discountExpiresOn).format("MMM Do YYYY")}
                    </span>
                  </div>
                </Label>
              )}
            </div>
          ))}
        </RadioGroup>

        {/* TODO: Add a checkbox with agreement of terms condition and privacy policy and enable checkout button if checked */}

        <CheckoutButton
          userId={userId}
          courseId={course.id}
          priceId={selectedPrice}
          checked={true} // TODO: checked comes from - agree to privacy policy and terms condition
        />
      </div>
      <p className="text-center text-xs text-gray-700 mb-2">
        30-Day Money-Back Guarantee
      </p>
      <p className="text-center text-xs text-gray-700">Full Lifetime Access</p>
    </div>
  );
}
