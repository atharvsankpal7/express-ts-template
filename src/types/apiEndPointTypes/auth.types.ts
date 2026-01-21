// Base API response structure - the generic T is the shape of the `data` field
export interface IApiResponse<T = unknown> {
  statusCode: number
  data: T
  message?: string
  success: boolean
  error?: string
}

export type IRegisterResponse = IApiResponse<{ id: number }>

export interface ILoginRequest {
  email: string
  password: string
}

// export type IUserResponse = IApiResponse<{ id: number; email: string; fullName: string }>
