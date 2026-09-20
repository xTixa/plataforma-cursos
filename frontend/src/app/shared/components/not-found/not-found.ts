import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <a mat-raised-button color="primary" routerLink="/">Voltar ao início</a>
    </div>
  `,
  styles: `
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 4rem 0;
      text-align: center;
    }

    h1 {
      font-size: 3rem;
      margin: 0;
    }
  `,
})
export class NotFound {}
