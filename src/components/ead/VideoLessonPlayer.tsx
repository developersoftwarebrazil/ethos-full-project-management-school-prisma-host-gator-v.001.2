type Props = {
  videoUrl: string;
};

export default function VideoLessonPlayer({ videoUrl }: Props) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border">
      <iframe
        src={videoUrl}
        className="h-full w-full"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
