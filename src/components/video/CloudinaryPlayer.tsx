"use client";

import { useEffect, useRef } from "react";

type Props = {
  publicId: string;
};

export default function CloudinaryPlayer({ publicId }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // @ts-ignore
    if (!window.cloudinary || !window.videojs) {
      console.warn("Cloudinary ou Video.js ainda não carregou");
      return;
    }

    // @ts-ignore
    const player = window.cloudinary.videoPlayer(videoRef.current, {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      publicId,
      controls: true,
      autoplay: false,
      fluid: true,
    });

    return () => {
      try {
        player?.dispose();
      } catch {}
    };
  }, [publicId]);

  return (
    <video
      ref={videoRef}
      className="cld-video-player video-js vjs-fluid"
    />
  );
}
