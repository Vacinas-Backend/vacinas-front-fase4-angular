import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

interface UserInfo {
  id: string;
  nome: string;
  cpf: string;
  data_nasc: string;
  endereco: string;
  telefone: string;
  sexo: string;
  nome_pai: string;
  nome_mae: string;
  grupo_prioridade: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  renderUserInfo(userInfo: UserInfo): string {
    let list = '<ul>';

    Object.entries(userInfo).forEach((entry: string[]) => {
      const [key, value] = entry;

      if (!value) return;
      let element = key == 'id' ? '<h5>' : '<li>';

      let label = null;

      switch (key) {
        case 'nome':
          label = 'Nome Completo';
          break;
        case 'data_nasc':
          label = 'Data de Nascimento';
          break;
        case 'endereco':
          label = 'Endereço';
          break;
        case 'telefone':
          label = 'Telefone para contato';
          break;
        case 'sexo':
          label = 'Sexo';
          break;
        case 'nome_pai':
          label = 'Nome do Pai';
          break;
        case 'nome_mae':
          label = 'Nome da Mãe';
          break;
        case 'grupo_prioridade':
          label = 'Grupo Prioritário';
          break;
        default:
          label = key.toUpperCase();
          break;
      }

      const markup = `${label}: ${value}`;
      element += markup;
      const closer = key == 'id' ? '</h5>' : '</li>';
      element += closer;

      list += element;
    });
    return (list += '</ul>');
  }

  formatData(data: UserInfo | UserInfo[]) {
    const dataIsInArrayFormat = Array.isArray(data);

    if (dataIsInArrayFormat) {
      // const container = document.createElement('div');
      let test = '<div>';
      data.forEach((item) => {
        const list = this.renderUserInfo(item);
        test += list;
        // container.append(list);
      });
      test += '</div>';

      return test;
    } else {
      const list = this.renderUserInfo(data);
      return list;
    }
  }

  async getPatientInfo(): Promise<UserInfo | UserInfo[] | boolean> {
    try {
      const URL = 'https://vacina-backend.herokuapp.com/vacinas';

      const response = await fetch(URL);
      const convertedResponse = await response.json();
      return convertedResponse;
    } catch (error) {
      return false;
    }
  }

  async handleGetPatientInfo(this: HomeComponent): Promise<boolean> {
    const patientInfo = await this.getPatientInfo();

    if (!patientInfo || typeof patientInfo == 'boolean') {
      Swal.fire(
        'Oops! Aconteceu um erro',
        'Não foi possível recuperar seus dados. Por favor, tente novamente.',
        'error'
      );

      return false;
    }

    let recordsExist = null;

    if (Array.isArray(patientInfo)) {
      recordsExist = patientInfo.length > 0;
    } else if (typeof patientInfo == 'object') {
      recordsExist = Object.keys(patientInfo).length > 0;
    }

    // const recordsExist = patientInfo.length > 0;

    if (recordsExist) {
      const formattedResponseInHtml = this.formatData(patientInfo);

      Swal.fire('Dados do Paciente', formattedResponseInHtml, 'success');

      return true;
    } else {
      Swal.fire(
        'Dados do Paciente',
        'Ainda não foram cadastradas informações.',
        'info'
      );

      return false;
    }
  }
}
