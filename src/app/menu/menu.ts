import {CoreMenu} from '@core/types';
import {Role} from '../auth/models/role';

export const menu: CoreMenu[] = [
  {
    id: 'inicio',
    title: 'Inicio',
    // translate: 'MENU.HOME',
    // role: [Role.SuperMonedas],
    type: 'item',
    icon: 'home',
    url: 'personas/inicio',

  },
  {
    id: 'corp',
    title: 'Corp',
    // role: [Role.SuperMonedas],
    // translate: 'MENU.PAGES.SECTION',
    type: 'collapsible',
    icon: 'coffee',
    children: [
      {
        id: 'misEmpleados',
        title: 'CARGAR EMPLEADOS',
        // translate: 'MENU.APPS.EMAIL',
        type: 'collapsible',
        icon: 'users',
        children: [
          {
            id: 'nominaEmpleados',
            title: 'Nómina de empleados',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'corp/nomina-empleados'
          },
          {
            id: 'solicitarCreditos',
            title: 'Solicitar créditos para mis empleados',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'confirmarAutorizacion',
            title: 'Confirmar autorización de débito del ROLL',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'aprobacionSolicitud',
            title: 'Aprobación de solicitud de créditos',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'registroCreditos',
            title: 'Registro de créditos',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
        ]
      },
      {
        id: 'lineasCredito',
        title: 'Líneas de crédito',
        // translate: 'MENU.APPS.EMAIL',
        type: 'collapsible',
        icon: 'credit-card',
        children: [
          {
            id: 'misLineasCredito',
            title: 'Mis líneas de crédito',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'appLineaProv',
            title: 'Aplicar línea de crédito para pago Proveedores',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'appLineaNom',
            title: 'Aplicar línea de crédito para pago de nómina',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'consultaLineas',
            title: 'Consultas de líneas de crédito',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
        ]
      },
      {
        id: 'suoerMonedas',
        title: 'Super monedas',
        // translate: 'MENU.APPS.EMAIL',
        type: 'collapsible',
        icon: 'dollar-sign',
        children: [
          {
            id: 'cargarSuperMonedas',
            title: 'Cargar super monedas a empleados',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          }
        ]
      },
      {
        id: 'descuentosROLL',
        title: 'Descuentos de ROLL',
        // translate: 'MENU.APPS.EMAIL',
        type: 'collapsible',
        icon: 'folder-minus',
        children: [
          {
            id: 'descontarEmpleados',
            title: 'Descontar a empleados',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          }
        ]
      },
      {
        id: 'comisiones',
        title: 'Comisiones',
        // translate: 'MENU.APPS.EMAIL',
        type: 'collapsible',
        icon: 'plus-square',
        children: [
          {
            id: 'misComisiones',
            title: 'Mis comisiones',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          }
        ]
      },
    ]
  },
  {
    id: 'bigPuntos',
    title: 'BIG PUNTOS',
    // role: [Role.SuperMonedas],
    // translate: 'MENU.PAGES.SECTION',
    type: 'collapsible',
    icon: 'dollar-sign',
    children: [
      {
        id: 'cobrarConSuperMonedas',
        title: 'Cobrar con Super Monedas',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        icon: 'users',
        url: '/bigpuntos/cobrar'
      },
      {
        id: 'reporteCobrosConSupermonedas',
        title: 'Reporte de Cobros con Supermonedas',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        icon: 'users',
        url: '/bigpuntos/reporteCobros'
      },
      {
        id: 'clientes',
        title: 'Clientes',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        icon: 'users',
        url: 'personas/supermonedas/mis-monedas'
      },
      {
        id: 'productos',
        title: 'Productos',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        icon: 'shopping-bag',
        url: 'personas/supermonedas/mis-monedas'
      },
      {
        id: 'cargarMonedas',
        title: 'Cargar Big Puntos',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        icon: 'dollar-sign',
        url: 'corp/cargar-bigpuntos'
      },
      // {
      //   id: 'cargarPremios',
      //   title: 'Cargar Premios',
      //   // translate: 'MENU.APPS.EMAIL',
      //   type: 'item',
      //   icon: 'package',
      //   url: 'personas/supermonedas/mis-monedas'
      // },
      {
        id: 'cargarPremios',
        title: 'Cargar Premios',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        icon: 'package',
        url: 'personas/supermonedas/mis-monedas'
      }, {
        id: 'mdoMotorOfertas',
        title: 'MDO Motor de Ofertas',
        // translate: 'MENU.PAGES.SECTION',
        type: 'collapsible',
        icon: 'file-text',
        children: [
          {
            id: 'parametrizacion',
            title: 'Parametrización',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'prediccionesCrosseling',
            title: 'Predicciones para crosseling',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'prediccionesRefil',
            title: 'Predicciones para refil',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'prediccionesNuevosProductos',
            title: 'Predicciones para nuevos productos',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          },
          {
            id: 'generarOfertaCliente',
            title: 'Generar oferta para cliente',
            // translate: 'MENU.APPS.EMAIL',
            type: 'item',
            icon: 'circle',
            url: 'personas/supermonedas/mis-monedas'
          }]
      }
    ]
  },
  {
    id: 'comercial',
    title: 'Comercial',
    // translate: 'MENU.PAGES.SECTION',
    type: 'collapsible',
    icon: 'shopping-bag',
    children: [
      // {
      //   id: 'notasPedido',
      //   title: 'Notas de pedido',
      //   // translate: 'MENU.APPS.EMAIL',
      //   type: 'item',
      //   icon: 'dollar-sign',
      //   url: 'comercial/notas-pedido'
      // },
      {
        id: 'consulta-creditos-aprobados',
        title: 'Consulta de creditos aprobados',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/consulta-creditos-aprobados'
      },
      {
        id: 'facturacion',
        title: 'Facturación',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/facturacion'
      },
      {
        id: 'documentos-habilitantes',
        title: 'Documentos habilitantes',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/documentos-habilitantes'
      },
      {
        id: 'envio-doocumentos',
        title: 'Envió de documentos',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/envio-doocumentos'
      },
      {
        id: 'guia-remision',
        title: 'Guía de remisión',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/guia-remision'
      },
      {
        id: 'envios-realizados',
        title: 'Envíos realizados',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/envios-realizados'
      },
      {
        id: 'envios-realizados',
        title: 'Solicitudes de Pago',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/solicitud-pagos'
      },
      {
        id: 'saldo-contable',
        title: 'Saldo contable',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/saldo-contable'
      },
      {
        id: 'saldo-disponible',
        title: 'Saldo disponible',
        // translate: 'MENU.APPS.EMAIL',
        type: 'item',
        // icon: 'dollar-sign',
        url: 'comercial/saldo-disponible'
      },
      // {
      //   id: 'solicitudesCredito',
      //   title: 'Solicitudes de crédito',
      //   // translate: 'MENU.APPS.EMAIL',
      //   type: 'item',
      //   icon: 'dollar-sign',
      //   url: '/comercial/solicitudes-de-credito'
      // },
      // {
      //   id: 'creditosPreAprobados',
      //   title: 'Créditos pre aprobados',
      //   // translate: 'MENU.APPS.EMAIL',
      //   type: 'item',
      //   icon: 'credit-card',
      //   url: 'personas/bigpuntos/mis-monedas'
      // },
    ]
  }
];
