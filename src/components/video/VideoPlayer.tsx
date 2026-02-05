"use client";

type Props = {
  src: string;
};

export default function VideoPlayer({ src }: Props) {
  if (!src) return null;

  return (
    <div className="w-full max-w-5xl">
      <video
        src={src}
        controls
        preload="metadata"
        className="w-full rounded-lg border"
      />
    </div>
  );
}
