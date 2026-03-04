type SendEmailPayload = {
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  name?: string;
  email?: string;
  instagram?: string;
  channelLink?: string;
  niche?: string;
  message?: string;
};

type ApiSuccessResponse = {
  success: boolean;
  message?: string;
};

type ApiErrorResponse = {
  error?: string;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!raw) {
    return "";
  }
  return trimTrailingSlash(raw);
};

const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();
  return `${base}${normalizedPath}`;
};

export const sendEmail = async (payload: SendEmailPayload, timeoutMs = 8000): Promise<ApiSuccessResponse> => {
  const response = await fetch(buildApiUrl("/api/send-email"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const data = (await response.json().catch(() => ({}))) as ApiSuccessResponse & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return {
    success: data.success ?? true,
    message: data.message,
  };
};
