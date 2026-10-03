// utils/AuthErrors.ts

export type AuthErrorType =
  | "auth"
  | "validation"
  | "network"
  | "server"
  | "unknown";

export type AuthErrorField =
  | "email"
  | "password"
  | "confirmPassword"
  | "general";

export type AuthError = {
  message: string;
  type: AuthErrorType;
  field: AuthErrorField;
  raw?: unknown;
};

export const createAuthError = (
  message: string,
  field: AuthErrorField = "general",
  type: AuthErrorType = "unknown",
  raw?: unknown
): AuthError => ({
  message,
  field,
  type,
  ...(raw === undefined ? {} : { raw }),
});

export const mapFirebaseError = (error: any): AuthError => {
  const code = error?.code;

  switch (code) {
    case "auth/invalid-email":
      return createAuthError(
        "Invalid email format.",
        "email",
        "validation",
        error
      );

    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return createAuthError(
        "Incorrect email or password.",
        "general",
        "auth",
        error
      );

    case "auth/email-already-in-use":
      return createAuthError("Email already in use.", "email", "validation", error);

    case "auth/weak-password":
      return createAuthError(
        "Password must be at least 6 characters.",
        "password",
        "validation",
        error
      );

    default:
      return createAuthError(
        "Something went wrong. Please try again.",
        "general",
        error?.code ? "server" : "network",
        error
      );
  }
};
