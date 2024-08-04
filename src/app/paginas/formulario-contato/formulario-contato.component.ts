import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../componentes/container/container.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
import { MensagemErroComponent } from '../../componentes/mensagem-erro/mensagem-erro.component';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';

@Component({
  selector: 'app-formulario-contato',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    SeparadorComponent,
    ReactiveFormsModule,
    RouterLink,
    MensagemErroComponent,
    CabecalhoComponent,
  ],
  templateUrl: './formulario-contato.component.html',
  styleUrl: './formulario-contato.component.css',
})
export class FormularioContatoComponent implements OnInit {
  contatoForm!: FormGroup;

  constructor(
    private contatoService: ContatoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarContato();
  }

  inicializarFormulario(): void {
    this.contatoForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      avatar: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      aniversario: new FormControl(''),
      redes: new FormControl(''),
      observacoes: new FormControl(''),
    });
  }

  obterControle(nome: string): FormControl {
    const control = this.contatoForm.get(nome);
    if (!control)
      throw new Error('Controle de formulário não encontrado: ' + nome);

    return control as FormControl;
  }

  carregarContato() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id)
      this.contatoService.buscarPorId(parseInt(id)).subscribe((contato) => {
        this.contatoForm.patchValue(contato);
      });
  }

  salvarContato(): void {
    const novoContato = this.contatoForm.value;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    novoContato.id = id ? parseInt(id) : null;

    this.contatoService.editarOuSalvarContato(novoContato).subscribe(() => {
      this.resetAndRedirect();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aoSelecionarArquivo(event: any) {
    const file: File = event.target.files[0];
    if (file) this.lerArquivos(file);
  }

  lerArquivos(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        this.contatoForm.get('avatar')?.setValue(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  cancelar(): void {
    this.resetAndRedirect();
  }

  resetAndRedirect() {
    this.contatoForm.reset();
    this.router.navigateByUrl('/lista-contatos');
  }

  private formatDate(date: Date): string {
    const d = date;
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}
