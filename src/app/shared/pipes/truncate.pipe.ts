import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncate Pipe - Shared Utility Pipe
 * 
 * Purpose:
 * - Truncate long text with ellipsis
 * - Configurable length and suffix
 * - Pure pipe for performance
 * 
 * Usage:
 * {{ longText | truncate:50 }}
 * {{ longText | truncate:50:'...' }}
 */
@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    limit: number = 100,
    ellipsis: string = '...'
  ): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + ellipsis;
  }
}
