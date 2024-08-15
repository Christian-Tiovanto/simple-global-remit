import { SetMetadata } from '@nestjs/common';

export const SkipFormatInterceptor = () => SetMetadata('skip_format_interceptor', true);
