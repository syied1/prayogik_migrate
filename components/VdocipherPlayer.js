"use client";
import Loading from "@/app/(dashboard)/loading";
import { Video } from "lucide-react";
import React, { useState, useEffect } from "react";

const getVdoChiperOtp = async (videoId) => {
  const response = await fetch("/api/vdochiper-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoId }),
  });
  const data = await response.json();

  if (data.error) {
    return {
      error: true,
      message: "Credential Error",
    };
  }
  return data;
};

const VdocipherPlayer = ({ videoId }) => {
  const [otp, setOtp] = useState(null);
  const [playbackInfo, setPlaybackInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOtp = async () => {
      const data = await getVdoChiperOtp(videoId);
      if (data.error) {
        setError(data.message);
      } else {
        setOtp(data.otp);
        setPlaybackInfo(data.playbackInfo);
      }
    };

    fetchOtp();
  }, [videoId]);

  if (error) {
    return (
      <div
        style={{ minHeight: "410px" }}
        className="flex gap-2 flex-col items-center justify-center bg-slate-200 rounded-md"
      >
        <Video className="h-10 w-10 text-slate-500" />
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!otp || !playbackInfo) {
    return <Loading />;
  }

  return (
    <div className="h-full">
      <iframe
        src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
        style={{ border: 0, width: "100%", height: "100%" }}
        allow="encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VdocipherPlayer;
