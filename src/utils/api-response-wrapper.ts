import { ApiResponseSchemaHost, getSchemaPath } from '@nestjs/swagger';

export class SwaggerResponseWrapper {
  static createResponse(response): ApiResponseSchemaHost['schema'] {
    return {
      allOf: [
        {
          properties: {
            data: {
              $ref: getSchemaPath(response),
            },
          },
        },
      ],
    };
  }
  static createResponseList(response): ApiResponseSchemaHost['schema'] {
    return {
      allOf: [
        {
          properties: {
            data: {
              items: { $ref: getSchemaPath(response) },
            },
          },
        },
      ],
    };
  }
}
