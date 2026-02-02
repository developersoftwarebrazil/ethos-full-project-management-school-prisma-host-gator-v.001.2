"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import VideoLessonForm from "@/components/forms/VideoLessonForm";

const VideoLessonModal = ({ relatedData }: { relatedData: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Adicionar videoaula
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <VideoLessonForm setOpen={setOpen} relatedData={relatedData} />
      </Modal>
    </>
  );
};

export default VideoLessonModal;
