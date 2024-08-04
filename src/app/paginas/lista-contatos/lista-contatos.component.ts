import { Component, OnInit } from '@angular/core';

//import agenda from '../../agenda.json';

import { ContainerComponent } from '../../componentes/container/container.component';
import { FormsModule } from '@angular/forms';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { ContatoComponent } from '../../componentes/contato/contato.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import { FormularioContatoComponent } from '../formulario-contato/formulario-contato.component';
import { RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
import { Contato } from '../../componentes/contato/contato';

@Component({
  selector: 'app-lista-contatos',
  standalone: true,
  imports: [
    ContainerComponent,
    CabecalhoComponent,
    SeparadorComponent,
    ContatoComponent,
    FormsModule,
    FormularioContatoComponent,
    RouterLink,
  ],
  templateUrl: './lista-contatos.component.html',
  styleUrl: './lista-contatos.component.css',
})
export class ListaContatosComponent implements OnInit {
  alfabeto: string = 'abcdefghijklmnopqrstuvwxyz';
  contatos: Contato[] = [];

  filtroPorTexto: string = '';

  constructor(private contatoService: ContatoService) {}

  ngOnInit(): void {
    this.contatoService.obterContatos().subscribe((listaContatos) => {
      this.contatos = listaContatos;
    });
  }

  filtrarContatosPorTexto(): Contato[] {
    if (!this.filtroPorTexto) return this.contatos;

    return this.contatos.filter((contato) => {
      return this.removerAcentos(contato.nome)
        .toLowerCase()
        .includes(this.removerAcentos(this.filtroPorTexto).toLowerCase());
    });
  }

  filtrarContatosPorLetraInicial(letra: string): Contato[] {
    return this.filtrarContatosPorTexto().filter((contato) => {
      return this.removerAcentos(contato.nome)
        .toLowerCase()
        .startsWith(this.removerAcentos(letra).toLowerCase());
    });
  }

  private removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
