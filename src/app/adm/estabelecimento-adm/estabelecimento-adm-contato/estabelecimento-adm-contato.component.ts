import { CepService } from './../../../services/cep.service';
import { TermoUsoService } from './../../../services/termo-uso.service';
import { EstadoService } from 'app/services/estado.service';
import { CidadeService } from 'app/services/cidade.service';
import { CargoService } from './../../../services/cargo.service';
import { TiposEstabelecimentoService } from './../../../services/tipos-estabelecimento.service';
import { EstabelecimentoService } from 'app/services/estabelecimento.service';
import { TipoTelefoneService } from './../../../services/tipos-telefone.service';

/** Angular */
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { OnInit } from '@angular/core';

/** Services */


@Component({
    selector: 'app-estabelecimento-adm-contato',
    templateUrl: './estabelecimento-adm-contato.component.html',
    styleUrls: ['./estabelecimento-adm-contato.component.scss'],
    providers: [
        TipoTelefoneService,
        EstabelecimentoService
    ],
    encapsulation: ViewEncapsulation.None
})

export class EstabelecimentoAdmContatoComponent implements OnInit {
    [x: string]: any;
    public router: Router;
    public form: FormGroup;
    public erros: Array<any> = [];
    public carregando: boolean = false;

    public estabelecimento: any;

    public tiposTelefone: Array<any> = [];

    public maskFone: any = {
        mask: '',
        placeholder: ''
    };

    public funcionarioEmail: AbstractControl;
    public ddd: AbstractControl;
    public telefone: AbstractControl;
    public tipoTelefone: AbstractControl;

    constructor(router: Router,
        fb: FormBuilder,
        public tipoTelefoneService: TipoTelefoneService,
        public estabelecimentoService: EstabelecimentoService
    ) {

        this.router = router;

        this.form = fb.group({         
            funcionarioEmail: ['', Validators.compose([Validators.required, emailValidator])],
            tipoTelefone: ['', Validators.required],
            ddd: ['', Validators.compose([Validators.required, dddValidator])],
            telefone: ['', Validators.compose([Validators.required, foneValidator])],
        });
     
        this.funcionarioEmail = this.form.controls['funcionarioEmail'];
        this.tipoTelefone = this.form.controls['tipoTelefone'];
        this.ddd = this.form.controls['ddd'];
        this.telefone = this.form.controls['telefone'];      

        this.maskFone.mask = '0000-0000';
        this.maskFone.placeholder = 'XXXX-XXXX';

    }

    public ngOnInit() {
        this.listarTiposTelefone();
        this.listarEstabelecimentoVendedor();
    }

    public ngAfterViewInit() {
        document.getElementById('preloader').classList.add('hide');
    }



    /** Ações Formulário */
    public closeAlert(index) {
        this.erros.splice(this.erros.indexOf(index), 1);
    }

    setMaskFone() {           
        if(this.tipoTelefone.value == 2){
            this.maskFone.mask = '00000-0000';
            this.maskFone.placeholder = 'XXXXX-XXXX';  
        }
        else{
            this.maskFone.mask = '0000-0000';
            this.maskFone.placeholder = 'XXXX-XXXX'; 
        }
    }


    /** Listar Conteúdo */
    public listarTiposTelefone() {
        var msgErro: any = {
            item : '',
            descricao: ''
        };
this.carregando = true;
        this.tipoTelefoneService.listarTodos().subscribe(
            tiposTelefone => {
                this.carregando = false;
                this.tiposTelefone = tiposTelefone['tiposTelefone'];
            },
            err => {
                this.carregando = false;
                msgErro.item = 'Erro ao listar tipos de Telefone!';
                msgErro.descricao = err;
                this.erros.push(msgErro);
            }
        );

    }

    listarEstabelecimentoVendedor() {
        var resp: any;
        var msgErro: any = {
            item: '',
            descricao: ''
        };        
        this.carregando = true;
        this.estabelecimentoService.getEstabelecimentoVendedor().subscribe(
            estabelecimento => {
                this.carregando = false;
                resp = estabelecimento['response'];
                if (resp.status == 'true') {
                    this.estabelecimento = resp.objeto[0];                
                }
                else {
                    msgErro.item = 'Erro ao carregar o estabelecimento!';
                    msgErro.descricao = resp.descricao;
                    this.erros.push(msgErro);
                }
            },
            err => {
                this.carregando = false;
                msgErro.item = 'Erro ao carregar o estabelecimento!';
                msgErro.descricao = err;
                this.erros.push(msgErro);
            }
        );
    }
  

}

export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
}

export function foneValidator(control: FormControl): { [key: string]: any } {
    var foneRegexp = /[0-9]{8,9}$/;
    if (control.value && !foneRegexp.test(control.value)) {
        return { invalidTelefone: true };
    }
}

export function dddValidator(control: FormControl): { [key: string]: any } {
    var dddRegexp = /[0-9]{2,2}$/;
    if (control.value && !dddRegexp.test(control.value)) {
        return { invalidDDD: true };
    }
}
