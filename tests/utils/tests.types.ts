import { Response } from "supertest"

export type TypedResponse<T> = Omit<Response, "body"> & { body: T }
