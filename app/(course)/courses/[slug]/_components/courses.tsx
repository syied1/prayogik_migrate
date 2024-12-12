// @ts-nocheck
import Hero from "./hero";
import WhatYouLearn from "./what-you-learn";
import CourseLesson from "./course-lesson";
import CourseDetails from "./course-details";
import Requirements from "./requirements";
import Review from "./review";
import RelatedCourse from "./related-course";
import MoreCourses from "./more-course";
import AuthorBio from "./author-bio";

export default function Courses() {
  return (
    <div className="">
      {/* <Hero /> */}
      <WhatYouLearn />
      <CourseDetails />
      <CourseLesson />
      <Requirements />
      <RelatedCourse />
      <div className="">
        <AuthorBio />
      </div>
      {/* <div className=" mx-auto max-w-7xl p-6 lg:px-8"> */}
      <Review />
      <MoreCourses />
      {/* </div> */}
    </div>
  );
}
