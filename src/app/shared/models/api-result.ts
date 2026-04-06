import { ApiError } from './api-error';

export class ApiResult {
  constructor(
    public success: boolean,
    public errors: ApiError[] = []
  ) { }

  static success(): ApiResult {
    return new ApiResult(true);
  }

  static failed(...errors: ApiError[]) {
    return new ApiResult(false, errors);
  }
}

export class GenericApiResult<T>  {
  constructor(
    public success: boolean,
    public result?: T,
    public errors: ApiError[] = []
  ) { }

  static success<T>(result?: T): GenericApiResult<T> {
    return new GenericApiResult<T>(false, result);
  }

  static failed<T>(result?: T, ...errors: ApiError[]): GenericApiResult<T> {
    return new GenericApiResult<T>(false, result, errors);
  }
}
