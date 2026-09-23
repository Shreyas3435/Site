import { useEffect, useState } from "react";

export function useLocalTime(timeZone?: string) {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}
