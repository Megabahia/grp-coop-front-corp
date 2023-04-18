import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-saldo-disponible',
  templateUrl: './saldo-disponible.component.html',
  styleUrls: ['./saldo-disponible.component.scss']
})
export class SaldoDisponibleComponent implements OnInit {

  public page_size: any = 10;
  public collectionSize;
  public page = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
