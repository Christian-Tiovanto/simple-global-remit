export interface JsonApiValidationError {
  status: string;
  source: string[];
  title: string;
  detail: JsonApiValidationErrorDetail;
}

export interface JsonApiConflictError {
  status: string;
  source: string;
  title: string;
  value?: string;
  detail?: JsonApiValidationErrorDetail;
}
export interface JsonApiValidationErrorDetail {
  type: string;
  context?: Record<string, any>;
}
