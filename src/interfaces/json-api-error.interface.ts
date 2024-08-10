export interface JsonApiValidationError {
  status: string;
  source: string[];
  title: string;
  value: Record<string, any>;
  type: string;
}

export interface JsonApiConflictError {
  status: string;
  source: string | string[];
  title: string;
  value: string | string[];
  type: string;
}

export interface JsonApiDetailConflictError {
  value: string | string[];
  key: string | string[];
}

export interface JsonApiDetailValidationError {
  value: Record<string, any>;
  key: string[];
}
