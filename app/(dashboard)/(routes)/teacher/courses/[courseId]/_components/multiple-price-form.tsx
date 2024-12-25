// @ts-nocheck
"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Pencil, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import moment from "moment";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  prices: z.array(
    z.object({
      id: z.string().optional(),
      regularAmount: z.coerce
        .number()
        .min(0, "Regular amount must be positive"),
      discountedAmount: z.coerce.number().optional(),
      duration: z.enum(["1", "NA"]),
      frequency: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]),
      discountExpiresOn: z.date().optional(),
    })
  ),
});

export const MultiplePriceForm = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFreeSelected, setIsFreeSelected] = useState(false);
  const [showDiscountFields, setShowDiscountFields] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0];
  const [prices, setPrices] = useState(
    initialData?.prices?.length
      ? initialData.prices.map((price) => ({
          ...price,
          duration: price.duration === 0 ? "NA" : "1",
          // discountExpiresOn: price?.discountExpiresOn ? price.discountExpiresOn : currentDate,
          // discountExpiresOn: price?.discountExpiresOn
          //   ? price.discountExpiresOn
          //   : null || undefined,
          discountedAmount: null || undefined,
          discountExpiresOn: null || undefined,
        }))
      : [
          {
            regularAmount: 0,
            discountedAmount: null || undefined,
            duration: "1",
            frequency: "YEARLY",
            discountExpiresOn: null || undefined,
          },
        ]
  );

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prices },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prices",
  });

  const { isSubmitting, isValid } = form.formState;

  const updateCoursePrices = async (updatedValues) => {
    try {
      const res = await axios.post(`/api/courses/prices`, updatedValues);
      return res;
    } catch (error) {
      console.error("Error updating prices:", error);
      throw error;
    }
  };

  const deletePriceFromDb = async (priceId) => {
    try {
      console.log("delted id:", priceId);
      await axios.delete(`/api/courses/prices/${priceId}`);
    } catch (error) {
      console.error("Error deleting price:", error);
    }
  };

  const onSubmit = async (values) => {
    if (isFreeSelected) {
      const updatedValuesForFreeCourse = [
        {
          isFree: true,
          regularAmount: 0,
          discountedAmount: null,
          duration: "1",
          frequency: "LIFETIME",
          discountExpiresOn: null,
          courseId: courseId,
        },
      ];
      const existingPrices = await fetchExistingPrices(courseId);

      // Only delete if existing prices are found
      if (existingPrices.length > 0) {
        await deleteAllPricesFromDb(courseId);
      }
      await updateCoursePrices(updatedValuesForFreeCourse);
      toast.success("Course prices updated successfully");
      toggleEdit();

      router.refresh();
      return;
    } else {
      const existingPrices = await fetchExistingPrices(courseId);

      // Only delete if existing prices are found
      if (existingPrices.length > 0) {
        await deleteAllPricesFromDb(courseId);
      }
      const updatedValues = values.prices
        ?.filter((price) => !price.isFree)
        ?.map((price) => ({
          ...price,
          duration: price.duration === "1" ? "1" : "NA",
          courseId,
        }));

      // Identify removed prices based on ID
      const removedPrices = initialData.prices
        .filter(
          (price) => !updatedValues.some((uPrice) => uPrice.id === price.id)
        )
        .map((price) => price.id);

      // Delete removed prices from the database
      for (const priceId of removedPrices) {
        await priceId;
      }

      // Update the remaining prices in the database
      try {
        await updateCoursePrices(updatedValues);
        toast.success("Course prices updated successfully");
        toggleEdit();
        router.refresh();
      } catch (error) {
        toast.error("Failed to update course prices. Please try again.");
      }
    }
  };
  const onFreeCheckedChange = async (checked) => {
    setIsFreeSelected(checked);
    field.onChange(checked);

    // Ensure the form submits correctly when 'Free' is selected
    if (checked) {
      form.setValue("prices", [
        {
          isFree: true,
          regularAmount: 0,
          discountedAmount: null,
          duration: "1",
          frequency: "LIFETIME",
          discountExpiresOn: null,
          courseId: courseId,
        },
      ]);
    } else {
      // Reset values if 'Free' is unchecked
      form.setValue("prices", initialData?.prices || []);
    }
  };

  const deleteAllPricesFromDb = async (courseId) => {
    try {
      const response = await axios.delete(
        `/api/courses/prices?courseId=${courseId}`
      );
      if (response.status === 204) {
        // toast.success(
        //   "All prices removed successfully. The course is now free."
        // );
      }
    } catch (error) {
      console.error("Error deleting all prices:", error);
    }
  };
  // Function to fetch existing prices for a given course ID
  const fetchExistingPrices = async (courseId) => {
    try {
      const response = await axios.get(
        `/api/courses/prices?courseId=${courseId}`
      );
      return response.data; // Assume response.data contains an array of prices
    } catch (error) {
      console.error("Error fetching existing prices:", error);
      return [];
    }
  };
  useEffect(() => {
    if (initialData?.prices[0]?.isFree) {
      setIsFreeSelected(true);
    }
  }, [initialData]);

  // Whenever prices change, update showDiscountFields array
  useEffect(() => {
    setShowDiscountFields(new Array(prices.length).fill(false));
  }, [prices]);

  // Toggle the discount fields for the specified index
  const toggleDiscountField = (index) => {
    setShowDiscountFields((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course prices
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit prices
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div>
          <div className="max-w-lg flex flex-col">
            {initialData?.prices?.length ? (
              initialData?.prices[0]?.isFree ? (
                <p>Free</p>
              ) : (
                initialData.prices.map((price, index) => (
                  <div
                    key={index}
                    className="bg-white flex justify-between p-2 border border-gray-200 rounded-md mb-2"
                  >
                    {price.discountedAmount ? (
                      <div>
                        <span className="text-base">
                          ৳ {price.discountedAmount}{" "}
                        </span>
                        {price.discountedAmount && (
                          <span className="line-through text-sm text-gray-600">
                            {price.regularAmount}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="">
                        <span className="text-base">
                          ৳ {price.regularAmount}{" "}
                        </span>
                      </div>
                    )}

                    {!price.isFree && (
                      <div>
                        <span className="text-sm">
                          {/*
                        {price.duration === "NA" && price.frequency === "LIFETIME"
                          ? ""
                        : `${price.duration} `}
                      */}

                          {price.frequency === "LIFETIME"
                            ? "Lifetime"
                            : price.frequency === "YEARLY"
                            ? "Yearly"
                            : "Monthly"}
                        </span>
                      </div>
                    )}
                    {price.discountExpiresOn && (
                      <div>
                        <p className="text-sm text-gray-600">
                          Offer expires on{" "}
                          <span className="text-gray-900">
                            {moment(price.discountExpiresOn).format(
                              "MMM Do YYYY"
                            )}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )
            ) : (
              <p className="text-slate-500 italic">No prices set</p>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={isFreeSelected}
                      onCheckedChange={async (checked) => {
                        field.onChange(checked);
                        setIsFreeSelected(checked);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this course free
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {!isFreeSelected &&
              fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <div className="flex flex-wrap items-start sm:items-end space-y-3 first:space-y-0 gap-3">
                    {/* Frequency */}
                    <FormField
                      control={form.control}
                      name={`prices.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-[120px]">
                          {index === 0 && (
                            <FormLabel className="text-gray-700 text-sm">
                              Frequency
                            </FormLabel>
                          )}
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                              <SelectItem value="YEARLY">Yearly</SelectItem>
                              <SelectItem value="LIFETIME">Lifetime</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Duration */}
                    <FormField
                      control={form.control}
                      name={`prices.${index}.duration`}
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-[120px]">
                          {index === 0 && (
                            <FormLabel className="text-gray-700 text-sm">
                              Duration
                            </FormLabel>
                          )}
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="NA">NA</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Regular Price */}
                    <FormField
                      control={form.control}
                      name={`prices.${index}.regularAmount`}
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-[120px]">
                          {index === 0 && (
                            <FormLabel className="text-gray-700 text-sm">
                              Regular Price
                            </FormLabel>
                          )}

                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              placeholder="regular"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Conditionally Render Discount Fields */}
                    {/* Discount Button */}

                    {showDiscountFields[index] && (
                      <>
                        {/* Discounted Price */}
                        <FormField
                          control={form.control}
                          name={`prices.${index}.discountedAmount`}
                          render={({ field }) => (
                            <FormItem className="w-full sm:w-[120px]">
                              {index === 0 && (
                                <FormLabel className="text-gray-700 text-sm">
                                  Discounted Price
                                </FormLabel>
                              )}

                              <FormControl>
                                <Input
                                  type="number"
                                  step="1"
                                  placeholder="discounted"
                                  disabled={isSubmitting}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Discount expires on */}
                        <FormField
                          control={form.control}
                          name={`prices.${index}.discountExpiresOn`}
                          render={({ field }) => (
                            <FormItem className="w-full sm:w-[150px] flex flex-col">
                              {index === 0 && (
                                <FormLabel className="text-gray-700 text-sm">
                                  Discount Expired On
                                </FormLabel>
                              )}

                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline">
                                    {field.value
                                      ? format(field.value, "MMM dd, yyyy")
                                      : "Pick a date"}
                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                      field.onChange(date);
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    <div className="flex items-center">
                      <Button
                        type="button"
                        onClick={() => {
                          toggleDiscountField(index);
                          form.setValue(
                            `prices.${index}.discountedAmount`,
                            undefined
                          ); // Reset discountedAmount
                          form.setValue(
                            `prices.${index}.discountExpiresOn`,
                            undefined
                          ); // Reset discountExpiresOn
                        }}
                        variant="outline"
                      >
                        {showDiscountFields[index]
                          ? "Remove Discount"
                          : "Add Discount"}
                      </Button>
                    </div>

                    <div
                      className={`flex mt-2 sm:mt-0 flex-row sm:flex-col gap-1 w-full sm:w-auto justify-end sm:items-end  h-auto`}
                    >
                      {/* Remove Price Button */}
                      {fields.length > 1 && index > 0 && (
                        <Button
                          // className={`${
                          //   index !== 0 ? "w-10 px-0 sm:px-2 sm:h-4" : "w-10 px-0"
                          // } ${fields.length === 1 && "cursor-not-allowed"}`}
                          className={`w-10 px-0`}
                          type="button"
                          variant="outline"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1 || isSubmitting}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Add Price Button */}
                      {fields.length >= 1 && index === 0 && (
                        <Button
                          className={`${
                            index !== 0
                              ? "w-10 px-0 sm:px-2 sm:h-4"
                              : "w-10 px-0"
                          } `}
                          type="button"
                          onClick={() =>
                            append({
                              frequency: "YEARLY",
                              duration: "1",
                              regularAmount: undefined,
                              discountedAmount: undefined,
                              discountExpiresOn: undefined,
                            })
                          }
                          disabled={isSubmitting}
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            <div className="flex justify-start">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
