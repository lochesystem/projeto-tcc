import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { TranslateService } from 'ng2-translate/ng2-translate';

/** SERVICES */
import { AcessoService } from './../../services/acesso.service';

@Component({
  selector: 'app-login-adm',
  templateUrl: './login-adm.component.html',
  styleUrls: ['./login-adm.component.scss'],
  providers: [
    AcessoService
  ],
  encapsulation: ViewEncapsulation.None
})

export class LoginAdmComponent implements OnInit {
  public erros: Array<any> = [];
  public router: Router;
  public form: FormGroup;

  public email: AbstractControl;
  public password: AbstractControl;
  public passwordType: any = '';

  constructor(router: Router, fb: FormBuilder,
    private acessoService: AcessoService) {
    this.router = router;

    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
    this.passwordType = 'password';

  }

  ngOnInit(): void {

  }

  public handleError(error) {
    console.error('Error processing action', error);
  }

  public onSubmit(values: Object): void {
    var resp: any;
    var msgErro: any = {
      item: '',
      descricao: ''
    };

    if (this.form.valid) {
      this.acessoService.autenticar(values).subscribe(
        login => {
          resp = login['response'];

          if (resp.status == 'true') {
            if (resp.objeto.tipo_usuario_id == 4 || resp.objeto.tipo_usuario_id == 5) {
              if (resp.objeto.status_id != 3 && resp.objeto.status_id != 4 && resp.objeto.status_id != 6) {
                this.acessoService.liberaAcessoAdm(resp.objeto);
                if (this.acessoService.usuarioAdmEstaAutenticado()) {
                  this.router.navigate(['/adm']);
                }
              }
              else {
                msgErro.item = 'Erro ao efetuar o login!';
                msgErro.descricao = 'Sua conta esta' + resp.objeto.status_descricao + '';
                this.erros.push(msgErro);
              }
            }
            else {
              msgErro.item = 'Erro ao efetuar o login!';
              msgErro.descricao = 'Seu usuário nâo possui permissão para acessar o portal adm!';
              this.erros.push(msgErro);
            }
          }
          else {
            msgErro.item = 'Erro ao efetuar o login!';
            msgErro.descricao = resp.descricao;
            this.erros.push(msgErro);
          }
        },
        err => {
          msgErro.item = 'Erro ao efetuar login!';
          msgErro.descricao = err;
          this.erros.push(msgErro);
        }
      );
    }
    else {
      this.email.markAsTouched();
      this.password.markAsTouched();
    }
  }

  public closeAlert(index) {
    this.erros.splice(index, 1);
  }

  setTypePassword(type) {
    this.passwordType = type;
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
  }

}

export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}
