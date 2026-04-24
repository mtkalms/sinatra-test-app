import { useCallback, useEffect, useState } from "react";

export default function useFetch<T>(url: string): {
  data?: T | null;
  loading: boolean;
  error?: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  function load() {
    fetchData();
  }

  useEffect(load, [fetchData]);
  useEffect(load, [fetchData, url]);

  return {
    data,
    loading,
    error,
  };
}
