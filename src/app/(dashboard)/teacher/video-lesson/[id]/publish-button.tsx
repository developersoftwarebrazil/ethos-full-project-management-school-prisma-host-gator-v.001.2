"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PublishButton({
  lessonId,
}: {
  lessonId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePublish = async () => {
    await fetch(`/api/teacher/video-lessons/${lessonId}/publish`, {
      method: "PATCH",
    });

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handlePublish}
      disabled={isPending}
      className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
    >
      {isPending ? "Publicando..." : "Publicar aula"}
    </button>
  );
}
