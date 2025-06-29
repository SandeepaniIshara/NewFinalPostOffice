import { useState, useEffect, useCallback } from "react";

const useFetch = <T>(
  fetchFunction: () => Promise<T>
): {
  data: T | null;
  loading: boolean;
  refetch: () => void;
} => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [trigger, setTrigger] = useState<number>(0); // used to trigger refetch

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setData(null);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchFunction, trigger]);

  return { data, loading, refetch };
};

export default useFetch;
