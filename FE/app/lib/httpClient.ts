import axios, { AxiosInstance, AxiosResponse } from 'axios'
import _createAuthRefreshInterceptor, { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'
import useAuthStore from '../stores/authStore' // adjust path as needed

class HttpClient {
  baseUrl: string
  instance: AxiosInstance

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    this.instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    })

    // Set Authorization header from Zustand store on init (if token exists)
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) this.setAuthHeader(accessToken)

    this.createAuthRefreshInterceptor(
      (accessToken) => {
        localStorage.setItem('accessToken', accessToken)
        this.setAuthHeader(accessToken)
        useAuthStore.getState().setAccessToken(accessToken)
      },
      () => {
        useAuthStore.getState().clearAuth()
      },
    )
  }

  private getUrl(endpoint: string) {
    return `${this.baseUrl}${endpoint}`
  }

  async get<T = any>(endpoint: string, config?: AxiosAuthRefreshRequestConfig) {
    const response = await this.instance.get<T>(this.getUrl(endpoint), config)
    return response.data
  }

  async post<T = any>(endpoint: string, data?: object, config?: AxiosAuthRefreshRequestConfig) {
    const response = await this.instance.post<T>(this.getUrl(endpoint), data, config)
    return response.data
  }

  async patch<T = any>(endpoint: string, data?: object, config?: AxiosAuthRefreshRequestConfig) {
    const response = await this.instance.patch<T>(this.getUrl(endpoint), data, config)
    return response.data
  }

  async put<T = any>(endpoint: string, data?: object, config?: AxiosAuthRefreshRequestConfig) {
    const response = await this.instance.put<T>(this.getUrl(endpoint), data, config)
    return response.data
  }

  async delete<T = any>(endpoint: string, config?: AxiosAuthRefreshRequestConfig) {
    const response = await this.instance.delete<T>(this.getUrl(endpoint), config)
    return response.data
  }

  setAuthHeader(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  removeAuthHeader() {
    delete this.instance.defaults.headers.common['Authorization']
  }

  createAuthRefreshInterceptor(
    onSuccess?: (accessToken: string) => void,
    onError?: (error: any) => void,
  ) {
    _createAuthRefreshInterceptor(
      this.instance,
      async (failedRequest) => {
        try {
          const refreshToken = useAuthStore.getState().refreshToken
          if (!refreshToken) throw new Error('No refresh token available')

          // Send refresh token in body, mark request to skip auth refresh (avoid loop)
          const res = await this.post<{
            accessToken: string
            refreshToken: string
          }>('/auth/refresh', { refreshToken }, { headers: { skipAuthRefresh: true } })

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res

          // Update Zustand store tokens
          useAuthStore.getState().setAccessToken(newAccessToken)
          useAuthStore.getState().setRefreshToken(newRefreshToken || refreshToken)

          // Update axios default header & failed request header
          this.setAuthHeader(newAccessToken)
          failedRequest.response.config.headers['Authorization'] = `Bearer ${newAccessToken}`

          onSuccess?.(newAccessToken)
          return Promise.resolve()
        } catch (error) {
          useAuthStore.getState().clearAuth()
          onError?.(error)
          return Promise.reject(error)
        }
      },
      {
        pauseInstanceWhileRefreshing: true,
        statusCodes: [401],
      },
    )
  }
}

export function handleError(error: any, onError?: (error: AxiosResponse) => void) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      if (error.response.status >= 500 && error.response.status < 600) {
        throw new Error('Đã có lỗi xãy ra. Vui lòng thử lại sau.')
      }

      onError?.(error.response)
    } else {
      throw new Error('Đã có lỗi xãy ra. Vui lòng thử lại sau.')
    }
  } else {
    throw new Error('Đã có lỗi xãy ra. Vui lòng thử lại sau.')
  }
}

const httpClient = new HttpClient()

export default httpClient