import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ConfigPagePage } from '../config-page/config-page.page';
import { UserConfig } from '../interfaces/config.interface';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('tickingClock', [
      state('tickIn', style({
        opacity: 1,
        fontSize:'12.5rem',
      })),
      state('tickOut', style({
        opacity: 0.5,
        fontSize: '12rem',
      })),
      transition('tickIn => tickOut', [
        animate('0.3s')
      ]),
      transition('tickOut => tickIn', [
        animate('0.3s')
      ]),
    ]),
  ],
})
export class HomePage implements OnInit{


  userConfigs ={
    pomodoroTimer: 2,
    shortBreakTimer: 1,
    longBreakTimer: 1,
  }

  intervals ={
    pomodoroTimer: {title:"Pomodoro",time:this.userConfigs.pomodoroTimer*60, default: 5, active: false},
    shortBreak :{title:"Short break",time:this.userConfigs.shortBreakTimer*60, default: 2, active: false},
    longBreak : {title:"Long break",time:this.userConfigs.longBreakTimer*60, default: 3, active: false}
  }
  
  pomodoros = 0;

  clockInterval:any;
  activeInterval = false;

  time:any;
  ticking = false;
  dataFromModal:any;
  actualInterval : any;
  messages = {
    finishedShortBreak:{
      header: "FINALIZADO EL DESCANSO",
      subheader: "A TRABAJAR!",
      message: ""
    },
    finishedLongBreak:{
      header: "FINALIZADO EL DESCANSO LARGO",
      subheader: "A TRABAJAR!",
      message: "PONTE A TRABAJAR ESCLAVO CULIAO"
    },
    finishedPomodoro:{
      header: "FINALIZAO",
      subheader: "BACAN TERMINASTE EL POMODORO",
      message: "WENA CULIAO LE PUSISTE"
    },
    error:{
      header: "ERROR",
      subheader: "ERROR",
      message: "ERROR",
    }
  }


  constructor( private alertController: AlertController,
    private cdRef:ChangeDetectorRef,
    private modalController: ModalController) {
  
   
  }

  ngOnInit(): void {
    this.actualInterval= this.intervals.pomodoroTimer;
    this.time = this.toTime(this.actualInterval.time)
    console.log("ngONINit actual intelval", this.actualInterval)
  }


  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.ticking= false;
    this.cdRef.detectChanges();
  }
 

  startInterval(actualInterval:any = this.actualInterval){
    if(!this.activeInterval){
      this.activeInterval = true;
      this.clockInterval= setInterval(this.decreaseTime.bind(this,actualInterval),1000)
    }
  
  }


  decreaseTime(timer:any){
    timer.time--
    timer.active = true;
    this.ticking = true;
    this.time = this.toTime(timer.time)
    if(timer.time < 0){
      this.stopInterval();
    
      if(this.intervals.pomodoroTimer.active === true ){
        this.swapToBreak();
      }else if (this.intervals.pomodoroTimer.active === false ){
        this.swapToPomodoro();
      }
  
    }

  }

  swapToBreak(){
    this.intervals.pomodoroTimer.active = false;
    this.pomodoros++

    if(this.pomodoros < 4){
      this.swapToShortBreak()
    } else if(this.pomodoros >= 4) {
      this.swapToLongBreak();
      this.pomodoros = 0;
    }

    console.log(this.actualInterval)
    this.time = this.toTime(this.actualInterval.time)
    
  } 

  swapToShortBreak(){
    this.presentAlert(this.messages.finishedPomodoro)
    if(this.intervals.shortBreak.time <= 0){
      this.intervals.shortBreak.time = this.intervals.shortBreak.default;
    }  
    this.actualInterval= this.intervals.shortBreak;
    this.actualInterval.active = true;
  }

  swapToLongBreak(){
    this.presentAlert(this.messages.finishedPomodoro)
    if(this.intervals.longBreak.time <= 0){
      this.intervals.longBreak.time = this.intervals.longBreak.default;
    }  
    this.actualInterval= this.intervals.longBreak;
    this.actualInterval.active = true;
  }

  swapToPomodoro(){
    this.presentAlert(this.messages.finishedShortBreak)
    this.resetBreaks();
    this.intervals.pomodoroTimer.time= this.intervals.pomodoroTimer.default;
    this.actualInterval= this.intervals.pomodoroTimer;
    this.actualInterval.active=true;
    this.time = this.toTime(this.actualInterval.time)
  }

  resetBreaks(){
    this.intervals.shortBreak.active = false;
    this.intervals.longBreak.active = false;
  }

  stopInterval(){
    clearInterval(this.clockInterval)
    this.activeInterval = false;
  }

  toTime(sec_num:number){
    var hours : any = Math.floor(sec_num / 3600);
    var minutes : any= Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds : any = sec_num - (hours * 3600) - (minutes * 60);


    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    if(hours <= 0 && minutes <= 0 && seconds <= 0) {
      return '00:00:00'
    }

    return hours+':'+minutes+':'+seconds;
  } 

  updateConfig(){
    this.stopInterval();
    this.pomodoros = 0;
    if(this.dataFromModal.data){
      this.userConfigs = JSON.parse(JSON.stringify(this.dataFromModal.data.config))
    }

    this.intervals.pomodoroTimer.time= this.userConfigs.pomodoroTimer*60;
    this.intervals.shortBreak.time= this.userConfigs.shortBreakTimer*60;
    this.intervals.longBreak.time= this.userConfigs.longBreakTimer*60;
    this.ngOnInit()
    this.cdRef.detectChanges();
  }
  
  async presentAlert(objectMessage?:any) {
    if(!objectMessage){
      objectMessage = {
        header:'Alert!',
        subheader:'Alert',
        message:'Alert',
      }
    }
    const {header,subheader,message} = objectMessage;

    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async openConfig() {

    const modal = await this.modalController.create({
      component: ConfigPagePage,
      componentProps: {
        data: this.userConfigs,
      },
    });
    
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.dataFromModal = modelData;
        if(this.dataFromModal.data.touched){
          this.updateConfig();
        }
    
      }
    });

    return await modal.present();

  }


}
