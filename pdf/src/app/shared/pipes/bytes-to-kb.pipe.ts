import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'byteToKb',
  standalone: true,
})
export class ByteToKbPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return 'Invalid number'
    }
    return (value / 1024).toFixed(2) + ' KB'
  }
}
