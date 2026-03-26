"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import type { FunctionReference, FunctionArgs, FunctionReturnType } from "convex/server";

const DEFAULT_TIMEOUT_MS = 10000;

interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useQueryWithError<Query extends FunctionReference<"query">>(
  query: Query,
  args?: FunctionArgs<Query>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): QueryResult<FunctionReturnType<Query>> {
  const result = useQuery(query, args ?? ({} as FunctionArgs<Query>));
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    if (result !== undefined) {
      setIsTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      if (result === undefined) {
        console.error(`Query timed out after ${timeoutMs}ms`);
        setIsTimedOut(true);
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [result, timeoutMs]);

  const isLoading = result === undefined && !isTimedOut;
  const isError = isTimedOut;
  const error = isTimedOut
    ? new Error(`Data failed to load. Please check your connection and try again.`)
    : null;

  return {
    data: result,
    isLoading,
    isError,
    error,
  };
}
