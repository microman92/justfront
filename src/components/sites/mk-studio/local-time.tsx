"use client";

import { useEffect, useState } from "react";

export function LocalTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("ru-RU", { timeZone: "Asia/Tashkent", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <span>{time}</span>;
}
