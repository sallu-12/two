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

const MAX_ATTEMPTS_PER_ENDPOINT = 2;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const unique = (values: string[]) => Array.from(new Set(values));

const isDevelopment = import.meta.env.DEV;

const getApiBaseCandidates = () => {
  if (isDevelopment) {
    return [""];
  }

  const envPrimary = import.meta.env.VITE_API_BASE_URL?.trim();
  const envFallback = import.meta.env.VITE_API_FALLBACK_URL?.trim();
  const sameOrigin = typeof window !== "undefined" ? window.location.origin : "";

  return unique([
    envPrimary || "",
    sameOrigin,
    envFallback || "",
    "https://bolzaa-backend.onrender.com",
  ].map((value) => trimTrailingSlash(value)).filter(Boolean));
};

const buildApiUrl = (base: string, path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!base) {
    return normalizedPath;
  }
  return `${base}${normalizedPath}`;
};

const parseHttpError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return null;
  }

  const match = /^HTTP_(\d{3}):(.*)$/.exec(error.message);
  if (!match) {
    return null;
  }

  return {
    status: Number(match[1]),
    message: match[2] || "API request failed",
  };
};

const sendEmailRequest = async (url: string, payload: SendEmailPayload) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as ApiSuccessResponse & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}:${data.error || "API request failed"}`);
  }

  return {
    success: data.success ?? true,
    message: data.message,
  };
};

export const sendEmail = async (payload: SendEmailPayload): Promise<ApiSuccessResponse> => {
  const endpoints = getApiBaseCandidates().map((base) => buildApiUrl(base, "/api/send-email"));
  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_ENDPOINT; attempt += 1) {
      try {
        return await sendEmailRequest(endpoint, payload);
      } catch (error) {
        lastError = error;

        const httpError = parseHttpError(error);
        if (httpError) {
          if ([404, 502, 503, 504].includes(httpError.status)) {
            break;
          }
          throw new Error(httpError.message);
        }

        if (attempt + 1 >= MAX_ATTEMPTS_PER_ENDPOINT) {
          break;
        }
      }
    }
  }

  if (lastError instanceof Error && lastError.message) {
    throw lastError;
  }

  throw new Error("Server connection issue. Please refresh and try again.");
};
