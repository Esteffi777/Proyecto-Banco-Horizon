import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskedAccount',
  standalone: true
})
export class MaskedAccountPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value) return '';
    return value.replace(/.(?=.{4})/g, '*'); // Ejemplo de enmascaramiento
  }

}
