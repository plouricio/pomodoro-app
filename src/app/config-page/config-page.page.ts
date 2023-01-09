import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserConfig } from '../interfaces/config.interface';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.page.html',
  styleUrls: ['./config-page.page.scss'],
})
export class ConfigPagePage implements OnInit {

  data : any;
  configForm : any;

  constructor(private formBuilder: FormBuilder, private modalController : ModalController) { }

  ngOnInit() {
    this.generateForm();
    this.fillInputs();
  }

  saveConfig(){
    console.log(this.configForm.value)
  }

  fillInputs(){

  }

  generateForm(){
    this.configForm = this.formBuilder.group({
      pomodoroTimer : [this.data.pomodoroTimer,[Validators.required]],
      shortBreakTimer : [this.data.shortBreakTimer,[Validators.required]],
      longBreakTimer : [this.data.longBreakTimer,[Validators.required]],
   
    })   
  }

 
  save() {
    let touched;

    if(this.configForm.touched){
      touched=true;
      this.modalController.dismiss(
        {
          config: this.configForm.value,
          touched: touched
        }
      )
    }else{
      touched=false;
    }
   
  }
  

}
