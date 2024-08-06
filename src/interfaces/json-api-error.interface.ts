export interface JsonApiValidationError {
  status: string;
  source: string[];
  title: string;
  value: Record<string, any>;
}

export interface JsonApiConflictError {
  status: string;
  source: string | string[];
  title: string;
  value: string;
}

export interface JsonApiDetailConflictError {
  value: string;
  key: string;
}

export interface JsonApiDetailValidationError {
  value: Record<string, any>;
  key: string[];
}
