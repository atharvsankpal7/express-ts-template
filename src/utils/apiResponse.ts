class ApiResponse<T = unknown> {
  statusCode: number
  data: T
  message?: string
  success: boolean
  error?: string

  constructor({ statusCode, data, message, error }: { statusCode: number; data: T; message?: string; error?: string }) {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
    this.error = error
  }
}
export default ApiResponse
