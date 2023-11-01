import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import pagina from '../interfaces/pagina.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginaService {

  constructor(private firestore: Firestore) { }

  addPagina(pagina: pagina) {
    const paginaRef = collection(this.firestore, 'pgina-juridica');
    return addDoc(paginaRef, pagina);
  }

  getPagina(): Observable<pagina[]>{
    const paginaRef = collection(this.firestore, 'pgina-juridica');
    return collectionData(paginaRef, {idField: 'id'}) as Observable<pagina[]>;
  }
}
