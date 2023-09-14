import { useState, useEffect } from "react";
import React from "react";

// If you know the structure of the data, you can define it here
interface IData {
  timeDuration: number | string;
  requestNumber: number | string;
  // Other fields can be added based on the data
}

export default function Fetch() {
  // Type definitions
  type Data<T> = T[] | null;

  // State management
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<Data<IData>>(null);

  // API endpoint
  const url = "http://localhost:8081/requestData";

  // Fetching data
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`Fetch failed, ${response.status}`);
        }

        const result = await response.json();
        console.log("RESPONSE: ",result)
        setData(result);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error(`An error occurred: ${err.message}`);
          setIsError(true);
        }
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : isError ? (
        <h1>An Error occurred</h1>
      ) : data ? (
        <ul>
          {data.map((item) => (
            <li>{item.requestNumber}</li>
          ))}
        </ul>
      ) : (
        <h1>No data</h1>
      )}
    </>
  );
}