"use client";

import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import FileDisplay from "./FileDisplay";
import { getCredentials, uploadFile } from "./utils";

const Uploader2 = ({ videoTitle, onUploaded }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(null); // State for video duration
  const [message, setMessage] = useState({
    variant: "",
    title: "",
    description: "",
  });

  const fileInputRef = useRef(null);

  const removeFile = () => {
    setFile(null);
    setIsUploading(false);
    setDuration(null); // Reset duration when file is removed
    setMessage({
      variant: "",
      title: "",
      description: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeAlert = () => {
    setMessage({
      variant: "",
      title: "",
      description: "",
    });
  };

  const handleUploadProgress = (progress) => {
    setUploadProgress(progress);
  };

  const calculateDuration = useCallback(async (selectedFile) => {
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(selectedFile);

    return new Promise((resolve, reject) => {
      videoElement.addEventListener("loadedmetadata", () => {
        const videoDuration = Math.round(videoElement.duration);
        setDuration(videoDuration); // Update duration
        console.log("Video Duration:", videoDuration); // Log duration
        resolve(videoDuration);
      });

      videoElement.addEventListener("error", (err) => {
        reject(err);
      });
    });
  });

  const handleFileChange = useCallback(async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      await calculateDuration(selectedFile); // Calculate and set duration
    }
  }, []);

  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      await calculateDuration(droppedFile); // Calculate and set duration
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleUpload = useCallback(async () => {
    const data = await getCredentials(videoTitle || "Untitled Video");
    const videoId = data?.videoId;

    const uploadCreds = data.clientPayload;

    if (!file) {
      setMessage({
        variant: "error",
        title: "No File Selected",
        description: "Please select a video file to upload.",
      });
      toast.error("No file selected.");
      return;
    }

    if (!uploadCreds) {
      setMessage({
        variant: "error",
        title: "Credentials Error",
        description: "Failed to get credentials. Please contact support.",
      });
      toast.error("Failed to get credentials. Please contact support.");
      return;
    }

    if (file && file.type !== "video/mp4") {
      toast.error("Please upload a valid MP4 file.");
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadFile(file, uploadCreds, handleUploadProgress);

      onUploaded(videoId, duration);

      if (result.status === "success") {
        setUploadProgress(0);
        setFile(null);
        setIsUploading(false);
        setMessage({
          variant: "success",
          title: "Success!",
          description: result.message,
        });
        toast.success(result.message);
      } else {
        throw new Error(result);
      }
    } catch (err) {
      toast.error(err.message);
      setMessage({
        variant: "error",
        title: "Upload Failed",
        description: err.message,
      });
    } finally {
      setIsUploading(false);
    }
  }, [file, duration]); // Ensure duration is included as a dependency

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center w-full gap-3"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label
          style={{ minHeight: "200px" }}
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
            <UploadIcon className="w-9 h-9 text-blue-500" />
            <p className="text-sm text-gray-500">
              Click or drag your file here
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="video/mp4"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>
        <div className="text-center">
          <p className="text-sm">or</p>
          <Button
            style={{ paddingLeft: "40px", paddingRight: "40px" }}
            className="bg-blue-400 hover:bg-blue-500 rounded-full mt-2 px-10 min-w-max"
            onClick={handleBrowseClick}
          >
            Browse
          </Button>
        </div>
      </div>

      {file && (
        <FileDisplay
          file={file}
          removeFile={removeFile}
          isUploading={isUploading}
          progress={uploadProgress}
        />
      )}
      {file && (
        <Button
          className="mt-4 bg-teal-500 hover:bg-teal-500"
          onClick={handleUpload}
          disabled={isUploading}
        >
          Upload
        </Button>
      )}
    </div>
  );
};

export default Uploader2;
