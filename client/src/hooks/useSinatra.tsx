import { useState, useEffect } from "react";

export default function useSinatra(url: string): {
  data?: string | null;
  loading: boolean;
  error?: Error | null;
} {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.text();
      setData(result);
    } catch (error) {
      setError(error as any);
    } finally {
      setLoading(false);
    }
  };

  function load() {
    fetchData();
  }

  useEffect(load, []);
  useEffect(load, [url]);

  return {
    data,
    loading,
    error,
  };
}
