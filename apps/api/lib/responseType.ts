type ApiSuccess<T> = {
  success: true,
  data: T
}

type ApiError = {
  success: false,
  error: {
    message: string | unknown,
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError