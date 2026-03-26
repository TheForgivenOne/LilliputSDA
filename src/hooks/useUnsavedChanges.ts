"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useUnsavedChanges(hasUnsavedChanges: boolean, message = "You have unsaved changes. Are you sure you want to leave?") {
  const router = useRouter();

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    },
    [hasUnsavedChanges, message]
  );

  useEffect(() => {
    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, handleBeforeUnload]);

  const pushWithWarning = useCallback(
    (href: string) => {
      if (hasUnsavedChanges) {
        if (window.confirm(message)) {
          router.push(href);
        }
      } else {
        router.push(href);
      }
    },
    [hasUnsavedChanges, message, router]
  );

  return {
    isBlocked: hasUnsavedChanges,
    pushWithWarning,
  };
}
