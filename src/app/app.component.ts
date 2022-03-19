import { Component } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'vacina_angular';

  modalWasShown = false;

  ngAfterViewInit(): void {
    console.log(this.modalWasShown);
    if (!this.modalWasShown) {
      setTimeout(() => {
        const modalTextMarkup =
          '<p> Professor, para testar o nosso trabalho, por favor ler o <a href="https://github.com/Vacinas-Backend/vacinas-front" target="_blank" rel="noreferrer">README</a>&nbsp; com as instruções necessárias.</p>';

        Swal.fire('Informação sobre o trabalho', modalTextMarkup, 'info');

        this.modalWasShown = true;
      }, 1000);
    }
  }
}
