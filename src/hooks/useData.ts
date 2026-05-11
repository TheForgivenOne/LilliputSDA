"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseFetchOptions<T> {
  initialData?: T;
  enabled?: boolean;
}

interface UseFetchResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
  const { initialData, enabled = true } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!mountedRef.current) return;
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const result = await response.json();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function createItem<T, R = T>(
  url: string,
  data: T
): Promise<R> {
  return fetchApi<R>(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateItem<T, R = T>(
  url: string,
  data: Partial<T>
): Promise<R> {
  return fetchApi<R>(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteItem(url: string): Promise<void> {
  await fetchApi(url, { method: "DELETE" });
}