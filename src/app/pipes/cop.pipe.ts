import { Pipe, PipeTransform } from '@angular/core';

/** Formatea un número como pesos colombianos: 65000 -> $65.000 */
@Pipe({ name: 'cop' })
export class CopPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return '$' + Math.round(value ?? 0).toLocaleString('es-CO');
  }
}
