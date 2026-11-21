import { Component } from '@angular/core';

@Component({
  selector: 'app-process',
  templateUrl: './process.html',
  styleUrl: './process.css',
})
export class Process {
  protected readonly steps = [
    { num: '01', title: 'Elige la prenda', text: 'Selecciona camisa jean o pantalón jean desde el catálogo.' },
    { num: '02', title: 'Personaliza', text: 'Activa estampado, bordado o cinta reflectiva. Cada opción suma su valor al precio base.' },
    { num: '03', title: 'Define talla y cantidad', text: 'Ajusta la talla y el número de unidades que necesitas por prenda.' },
    { num: '04', title: 'Descarga tu cotización', text: 'Con tus datos de contacto, genera y descarga la cotización en PDF al instante.' },
  ];
}
