/**
 * API 工具函数
 * 支持通过环境变量配置生产环境 API 地址
 */

// 获取 API 基础 URL
// 如果配置了 NEXT_PUBLIC_API_BASE_URL，则使用该地址（生产环境 API）
// 否则使用相对路径（本地 API）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * 统一的 fetch 封装函数
 * @param endpoint API 端点路径（如 '/api/profile'）
 * @param options fetch 选项
 * @returns fetch Promise
 */
export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`[API] Fetching: ${url}`);
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

/**
 * GET 请求
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetchAPI(endpoint);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * POST 请求
 */
export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * PUT 请求
 */
export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * DELETE 请求
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}
