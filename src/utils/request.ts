import type {RequestResponse} from '../types';

export type Request = {
  body?: BodyInit_;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  integrity?: string;
  keepalive?: boolean;
  method?: string;
  mode?: RequestMode_;
  referrer?: string;
  signal?: AbortSignal;
  token?: string;
  url: string;
};

const bodyRequired: Record<string, boolean> = {
  POST: true,
  PUT: true,
};

const controllersByURL: Record<string, AbortController> = {};

export async function request<ResponseData = null>({
  body,
  credentials,
  headers,
  integrity,
  keepalive,
  method = 'GET',
  mode,
  referrer,
  token,
  signal,
  url,
}: Request): Promise<RequestResponse<ResponseData>> {
  try {
    if (bodyRequired[method] && !body) {
      throw new Error(`A body is required for the ${method} method`);
    }

    const newHeaders: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    if (token?.length) {
      newHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      body,
      credentials,
      headers: newHeaders,
      integrity,
      keepalive,
      method,
      mode,
      referrer,
      signal,
    });

    if (controllersByURL[url]) {
      controllersByURL[url].abort();
    }

    controllersByURL[url] = new AbortController();

    if (!response.ok) {
      const result = await response.json();

      return {
        data: null,
        error: {
          code: response.status,
          message: result?.message || 'Unknown error',
        },
      };
    }

    delete controllersByURL[url];

    let data = {code: response.status};

    try {
      result = await response.json();
    } catch (err) {
      // do nothing
    }

    return {
      data: result.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        code: 1,
        message: error.message || 'Unknown error',
      },
    };
  }
}
