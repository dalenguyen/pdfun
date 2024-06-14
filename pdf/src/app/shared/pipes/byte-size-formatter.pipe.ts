import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'byteSizeFormatter',
  standalone: true,
})
export class ByteSizeFormatter implements PipeTransform {
  transform(bytes: number, precision = 1): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
      return 'Invalid number'

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    let unitIndex = 0

    while (bytes >= 1024 && unitIndex < units.length - 1) {
      bytes /= 1024
      unitIndex++
    }

    return `${bytes.toFixed(precision)} ${units[unitIndex]}`
  }
}
