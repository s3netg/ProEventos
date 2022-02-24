
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../../models/Evento';
import { EventoService } from '../../services/evento.service';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  modalRef!: BsModalRef;

  public eventos:Evento[]=[] ;
  public eventosFiltrados:any[]=[];

  public imgwidth:number=150;
  public mostrarimage:boolean=true;
  private _filtroLista='';


  public get filtroLista(){
    return this._filtroLista;
  }

  public set filtroLista(value:string){
    this._filtroLista=value;
    this.eventosFiltrados=this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor:string):Evento[]{
    filtrarPor=filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
       (evento:any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService


    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public AlterarImagem():void{
    this.mostrarimage=!this.mostrarimage;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
      },
      complete: () => this.spinner.hide()
    });
  }


  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
  confirm(): void {
    this.modalRef.hide();
    this.toastr.success('O Evento foi deletado com Sucesso.', 'Deletado!');

  }

  decline(): void {
    this.modalRef.hide();
  }


}
