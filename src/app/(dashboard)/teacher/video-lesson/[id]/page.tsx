import CloudinaryPlayer from "@/components/video/CloudinaryPlayer";
import { getVideoLessonById } from "@/lib/api/video-lessons/get-video-lesson";
import { notFound } from "next/navigation";
import styles from "./pagevideo-page.module.scss";
import VideoPlayer from "@/components/video/VideoPlayer";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const lesson = await getVideoLessonById(params.id);

  if (!lesson) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <h1>{lesson.title}</h1>
          <span>
            Professor: {lesson.teacher?.name ?? "—"}
          </span>
        </header>

        {/* PLAYER */}
        <section className={styles.playerCard}>
          {/* <CloudinaryPlayer publicId={lesson.publicId} /> */}
          <VideoPlayer src={lesson.videoUrl} />
        </section>

        {/* DESCRIÇÃO */}
        {lesson.description && (
          <section className={styles.description}>
            <h3>Sobre esta aula</h3>
            <p>{lesson.description}</p>
          </section>
        )}
      </div>
    </div>
  );
}
