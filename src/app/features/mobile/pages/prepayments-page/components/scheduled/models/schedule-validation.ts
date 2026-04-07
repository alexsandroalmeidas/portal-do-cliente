export interface IScheduleValidation {
  hasError: boolean;
  errors: IScheduleValidationError[];
}

export interface IScheduleValidationError {
  title: string;
  description?: string;
}
