import { Contato } from './../componentes/contato/contato';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  private readonly API: string = 'http://localhost:3000/contatos';

  constructor(private http: HttpClient) {}

  obterContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.API);
  }

  salvarContato(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.API, contato);
  }

  buscarPorId(id: number): Observable<Contato> {
    const url = `${this.API}/${id}`;
    return this.http.get<Contato>(url);
  }

  excluirContato(id: number): Observable<Contato> {
    const url = `${this.API}/${id}`;
    return this.http.delete<Contato>(url);
  }

  editarContato(contato: Contato): Observable<Contato> {
    const url = `${this.API}/${contato.id}`;
    return this.http.put<Contato>(url, contato);
  }

  editarOuSalvarContato(contato: Contato): Observable<Contato> {
    if (contato.id) return this.editarContato(contato);
    else return this.salvarContato(contato);
  }

  //#region versão localStorage
  /*
  private contatos: Contato[] = [];

  constructor() {
    //tentar obter os dados do localStorage
    const contatosLocalStorageString = localStorage.getItem('contatos');
    const contatosLocalStorage = contatosLocalStorageString
      ? JSON.parse(contatosLocalStorageString)
      : null;

    this.contatos = contatosLocalStorage || null;

    //salvar os contatos no localStorage
    localStorage.setItem('contatos', JSON.stringify(this.contatos));
  }

  obterContatos(): Contato[] {
    return this.contatos;
  }

  salvarContato(contato: Contato) {
    this.contatos.push(contato);
    localStorage.setItem('contatos', JSON.stringify(this.contatos));
  }

  editarContato(contato: Contato) {
    const index = this.contatos.findIndex((c) => c.id == contato.id);
    this.contatos[index].nome = contato.nome;
    this.contatos[index].email = contato.email;
    this.contatos[index].telefone = contato.telefone;
    this.contatos[index].redes = contato.redes;
    this.contatos[index].aniversario = contato.aniversario;
    this.contatos[index].observacoes = contato.observacoes;

    localStorage.setItem('contatos', JSON.stringify(this.contatos));
  }

  excluirContato(contato: Contato) {
    const index = this.contatos.findIndex((c) => c.id == contato.id);
    this.contatos.slice(index, 1);

    localStorage.setItem('contatos', JSON.stringify(this.contatos));
  }
  */
  //#endregion
}
