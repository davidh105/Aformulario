import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// sacar pdf

import { jsPDF } from 'jspdf';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import {debounceTime} from 'rxjs/operators';

import { PaginaService } from 'src/app/services/pagina.juridica.service copy';
import { async } from '@angular/core/testing';
import { asyncScheduler } from 'rxjs';
import { Firestore, serverTimestamp } from '@angular/fire/firestore';
import pagina from 'src/app/interfaces/pagina.interface';

import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { PointGroup } from 'signature_pad';
import { Storage, ref, uploadBytes, getStorage, getDownloadURL, StorageReference} from '@angular/fire/storage';
import { firebaseApp$ } from '@angular/fire/app';
import { HtmlParser, HtmlTagDefinition } from '@angular/compiler';




@Component({
  selector: 'app-pagina1',
  templateUrl: './pagina1.component.html',
  styleUrls: ['./pagina1.component.css'],
  
})



export class Pagina1Component  {


  form!: FormGroup;
  doc!: jsPDF;

  constructor(private router: Router, private formBuilder: FormBuilder, 
    private paginaService: PaginaService, private storage: Storage
    ) {
    this.BuildForm();
    }

  
  navegar() {
    this.router.navigate(["/home"]);
  }
  

  ngOnInit( ){

    this.form = this.formBuilder.group({
    });

    for (let i = 1; i <= 33; i++) {
      this.form.addControl(`D1_in${i}`, new FormControl('', [Validators.required]));
     }

    for (let i = 1; i <= 45; i++) {
      this.form.addControl(`D2_in${i}`, new FormControl('', [Validators.required]));
     }

    for (let i = 1; i <= 7; i++) {
      this.form.addControl(`D3_in${i}`, new FormControl('', [Validators.required]));
     }

    for (let i = 1; i <= 8; i++) {
      this.form.addControl(`D4_in${i}`, new FormControl('', [Validators.required]));
     }

    for (let i = 1; i <= 5; i++) {
      this.form.addControl(`D5_in${i}`, new FormControl('', [Validators.required]));
     }

     for (let i = 1; i <= 2; i++) {
      this.form.addControl(`D6_in${i}`, new FormControl('', [Validators.required]));
      this.form.addControl(`D8_in${i}`, new FormControl('', [Validators.required]));
     }

     for (let i = 1; i <= 23; i++) {
      this.form.addControl(`D7_in${i}`, new FormControl('', [Validators.required]));
     }

     for (let i = 1; i <= 6; i++) {
      this.form.addControl(`D15_in${i}`, new FormControl('', [Validators.required]));
     }

        
  }

  // comienza logica pdf

  async pdf() {
    const doc = new jsPDF({ unit: 'pt', format: [1550, 1350], compress:  true });
  
    const bodyElement = document.querySelectorAll('body')[1];
  
    // Wait for the content to be completely loaded
    await new Promise((resolve) => {
      if (document.readyState == 'complete') {
        resolve(undefined);
      } else {
        window.addEventListener('load', resolve);
      }
    });
      
    await doc.html(bodyElement);

    
    doc.save('download.pdf');

  }
  // termina logica pdf
  
  
  private BuildForm(): void {
    this.paginaService.getPagina(). subscribe(pagina =>{
      console.log(pagina)

    })
  }

  save(event: Event){
    event.preventDefault();
    //if (this.form.valid){
      const response = this.paginaService.addPagina(this.form.value);
      
      console.log(response);
    //} else{
      this.form.markAllAsTouched();
      
    //}
  }

  // aqui comienza logica firma

  IsDrwan = false;

  private history:PointGroup[] = [];
  private future: PointGroup [] = [];
  @ViewChild('signature')
  public signaturePad!: SignaturePadComponent;
  public SignaturePadOptions: NgSignaturePadOptions = {
    minWidth: 1,
    canvasWidth: 300,
    canvasHeight: 100,
    penColor: 'black',
    backgroundColor: 'white', 
    dotSize: 1,
    maxWidth:1, 
    velocityFilterWeight:1
  }


  drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event
    console.log('Complete drawing', event);
    console.log(this.signaturePad.toDataURL());
    this.IsDrwan = true;

  }

  drawStart(event: MouseEvent |Touch) {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing', event);
  }

  clear(){
    this.history = [];
    this.future = [];
    this.signaturePad.clear();
  }

  redo(){
    if (this.history.length>=0 && this.future.length>0){
      var data = this.signaturePad.toData();
      if (data || data == undefined){
        const adddata:any = this.future.pop();
        data.push(adddata);
      }

      this.signaturePad.fromData(data);
    }
  }

  undo(){

    var data = this.signaturePad.toData();
    if (data || data == undefined){
        const removedStrock: any = data.pop();
        this.future.push(removedStrock);
        this.signaturePad.fromData(data);
    }
  }

  SavePNG(){
    if (this.signaturePad.isEmpty()){
      return alert('please provide a signature first' );

    }
    const data = this.signaturePad.toDataURL('img/png');
    const link = document.createElement('a');
    link.href = data; 
    link.download = 'signature.png';
    link.click();
  }


  Save(): any {
    
    const data = this.signaturePad.toDataURL('image/PNG');
    const blob = new Blob([data], { type: 'img/PNG' });

    const imgRef = ref(this.storage, `imgs_firma/`);

    
    uploadBytes(imgRef, blob).then(() => {
      // The image has been uploaded successfully
    }).catch((error) => {
      // The image has not been uploaded successfully
      console.log(error);
    })
    console.log(File);
  }


  uploadImage($event: any) {
    const file = $event.target.files[0];
    console.log(file);

    const imgRef = ref(this.storage, `imgs_firma/${file.name}`);
    uploadBytes(imgRef, file)
    .then(Respons => console.log(Respons))
    .catch(error => console.log(error));
  }

  preDefinedSignatureData: PointGroup[] = [];
  ngAfterViewInit(){
    this.signaturePad.set('minwidth', 5);
    this.signaturePad.fromData(this.preDefinedSignatureData);
    const canvas = this.signaturePad.getCanvas();
    if (canvas){
      const ctx = canvas.getContext('2d');
      if (ctx){
        const text = "signature_______________";
        const x = 20;
        const y = canvas.height-40; 
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(text,x,y);
      }
    }

  }

  
  
  // aqui termina logica firma

  


}


