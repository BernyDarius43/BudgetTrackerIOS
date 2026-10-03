// hooks/useFormError.ts
import { useMemo } from "react";
import { AuthError } from "@/utils/AuthErrors";

export const useFormError = (error: AuthError | null) => {
  return useMemo(() => {
    return {
      get: (field: AuthError["field"]) =>
        error?.field === field ? error : null,

      isInvalid: (field: AuthError["field"]) =>
        error?.field === field,

      isGlobal: error?.field === "general",
      error,
    };
  }, [error]);
};