import { formatTime } from "@/utils/formatTime";
import React from "react";

export const useDate = () => {
  const [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = `${formatTime(
    date
  )}, ${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;

  return {
    formattedDate,
  };
};
