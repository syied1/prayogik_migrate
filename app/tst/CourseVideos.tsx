// @ts-nocheck
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CourseVideos = ({ folderName }) => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const fetchVideosInFolder = async (folderName) => {
    const API_URL = `https://dev.vdocipher.com/api/videos?group=${folderName}`;
    const API_KEY = process.env.VDOCIPHER_API_SECRET;

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Apisecret ${API_KEY}`,
        },
      });
      return response.data; // Return video data
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error; // Handle error
    }
  };

  useEffect(() => {
    const getVideos = async () => {
      try {
        const data = await fetchVideosInFolder(folderName);
        setVideos(data.rows); // Assuming data.rows contains video details
      } catch (err) {
        setError(err.message);
      }
    };

    getVideos();
  }, [folderName]);

  if (error) return <div>Error loading videos: {error}</div>;
  if (!videos.length) return <div>No videos available.</div>;

  const totalDuration = videos.reduce(
    (sum, video) => sum + (video.length || 0),
    0
  );

  // Convert total duration to hh:mm:ss
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h2>Videos in {folderName}</h2>
      <p>Total Videos: {videos.length}</p>
      <p>Total Duration: {formatDuration(totalDuration)}</p>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            {video.title} - {video.length} seconds
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseVideos;
