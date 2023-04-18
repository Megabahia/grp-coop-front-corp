import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NotasPedidoService} from './notas-pedido.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {repeaterAnimation} from 'app/main/elementos/forms/form-repeater/form-repeater.animation';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {Credito, Iva, NotaPedido} from '../../models/comercial';
import {ParametrizacionesService} from 'app/main/center/parametrizaciones.service';
import {CreditosService} from 'app/main/creditos/creditos.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-notas-pedido',
  templateUrl: './notas-pedido.component.html',
  styleUrls: ['./notas-pedido.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class NotasPedidoComponent implements OnInit {
  @ViewChild('mensajeModal') mensajeModal;
  @ViewChild('mensajeAfirmacionl') mensajeAfirmacionl;
  @ViewChild('mensajeConfirModal') mensajeConfirModal;
  @ViewChild('ConfirVent') ConfirVent;
  @ViewChild('ConfirVentCred') ConfirVentCred;
  @ViewChild(NgbPagination) paginator: NgbPagination;
  public confirmarDatosForm: FormGroup;
  public confirmarDatosForm2: FormGroup;
  codigos;
  public confirmarDatosSubmit = false;
  public confirmarDatosSubmit2 = false;
  public mensaje;
  public iscodeCLi = false;
  public confirmacionGuardarpedido = false;
  public iscodeCorp = false;
  public submittedNotaPedidoForm = false;
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public tipoIdentificacionOpciones;
  public items = [{itemId: '', itemName: '', itemQuantity: '', itemCost: ''}];
  public notaPedidoForm: FormGroup;
  public notaPedido: NotaPedido;
  public datosConfir: Credito;
  public usuario;
  public iva;
  public item = {
    itemName: '',
    itemQuantity: '',
    itemCost: '',
  };
  public numRegex = /^-?\d*[.,]?\d{0,2}$/;
  public apiData;
  public detalles = [];
  public detallesTransac;
  public sidebarToggleRef = false;
  public invoiceSelect = [];
  public invoiceSelected;

  public listaNotasPedido: [] = [];
  public nombresCompleto: string = '';
  public cedula: string = '';
  credito_id: any;
  public notePedido_id = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _coreSidebarService: CoreSidebarService,
    private _notasPedidoService: NotasPedidoService,
    private datePipe: DatePipe,
    private _coreMenuService: CoreMenuService,
    private paramService: ParametrizacionesService,
    private modalService: NgbModal,
    private _creditosService: CreditosService
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    this.codigos = {estado: '', codigoUsuario: '', codigoCorp: ''};
    this.usuario = this._coreMenuService.grpCorpUser;
    this.notaPedido = this.inicializarNotaPedido();

    this.notaPedido.nombreVendedor =
      this.usuario.persona.nombres + ' ' + this.usuario.persona.apellidos;

    this.iva = this.inicializarIva();
    this.datosConfir = this.inicializarCredito();
  }

  inicializarNotaPedido(): NotaPedido {
    return {
      id: '',
      numeroFactura: '',
      fecha: this.transformarFecha(new Date()),
      tipoIdentificacion: '',
      identificacion: '',
      razonSocial: '',
      direccion: '',
      telefono: '',
      correo: '',
      nombreVendedor:
        this.usuario.persona.nombres + ' ' + this.usuario.persona.apellidos,
      subTotal: 0,
      descuento: 0,
      iva: 0,
      total: 0,
      canal: '',
      numeroProductosComprados: 0,
      user_id: '',
      detalles: [],
      credito: '',
      empresaComercial: this.usuario.empresa._id,
    };
  }

  ngOnInit(): void {
    this.notaPedidoForm = this._formBuilder.group({
      // fecha: ['', [Validators.required]],
      tipoIdentificacion: ['', [Validators.required]],
      identificacion: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      nombreVendedor: ['', [Validators.required]],
      // canal: ['', [Validators.required]],
      detalles: this._formBuilder.array([]),
    });
    this.crearDetalleGrupo();

    this.confirmarDatosForm = this._formBuilder.group(
      {
        nroAutCli: ['', [Validators.required]],
        nroAutCliAux: [''],
        nroAutCorp: ['', [Validators.required]],
        nroAutCorpAux: [''],
        nroFact: ['', [Validators.required]],
        nroVenta: [
          '',
          [
            Validators.required,
            Validators.pattern('[0-9]+([,.][0-9]{1,2})?'),
            // Validators.pattern(this.numRegex),
            Validators.min(1),
          ],
        ],
        nroVentaAux: [0],
      },
      {
        validator: [
          this.compararCodigos('nroAutCli', 'nroAutCliAux'),
          this.compararCodigos2('nroAutCorp', 'nroAutCorpAux'),
          this.compararMontoVenta('nroVenta', 'nroVentaAux'),
        ],
      }
    );
    this.confirmarDatosForm2 = this._formBuilder.group({
      confir1: ['', [Validators.required, Validators.requiredTrue]],
      confir2: ['', [Validators.required, Validators.requiredTrue]],
      confir3: ['', [Validators.required, Validators.requiredTrue]],
      confir4: ['', [Validators.required, Validators.requiredTrue]],
    });
    this.invoiceSelect = this.apiData;
    this.invoiceSelected = this.invoiceSelect;
    this.inicializarDetalles();
    this.obtenerIVA();
    this.obtenerTipoIdentificacionOpciones();
  }

  inicializarCredito(): Credito {
    return {
      numero: '',
      correoCorp: '',
      canal: '',
      monto: '',
      plazo: '',
      aceptaTerminos: '',
      estado: '',
      user_id: '',
      reporteBuro: '',
      calificacionBuro: '',
      buroValido: '',
      identificacion: '',
      ruc: '',
      rolesPago: '',
      panillaIESS: '',
      tomarSolicitud: '',
      fechaAprobacion: '',
      tipoCredito: '',
      concepto: '',
      documentoAprobacion: '',
      empresasAplican: '',
      vigencia: '',
      interes: '',
      nombres: '',
      apellidos: '',
      nombresCompleto: '',
      fechaAprobado: '',
      numeroIdentificacion: '',
      codigoCliente: '',
      codigoCorp: '',
      numeroFactura: '',
      montoVenta: '',
      checkPagare: '',
      checkTablaAmortizacion: '',
      checkManualPago: '',
      checkCedula: '',
      created_at: '',
      updated_at: '',
      state: '',
      entidadFinanciera: '',
      empresaIfis_id: '',
      imagen: '',
      empresaComercial_id: '',
      whatsappPersona: '',
      emailPersona: '',
      telefono1: '',
      nombreComercial: '',
    };
  }

  inicializarIva(): Iva {
    return {
      created_at: '',
      descripcion: '',
      id: '',
      idPadre: '',
      nombre: '',
      tipo: '',
      tipoVariable: '',
      updated_at: '',
      valor: 0,
    };
  }

  inicializarDetalle(facturaEncabezado_id?) {
    return {
      id: 0,
      articulo: '',
      valorUnitario: 0,
      cantidad: 0,
      precio: 0,
      codigo: '',
      informacionAdicional: '',
      descuento: 0,
      impuesto: 0,
      valorDescuento: 0,
      facturaEncabezado: facturaEncabezado_id ? facturaEncabezado_id : 0,
    };
  }

  crearDetalleGrupo(detalle?) {
    const control = this.notaPedidoForm.controls.detalles as FormArray;
    control.push(
      this._formBuilder.group({
        // codigo: ['', [Validators.required]],
        articulo: [detalle?.articulo || '', [Validators.required]],
        valorUnitario: [detalle?.valorUnitario || 0, [Validators.required]],
        cantidad: [
          detalle?.cantidad || 0,
          [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.min(1),
          ],
        ],
        precio: [detalle?.precio || 0, [Validators.required]],
        informacionAdicional: [
          detalle?.informacionAdicional || '',
          [Validators.required],
        ],
        descuento: [
          detalle?.descuento || 0,
          [Validators.required, Validators.pattern(this.numRegex)],
        ],
        valorDescuento: [detalle?.valorDescuento || 0, [Validators.required]],
        facturaEncabezado: [
          detalle?.facturaEncabezado || 0,
          [Validators.required],
        ],
      })
    );
  }

  transformarFecha(fecha) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }

  get detallesArray(): FormArray {
    return this.notaPedidoForm.get('detalles') as FormArray;
  }

  get tForm() {
    return this.notaPedidoForm.controls;
  }

  get confrimacionForm() {
    return this.confirmarDatosForm.controls;
  }

  get confrimacionForm2() {
    return this.confirmarDatosForm2.controls;
  }

  compararCodigos2(nroAutCorp, nroAutCorpAux: string) {
    return (group: FormGroup) => {
      const nroAutCorpInput = group.controls[nroAutCorp];
      const nroAutCorpInputAux = group.controls[nroAutCorpAux];

      if (nroAutCorpInput.value !== nroAutCorpInputAux.value) {
        return nroAutCorpInput.setErrors({
          codigoCorp: {
            valid: false,
          },
        });
      }
    };
  }

  compararCodigos(nroAutCli: string, nroAutCliAux: string) {
    return (group: FormGroup) => {
      const nroAutCliInput = group.controls[nroAutCli];
      const nroAutCliInputAux = group.controls[nroAutCliAux];

      if (nroAutCliInput.value !== nroAutCliInputAux.value) {
        return nroAutCliInput.setErrors({
          codigoUsuario: {
            valid: false,
          },
        });
      }
    };
  }

  compararMontoVenta(nroVenta: string, nroVentaAux: string) {
    return (group: FormGroup) => {
      const nroVentaInput = group.controls[nroVenta];
      const nroVentaInputAux = group.controls[nroVentaAux];

      if (nroVentaInput.value > nroVentaInputAux.value) {
        return nroVentaInput.setErrors({
          montoDisponible: {
            valid: false,
          },
        });
      }
    };
  }

  generatePdf(action = 'open', Documentpdf) {
    const getDocument =
      Documentpdf === 'pagare'
        ? this.getDocumentPagare()
        : this.getDocumentTblAmortizacion();

    switch (action) {
      case 'open':
        pdfMake.createPdf(getDocument).open();
        break;
      case 'print':
        pdfMake.createPdf(getDocument).print();
        break;
      case 'download':
        pdfMake.createPdf(getDocument).download();
        break;

      default:
        pdfMake.createPdf(getDocument).open();
        break;
    }
  }

  getDocumentPagare() {
    return {
      content: [
        {
          text: 'Pagaré',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            [
              {
                text: 'WhatsApp: ' + this.datosConfir.whatsappPersona,
                style: 'name',
              },
              {
                text: 'Nombres: ' + this.datosConfir.nombres,
              },
              {
                text: 'Apellidos: ' + this.datosConfir.apellidos,
              },
              {
                text: 'Tipo Crédito:  ' + this.datosConfir.tipoCredito,
              },
            ],
          ],
        },
        {
          text: 'Skills',
          style: 'header',
        },
      ],
      info: {
        title: '_RESUME',
        author: 'this.resume.name',
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline',
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }

  getDocumentTblAmortizacion() {
    return {
      content: [
        {
          text: 'Tabla Amortización',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            [
              {
                text: 'WhatsApp: ' + this.datosConfir.whatsappPersona,
                style: 'name',
              },
              {
                text: 'Nombres: ' + this.datosConfir.nombres,
              },
              {
                text: 'Apellidos: ' + this.datosConfir.apellidos,
              },
              {
                text: 'Tipo Crédito:  ' + this.datosConfir.tipoCredito,
              },
            ],
          ],
        },
        {
          text: 'Skills',
          style: 'header',
        },
      ],
      info: {
        title: '_RESUME',
        author: 'this.resume.name',
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline',
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }

  enviarMonto() {
    this.confirmarDatosSubmit = true;
    if (this.confirmarDatosForm.invalid) {
      return;
    }

    this._creditosService
      .actualizarCreditos({
        id: this.credito_id,
        codigoCliente: this.confirmarDatosForm.get('nroAutCli').value,
        codigoCorp: this.confirmarDatosForm.get('nroAutCorp').value,
        numeroFactura: this.confirmarDatosForm.get('nroFact').value,
        montoVenta: this.confirmarDatosForm.get('nroVenta').value,
        montoDisponible: this.confirmarDatosForm.get('nroVentaAux').value - this.confirmarDatosForm.get('nroVenta').value,
      })
      .subscribe(
        (info) => {
          this.cerrarModal();
          this.abrirModal(this.ConfirVentCred);
        },
        (error) => {
        }
      );
  }

  confirmar() {
    this.confirmarDatosSubmit2 = true;

    if (this.confirmarDatosForm2.invalid) {
      return;
    }

    this._creditosService
      .actualizarCreditos({
        id: this.credito_id,
        checkPagare: this.confirmarDatosForm2.get('confir1').value,
        checkTablaAmortizacion: this.confirmarDatosForm2.get('confir2').value,
        checkManualPago: this.confirmarDatosForm2.get('confir3').value,
        checkCedual: this.confirmarDatosForm2.get('confir4').value,
        estado: 'Venta a Credito Concretado',
      })
      .subscribe(
        (info) => {
          this._notasPedidoService.actualizarNotaPedido({
            id: this.notaPedido.id,
            estado: 'Venta a Credito Concretado'
          })
            .subscribe(() => {
              this.obtenerListaNotasPedido();
        });
          this.cerrarModal();
          this.abrirModal(this.mensajeConfirModal);
        },
        (error) => {
        }
      );
  }

  toggleSidebar(name, id): void {
    if (id === '') {
      this.inicializarNotaPedido();
    } else {
      this._notasPedidoService.obtenerNotaPedido(id).subscribe(
        (info) => {
          this.notaPedido = info;
          this.detalles = info.detalles;
          // Vaciar array de los controles
          const control = this.notaPedidoForm.controls.detalles as FormArray;
          control.controls = [];
          // Iniciar los arrays de los detalles que se devuelve del back
          for (const detalle of info.detalles) {
            this.crearDetalleGrupo(detalle);
          }
        },
        (error) => {
        }
      );
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  public dateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass:
      'form-control flat-picker flatpickr-input invoice-edit-input',
    defaultDate: ['2020-05-01'],
    altFormat: 'Y-n-j',
  };
  public dueDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass:
      'form-control flat-picker flatpickr-input invoice-edit-input',
    defaultDate: ['2020-05-17'],
    altFormat: 'Y-n-j',
  };

  ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaNotasPedido();
  }

  obtenerCliente() {
    this._notasPedidoService
      .obtenerInformacionPersona({
        identificacion: this.notaPedido.identificacion,
      })
      .subscribe(
        (info) => {
          this.notaPedido.identificacion = info.identificacion;
          this.notaPedido.razonSocial = info.nombres + ' ' + info.apellidos;
          this.notaPedido.telefono = info.telefono;
          this.notaPedido.direccion = info.direccion;
          this.notaPedido.correo = info.email;
          this.notaPedido.user_id = info.user_id;
        },
        (error) => {
        }
      );
  }

  inicializarDetalles() {
    this.detalles = [];
    this.detalles.push(this.inicializarDetalle());
  }

  addItem() {
    this.detalles.push(this.inicializarDetalle(this.notaPedido.id));

    this.crearDetalleGrupo({facturaEncabezado: this.notaPedido.id});
  }

  deleteItem(i) {
    this.detalles.splice(i, 1);
    this.calcularSubtotal();
    this.detallesArray.removeAt(i);
    // for (let i = 0; i < this.items.length; i++) {
    //   if (this.items.indexOf(this.items[i]) === id) {
    //     this.items.splice(i, 1);
    //     break;
    //   }
    // }
  }

  calcularSubtotal() {
    const detalles = this.detalles;
    let subtotal = 0;
    let descuento = 0;
    let cantidad = 0;
    if (detalles) {
      detalles.map((valor) => {
        const valorUnitario = Number(valor.valorUnitario)
          ? Number(valor.valorUnitario)
          : 0;
        const porcentDescuento = valor.descuento ? valor.descuento : 0;
        const cantidadProducto = valor.cantidad ? valor.cantidad : 0;
        const precio = cantidadProducto * valorUnitario;

        valor.valorDescuento = this.redondeoValor(
          precio * (porcentDescuento / 100)
        );
        descuento += precio * (porcentDescuento / 100);
        subtotal += precio;
        cantidad += valor.cantidad ? valor.cantidad : 0;
        valor.precio = this.redondear(precio);
        valor.total = valor.precio;
      });
    }

    this.notaPedido.numeroProductosComprados = cantidad;
    this.detallesTransac = detalles;
    this.notaPedido.subTotal = this.redondear(subtotal);
    this.notaPedido.iva = this.redondear(
      (subtotal - descuento) * this.iva.valor
    );
    this.notaPedido.descuento = this.redondear(descuento);
    this.notaPedido.total = this.redondear(
      subtotal - descuento + this.notaPedido.iva
    );
  }

  confirmarPedido(afirm) {
    if (afirm) {
      this.cerrarModal();
      this.calcularSubtotal();
      this.notaPedido.detalles = this.detallesTransac;

      if (this.notaPedido.id) {

        this._notasPedidoService
          .actualizarNotaPedido(this.notaPedido)
          .subscribe(
            (info) => {
              this.obtenerListaNotasPedido();
              this.toggleSidebar('factura', '');
              this.mensaje = 'Nota de pedido actualizada con éxito';
              this.abrirModal(this.mensajeModal);
            },
            (error) => {
            }
          );
      } else {
        this._notasPedidoService.crearNotaPedido(this.notaPedido).subscribe(
          (info) => {
            this.obtenerListaNotasPedido();
            this.toggleSidebar('factura', '');
            this.mensaje = 'Nota de pedido creada con éxito';
            this.abrirModal(this.mensajeModal);
          },
          (error) => {
          }
        );
      }
    } else {
      return;
    }
  }

  guardarNotaPedido() {
    this.submittedNotaPedidoForm = true;
    if (this.notaPedidoForm.invalid) {
      return;
    }
    if (!this.notaPedido.user_id) {
      this.mensaje =
        'Necesita encontrar un usuario para crear la nota de pedido';
      this.abrirModal(this.mensajeModal);
      return;
    }

    this.abrirModal(this.mensajeAfirmacionl);
  }

  oculatrCorreo(correo) {
    return (
      'xxxxxxxx' +
      correo.substring(correo.toString().indexOf('@') - 4, correo.length)
    );
  }

  oculatrTelefono(numero) {
    return 'xxxx' + numero.substring(6, numero.length);
  }

  confirDatos(notaPedido) {
    this.credito_id = notaPedido.credito;
    this.notaPedido = notaPedido;
    this._creditosService.obtenerCredito(this.credito_id).subscribe(
      (info) => {
        this.datosConfir = info;

        this._notasPedidoService
          .generarCodigo({
            _id: this.credito_id,
            user_id: this.datosConfir.user_id,
            empresaComercial_id: this.datosConfir.empresaComercial_id,
          })
          .subscribe((info) => {
              this.confirmarDatosForm.controls['nroAutCliAux'].setValue(
                info.codigoUsuario
              );
              this.confirmarDatosForm.controls['nroAutCorpAux'].setValue(
                info.codigoCorp
              );
              this.confirmarDatosForm.controls['nroVentaAux'].setValue(
                info.montoDisponible
              );
              this.codigos = info;

              // this.datosConfir = info;
            },
            (error) => {
            }
          );
      },
      (error) => {
      }
    );

    this.abrirModal(this.ConfirVent);
  }

  redondear(num, decimales = 2) {
    var signo = num >= 0 ? 1 : -1;
    num = num * signo;
    if (decimales === 0)
      //con 0 decimales
    {
      return signo * Math.round(num);
    }
    // round(x * 10 ^ decimales)
    num = num.toString().split('e');
    num = Math.round(
      +(num[0] + 'e' + (num[1] ? +num[1] + decimales : decimales))
    );
    // x * 10 ^ (-decimales)
    num = num.toString().split('e');
    let valor =
      signo *
      Number(num[0] + 'e' + (num[1] ? +num[1] - decimales : -decimales));
    return valor;
  }

  redondeoValor(valor) {
    return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
  }

  obtenerListaNotasPedido() {
    this._notasPedidoService
      .obtenerListaNotasPedido({
        page: this.page - 1,
        page_size: this.page_size,
        cedula: this.cedula,
        nombresCompleto: this.nombresCompleto,
        empresa_comercial: this.usuario.empresa._id,
      })
      .subscribe((info) => {
        this.listaNotasPedido = info.info;
        this.collectionSize = info.cont;
      });
  }

  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaNotasPedido();
    });
  }

  obtenerTipoIdentificacionOpciones() {
    this.paramService
      .obtenerListaPadres('TIPO_IDENTIFICACION')
      .subscribe((info) => {
        this.tipoIdentificacionOpciones = info;
      });
  }

  async obtenerIVA() {
    await this.paramService
      .obtenerParametroNombreTipo('ACTIVO', 'TIPO_IVA')
      .subscribe(
        (info) => {
          this.iva = info;
        },
        (error) => {
          this.mensaje = 'Iva no configurado';
          this.abrirModal(this.mensajeModal);
        }
      );
  }

  abrirModal(modal) {
    this.modalService.open(modal, {
      backdrop: false,
      centered: true,
    });
  }

  cerrarModal() {
    this.modalService.dismissAll();
  }
}
