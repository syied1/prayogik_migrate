// @ts-nocheck

import { getServerUserSession } from "@/lib/getServerUserSession";
import Courses from "./_components/home/Courses";
import PrayogikHero from "./_components/home/PrayogikHero";
import Testimonials from "./_components/home/Testimonials";
import WhyChoose from "./_components/home/WhyChoose";
import { Suspense } from "react";
import FeaturedCourses from "./_components/home/FeaturedCourses";
import SkeletonCard from "@/components/SkeletonCard";

// export const revalidate = 3600; // invalidate every hour
// request comes in, at most once every 60 seconds.
// export const revalidate = 60;

// async function fetchCourses() {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Check if the response is successful
//     if (!response.ok) {
//       return;
//     }

//     // If successful, parse and return the JSON response
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     throw error;
//   }
// }

// get courses for home
// const getHomeCourses = async (userId) => {
//   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/front/courses`;
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     });

//     if (!response.ok) {
//       let errorMessage = "Invalid request";
//       try {
//         const errorData = await response.json();
//         errorMessage = errorData.error || errorMessage;
//       } catch (error) {
//         console.error("Error parsing error response:", error);
//       }
//       throw new Error(errorMessage);
//     }

//     const courses = await response.json();
//     return courses;
//   } catch (error) {
//     console.error("Error fetching courses", error);
//     // throw new Error("Error occurred while fetching courses");
//   }
// };

export default async function Page() {
  // const { userId } = await getServerUserSession();
  // const courses = await getHomeCourses(userId);

  return (
    <div>
      <PrayogikHero />
      {/* <Courses courses={courses} /> */}
      <Suspense fallback={<SkeletonCard />}>
        <FeaturedCourses />
      </Suspense>
      <Testimonials />
      {/* <WhyChoose /> */}
    </div>
  );
}
