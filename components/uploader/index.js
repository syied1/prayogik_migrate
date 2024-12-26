// @ts-nocheck
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
  const [message, setMessage] = useState({
    variant: "",
    title: "",
    description: "",
  });
  const [videoDuration, setVideoDuration] = useState(null);
  const fileInputRef = useRef();
  const videoRef = useRef();

  const removeFile = () => {
    setFile(null);
    setIsUploading(false);
    setMessage({
      variant: "",
      title: "",
      description: "",
    });
    setVideoDuration(null); // Reset video duration
    // Reset the file input value so it can trigger another change event
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input value
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

  const handleFileChange = useCallback(
    (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);

        // Create an object URL and load the video metadata
        const videoURL = URL.createObjectURL(selectedFile);
        const videoElement = videoRef.current;

        if (videoElement) {
          videoElement.src = videoURL;

          // Wait for the metadata to be loaded (this includes duration)
          videoElement.onloadedmetadata = () => {
            setVideoDuration(videoElement.duration); // Set the video duration in state
            onUploaded(selectedFile, videoElement.duration); // Pass video file and duration to parent
          };
        }
      }
    },
    [onUploaded]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        setFile(droppedFile);

        // Create an object URL and load the video metadata
        const videoURL = URL.createObjectURL(droppedFile);
        const videoElement = videoRef.current;

        if (videoElement) {
          videoElement.src = videoURL;

          // Wait for the metadata to be loaded (this includes duration)
          videoElement.onloadedmetadata = () => {
            setVideoDuration(videoElement.duration); // Set the video duration in state
            onUploaded(droppedFile, videoElement.duration); // Pass video file and duration to parent
          };
        }
      }
    },
    [onUploaded]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleUpload = useCallback(async () => {
    const data = await getCredentials(videoTitle || "Untitled Video"); // Fetch credentials
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Function to trigger the file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  console.log("videoDuration", videoDuration);

  return (
    <div>
      {/* {message && message.variant !== "" && (
        <AlertComponent message={message} onClose={closeAlert} />
      )} */}

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
            ref={fileInputRef} // Attach the ref to the input
          />
        </label>
        <div className="text-center">
          <p className="text-sm">or</p>
          <Button
            style={{ paddingLeft: "40px", paddingRight: "40px" }}
            className="bg-blue-400 hover:bg-blue-500 rounded-full mt-2 px-10 min-w-max"
            onClick={handleBrowseClick} // Trigger file input click
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

      {/* Hidden video element for calculating duration */}
      <video ref={videoRef} style={{ display: "none" }} />
    </div>
  );
};

export default Uploader2;
