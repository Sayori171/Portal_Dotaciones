import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="wrap not-found">
        <span class="eyebrow">Error 404</span>
        <h1>No encontramos esta página</h1>
        <p>La dirección que buscas no existe o fue movida.</p>
        <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
      </div>
    </section>
  `,
  styles: `
    .not-found{display:flex;flex-direction:column;align-items:flex-start;gap:14px;min-height:40vh;justify-content:center;}
    h1{font-size:clamp(1.8rem,4vw,2.6rem);}
    p{color:var(--ink-600);}
  `,
})
export class NotFound {}
