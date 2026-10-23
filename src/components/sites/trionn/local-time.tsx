"use client";

import { useEffect, useState } from "react";

export function LocalTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <span>{time}</span>;
}
