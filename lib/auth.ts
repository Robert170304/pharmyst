// Authentication utility functions

export const setAuthCookie = (token: string, rememberMe: boolean = false) => {
  const expires = rememberMe
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

  document.cookie = `auth-token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

export const removeAuthCookie = () => {
  document.cookie =
    "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const getAuthCookie = (): string | null => {
  const cookies = document.cookie.split(";");
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("auth-token=")
  );
  return authCookie ? authCookie.split("=")[1] : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthCookie();
};
