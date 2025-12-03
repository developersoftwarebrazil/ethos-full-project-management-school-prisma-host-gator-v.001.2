"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const initialDate = dateParam ? new Date(dateParam) : new Date();

  const [value, setValue] = useState<Value>(initialDate);

  useEffect(() => {
    if (value instanceof Date) {
      const iso = value.toISOString();
      router.push(`?date=${iso}`);
    }
  }, [value, router]);

  return (
    <Calendar
      onChange={setValue}
      value={value}
      locale="pt-BR"
    />
  );
};

export default EventCalendar;
