import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {GuiaRemisionService} from './guia-remision.service';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-guia-remision',
    templateUrl: './guia-remision.component.html',
    styleUrls: ['./guia-remision.component.scss'],
    providers: [DatePipe]
})
export class GuiaRemisionComponent implements OnInit {
    public envioDocumentosForm: FormGroup;
    public submitted = false;
    public startDateOptions: FlatpickrOptions = {
        altInput: true,
        mode: 'single',
        altFormat: 'Y-n-j',
        altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    };
    public fecha;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _consultaCreditosService: GuiaRemisionService,
        private datePipe: DatePipe,
    ) {
    }


    ngOnInit(): void {
        this.envioDocumentosForm = this._formBuilder.group({
            numeroGuia: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]], //
            fecha: ['', [Validators.required]], //
            courier: ['', [Validators.required, Validators.email]], //
            direccionEntrega: ['', [Validators.required]], //
            cooperativaAsignada: ['https://coopsanjose-corp.crediventa.com', [Validators.required]], //
        });
    }

    get facturacionControlsForm() {
        return this.envioDocumentosForm.controls;
    }

    guardar() {
        this.submitted = true;
        if (this.envioDocumentosForm.invalid) {
            console.log(this.envioDocumentosForm);
            return;
        }
        const data = {
            numeroEnvio: this.envioDocumentosForm.getRawValue().numeroGuia,
            fechaEnvio:  this.datePipe.transform(this.envioDocumentosForm.getRawValue().fecha, 'yyyy-MM-dd'),
            courierResponsable: this.envioDocumentosForm.getRawValue().courier,
            direccionEntrega: this.envioDocumentosForm.getRawValue().direccionEntrega,
            cooperativaEntrega: this.envioDocumentosForm.getRawValue().cooperativaAsignada
        };
        this._consultaCreditosService.guardarDatos(data).subscribe((info) => {
            this._router.navigate(['/comercial/envios-realizados']);
        });
    }
}
