// Backend ile konuşan ince katman (LLD: ApiClient)
const TIMEOUT_MS = 10000;

// Non-2xx cevaplarda fırlatılır (LLD: ApiError(status, message))
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(path, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}`);
    }
    // 202/204 gibi cevaplarda gövde boş olabilir
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(timer);
  }
}

export function get(path) {
  return request(path);
}

export function post(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
