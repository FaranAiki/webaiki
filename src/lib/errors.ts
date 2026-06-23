export type ErrorResponse = {
  error: {
    code: string;
    statusCode: number;
    message: string;
  };
};

export type ActionResponse<T = void> = 
  | { success: true; data?: T; url?: string }
  | ErrorResponse;

export function getErrorMessage(error: unknown, dict?: Record<string, string>): string {
  if (!error) return 'Unknown error';
  
  let code = '';
  let message = '';
  
  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, unknown>;
    // Support nested ErrorResponse format: { error: { code, message } }
    if ('error' in errObj && typeof errObj.error === 'object' && errObj.error !== null) {
      const nestedErr = errObj.error as Record<string, unknown>;
      code = String(nestedErr.code || '');
      message = String(nestedErr.message || '');
    } else {
      code = String(errObj.code || '');
      message = String(errObj.message || '');
    }
  } else {
    code = String(error);
    message = String(error);
  }

  if (dict && dict[code]) return dict[code];
  return message || 'Unknown error';
}

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON(): ErrorResponse {
    return {
      error: {
        code: this.code,
        statusCode: this.statusCode,
        message: this.message,
      },
    };
  }

  static badRequest(message: string) {
    return new AppError('BAD_REQUEST', 400, message);
  }

  static unauthorized(message: string = 'You must be logged in') {
    return new AppError('UNAUTHORIZED', 401, message);
  }

  static forbidden(message: string = 'You do not have permission') {
    return new AppError('FORBIDDEN', 403, message);
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError('NOT_FOUND', 404, message);
  }

  static internal(message: string = 'Internal server error') {
    return new AppError('INTERNAL_ERROR', 500, message);
  }
}
