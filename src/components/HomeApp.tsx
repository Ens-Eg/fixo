"use client";
import { useEffect, useState } from "react";
import LoadingHomePage from "./LoadingHomePage";

type Props = {
  children: React.ReactNode;
};
export default function HomeApp({ children }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <>
      {loading && <LoadingHomePage />}
      {children}
    </>
  );
}
