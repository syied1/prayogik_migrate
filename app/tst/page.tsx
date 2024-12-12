// @ts-nocheck 

import React from "react";
import UploadVideo from "./uploadvideo";
import CourseVideos from "./CourseVideos";

const CoursePage = ({ params }) => {
//   const { folderName } = params;
  const { folderName } = "course1";

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Manage Course: {folderName}</h1>
      <UploadVideo />
      <CourseVideos folderName={folderName} />
    </div>
  );
};

// Define static routes for courses (optional)
export async function generateStaticParams() {
  // If you have a predefined list of folders, you can implement this to generate static paths
  return [{ folderName: "course1" }, { folderName: "course2" }];
}

export default CoursePage;
