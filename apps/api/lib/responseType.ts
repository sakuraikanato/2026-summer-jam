type ApiSuccess<T> = {
  success: true,
  data: T
}

type ApiError<T> = {
  success: false,
  error: T
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError<T>