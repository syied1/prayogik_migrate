// components/AverageRating.tsx
"use client";
import { useEffect, useState } from "react";

interface AverageRatingProps {
  courseId: string;
}

const AverageRating: React.FC<AverageRatingProps> = ({ courseId }) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState<number | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(
          `/api/courses/ratings/averageRating?courseId=${courseId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error fetching average rating");
        }

        const data = await response.json();
        setAverageRating(data.averageRating);
        setRatingsCount(data.ratingsCount);
        setEnrolledStudents(data.enrolledStudents);
      } catch (err: any) {
        setError(err.message || "Failed to fetch average rating");
      } finally {
        setLoading(false);
      }
    };

    fetchAverageRating();
  }, [courseId]);

  if (loading) {
    return <p className="text-white">Loading average rating...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // Create stars based on the average rating
  const fullStars = Math.floor(averageRating || 0);
  const halfStar = averageRating && averageRating % 1 !== 0 ? 1 : 0; // One half star if there's a decimal part
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center text-white">
      <h2 className="text-lg font-bold mr-2">
        {averageRating?.toFixed(1) || "N/A"}
      </h2>
      {/* Render stars */}
      <div className="flex">
        {[...Array(fullStars)].map((_, index) => (
          <span key={index} style={{ color: "gold", fontSize: "20px" }}>
            ★
          </span>
        ))}
        {halfStar === 1 && (
          <span style={{ color: "gold", fontSize: "20px" }}>☆</span> // Half star
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <span
            key={`empty-${fullStars + halfStar + index}`}
            style={{ color: "gray", fontSize: "20px" }}
          >
            ★
          </span>
        ))}
      </div>
      {/* Ratings count and enrolled students */}
      <span className="ml-2 ">
        <span className="underline text-yellow-300">
          ({ratingsCount ?? 0} ratings)
        </span>{" "}
        {enrolledStudents ?? 0} students
      </span>
    </div>
  );
};

export default AverageRating;
