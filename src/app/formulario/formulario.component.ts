import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

interface FormElements extends HTMLFormControlsCollection {
  nome: HTMLInputElement;
  cpf: HTMLInputElement;
  nascimento: HTMLInputElement;
  endereco: HTMLInputElement;
  telefone: HTMLInputElement;
  sexo: HTMLInputElement;
  pai: HTMLInputElement;
  mae: HTMLInputElement;
  prioridade: HTMLInputElement;
}

interface VacinaFormData {
  nome: string;
  cpf: string;
  data_nasc: string;
  endereco: string;
  telefone: string;
  sexo: string;
  nome_pai: string;
  nome_mae: string;
  grupo_prioridade: string;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  getFormData(form: HTMLFormElement) {
    const formElements = <FormElements>form.elements;
    const data = getFormInputData(formElements);

    function getFormInputData(formElements: FormElements) {
      const nome = formElements.nome.value;
      const cpf = formElements.cpf.value.replace(/\D/g, '');
      const dataDeNascimento = formElements.nascimento.value;
      const endereco = formElements.endereco.value;
      const telefone = formElements.telefone.value;
      const sexo = formElements.sexo.value;
      const nomeDoPai = formElements.pai.value;
      const nomeDaMae = formElements.mae.value;
      const grupoPrioritario = formElements.prioridade.value;

      return {
        nome,
        cpf,
        data_nasc: dataDeNascimento,
        endereco,
        telefone,
        sexo,
        nome_pai: nomeDoPai,
        nome_mae: nomeDaMae,
        grupo_prioridade: grupoPrioritario,
      };
    }

    return data;
  }

  async handleFormSubmit(event: Event): Promise<boolean> {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    if (!form) return false;

    const formIsValid = form.checkValidity();

    if (formIsValid) {
      const formData = this.getFormData(form);
      const response = this.registerPatientInfo(formData);

      const requestWasSuccessful = Boolean(response);

      if (requestWasSuccessful) {
        var modalTitle = 'Sucesso!';
        var modalTextMarkup = 'Seus dados foram salvos!';
        var status = true;

        this.router.navigate(['']);
      } else {
        var modalTitle = 'Oops! Aconteceu um erro!';
        var modalTextMarkup =
          'Não foi possível recuperar seus dados. Por favor, tente novamente.';
        var status = false;
      }
    } else {
      var modalTitle = 'O CPF digitado é inválido!';
      var modalTextMarkup = 'Por favor, digite novamente o CPF';

      var status = false;
    }

    Swal.fire(
      modalTitle,
      modalTextMarkup,
      status == true ? 'success' : 'error'
    );
    return status;
  }

  async registerPatientInfo(formData: VacinaFormData) {
    const URL = 'http://localhost:8090/vacinas';
    try {
      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      };
      const response = await fetch(URL, settings);
      return response.ok ? true : false;
    } catch (error) {
      return false;
    }
  }
}
