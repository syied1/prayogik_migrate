// @ts-nocheck 
"use client";
import React, { useState } from "react";
import axios from "axios";
const uploadVideo = async (videoFile, folderName) => {
  const API_URL = "https://dev.vdocipher.com/api/videos";
  const API_KEY = process.env.VDOCIPHER_API_SECRET;
  const formData = new FormData();

  formData.append("video", videoFile);
  formData.append("group", folderName); // Specify folder name here

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Apisecret ${API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Handle successful upload response
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error; // Handle error
  }
};


const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file && folderName) {
      try {
        await uploadVideo(file, folderName);
        alert("Video uploaded successfully!");
      } catch {
        alert("Failed to upload video.");
      }
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input 
        type="text" 
        placeholder="Folder Name" 
        value={folderName} 
        onChange={(e) => setFolderName(e.target.value)} 
        required 
      />
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
        required 
      />
      <button type="submit">Upload Video</button>
    </form>
  );
};

export default UploadVideo;
