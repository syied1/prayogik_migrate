"use client";

import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface RatingFormProps {
  courseId: string;
  userId: string;
}

const RatingForm: React.FC<RatingFormProps> = ({ courseId, userId }) => {
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch existing rating when the component mounts
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          `/api/courses/ratings?courseId=${courseId}&userId=${userId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error fetching rating");
        }
        const ratingData = await response.json();
        if (ratingData) {
          setRatingValue(ratingData.value); // Pre-set the rating value
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch existing rating");
      }
    };

    fetchRating();
  }, [courseId, userId]);

  // Function to handle submitting the rating
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    if (ratingValue < 1 || ratingValue > 5) {
      setError("Rating must be between 1 and 5!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/courses/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: ratingValue,
          courseId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error submitting rating");
      }

      setSuccessMessage("Rating submitted successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle rating click
  const handleRatingClick = (value: number) => {
    setRatingValue(value); // Set the rating value when a star is clicked
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <h1 className="text-2xl font-bold mb-4">Rate this Course</h1>
      <div className="flex flex-row items-center gap-5">
        <div className="flex gap-3 cursor-pointer">
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              onClick={() => handleRatingClick(value)}
              aria-label={`Rate ${value} stars`}
              style={{
                fontSize: "24px",
                color: value <= ratingValue ? "gold" : "gray",
              }}
            >
              ★
            </span>
          ))}
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <Button disabled={loading || ratingValue === 0} type="submit">
              {loading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                "Submit Rating"
              )}
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && (
              <p style={{ color: "green" }}>{successMessage}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default RatingForm;
