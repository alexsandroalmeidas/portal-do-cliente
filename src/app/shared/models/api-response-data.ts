import { ApiResponse } from './api-response';

export interface ApiResponseData<T> extends ApiResponse {
  data: T;
}

