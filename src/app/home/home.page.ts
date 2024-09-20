import { Component } from '@angular/core';
import { MenuController, AlertController, ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoadingService } from 'src/services/loading.service';
import { HomeService } from './home.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import _ from 'lodash';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

declare let cordova: any;
const STORAGE_KEY = 'image';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  form: FormGroup;
  image: any = "";
  isReady: boolean = true;
  notes: any = [];
  notes_favorite: any = [];
  edit = {
    note_title: null,
    note_description: null,
    note_favorite: null,
    note_file: null,

  };

  constructor(private alertController: AlertController, public toastController: ToastController, private localNotifications: LocalNotifications, private loginService: LoginService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController, private menu: MenuController, private formBuilder: FormBuilder, private loadingService: LoadingService, private homeService: HomeService) {
    this.form = this.formBuilder.group({
      note_title: ['', Validators.required],
      note_description: ['', Validators.required],
      note_favorite: [false],
      note_file: [''],
      note_edit: this.formBuilder.array([]),
      note_edit_favorite: this.formBuilder.array([]),
    });

  }
  ionViewWillEnter() {

    this.menu.enable(true, 'first');
    this.getNote();
  }

  reminderNote(arr) {
    // console.log(arr);
    // console.log(new Date(new Date().getTime() + 3600));
    this.presentToast();
    this.localNotifications.schedule({
      title: arr.value.note_title,
      text: arr.value.note_description,
      trigger: { at: new Date(new Date().getTime() + 3600) },
      led: 'FF0000',
      foreground: true,
      vibrate: true,
      // attachments: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzfXKe6Yfjr6rCtR6cMPJB8CqMAYWECDtDqH-eMnerHHuXv9egrw'],
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzfXKe6Yfjr6rCtR6cMPJB8CqMAYWECDtDqH-eMnerHHuXv9egrw',
    });
  }

  async openMenu() {
    await this.menu.open();
  }

  async uploadImage(arr?) {
    console.log(this.platform.platforms());
    if (this.platform.is('mobile')) {
      const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, arr);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, arr);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
        ]
      });
      await actionSheet.present();
    } else {
      console.log('Solo funciona usando un telefono!');
    }

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your notification has been save.',
      duration: 3000
    });
    toast.present();
  }


  logout() {
    this.loadingService.present();
    this.homeService.logout().subscribe(res => {
      this.loadingService.dismiss();
      this.loginService.isAuthenticated = false;
      this.router.navigate(['/login']);
    }, err => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
      this.router.navigate(['/login']);
    });
  }

  takePicture(sourceType: PictureSourceType, arr?) {

    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.isReady = false;
      let path = (<any>window).Ionic.WebView.convertFileSrc(imageData);
      if (this.platform.is('mobile') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {

        this.filePath.resolveNativePath(imageData)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let name = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
            let fullPath = filePath;
            var json = {
              path: path,
              correctPath: correctPath,
              name: name,
              fullPath: fullPath
            };

            this.image = json;
            this.convertirB64(correctPath, name, arr);
          });

      } else {
        let correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        let name = imageData.substr(imageData.lastIndexOf('/') + 1);
        let fullPath = imageData;
        var json = {
          path: path,
          correctPath: correctPath,
          name: name,
          fullPath: fullPath
        };

        this.image = json;
        this.convertirB64(correctPath, name, arr);
      }
    }, (err) => {
      // Handle error
    });

  }

  convertirB64(pathDirectory, name, form?) {
    this.file.readAsDataURL(pathDirectory, name).then(file64 => {
      this.isReady = true;
      let fileWithoutExtension = ('' + file64 + '').replace(/^data:image\/(png|jpg);base64,/, '');
      let file = ('' + file64 + '');
      form.get('note_file').setValue(file);
    }).catch(err => {
      this.isReady = true;
    });
  }

  createNote(event) {
    this.loadingService.present();
    this.homeService.createNote(this.form.value).subscribe((res) => {
      this.loadingService.dismiss();
      this.getNote();
      this.alertController.create({
        header: `OK`,
        message: `<b> ${res.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then((alert) => {
        alert.present().finally(() => {
          // this.router.navigate(['/login']);
        });
      });

    }, (err) => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());

    });

  }

  getNote() {
    this.notes_favorite = [];
    this.notes = [];
    this.homeService.getNote().subscribe(res => {
      const control = <FormArray>this.form.controls['note_edit'];
      const control2 = <FormArray>this.form.controls['note_edit_favorite'];
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i);
      }
      for (let i = control2.length - 1; i >= 0; i--) {
        control2.removeAt(i);
      }
      var formNoteEditFavorite = this.form.controls['note_edit_favorite'] as FormArray;
      var formNoteEdit = this.form.controls['note_edit'] as FormArray;

      res.data.forEach(element => {
        if (element.note_favorite) {
          this.notes_favorite.push({
            note_title: element.note_title,
            note_description: element.note_description,
            note_favorite: element.note_favorite,
            note_position: element.note_position,
            note_id: element.note_id,
            note_file: element.note_file,
            users_id: element.users_id
          });
          formNoteEditFavorite.push(this.createItem(element.note_title, element.note_description, element.note_favorite, element.note_position, element.note_id, element.note_file, element.users_id));
        } else {
          this.notes.push({
            note_title: element.note_title,
            note_description: element.note_description,
            note_favorite: element.note_favorite,
            note_position: element.note_position,
            note_id: element.note_id,
            note_file: element.note_file,
            users_id: element.users_id
          });
          formNoteEdit.push(this.createItem(element.note_title, element.note_description, element.note_favorite, element.note_position, element.note_id, element.note_file, element.users_id));
        }
      });
    }, err => {
      // console.log(err);
    });
  }

  modifyNote(data) {
    this.loadingService.present();
    this.homeService.modifyNote(data.value).subscribe(res => {
      this.loadingService.dismiss();
      this.getNote();
      this.alertController.create({
        header: `OK`,
        message: `<b> ${res.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then((alert) => {
        alert.present().finally(() => {
          // this.router.navigate(['/login']);
        });
      });
    }, err => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
    });
  }

  deleteNote(data) {
    this.loadingService.present();
    this.homeService.deleteNote(data.value).subscribe(res => {
      this.loadingService.dismiss();
      this.getNote();
      this.alertController.create({
        header: `OK`,
        message: `<b> ${res.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then((alert) => {
        alert.present().finally(() => {
          // this.router.navigate(['/login']);
        });
      });
    }, err => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
    });
  }

  createItem(title, description, favorite, position, id, file, user) {
    return this.formBuilder.group({
      note_title: [title, Validators.required],
      note_description: [description, Validators.required],
      note_favorite: [favorite],
      note_position: [position],
      note_id: [id],
      note_file: [file ? this.arrayBufferToString(file.data) : ''],
      users_id: [user]
    });
  }

  applyFilter(value, type: boolean) {
    let filtro = [];
    if (type) {
      let formNoteEditFavorite = this.form.controls['note_edit_favorite'] as FormArray;
      let notas_favorito = this.notes_favorite;
      for (let i = formNoteEditFavorite.length - 1; i >= 0; i--) {
        formNoteEditFavorite.removeAt(i);
      }

      filtro = notas_favorito.filter(filtro => filtro.note_title.toLowerCase().indexOf(value.toLowerCase()) !== -1);

      filtro.forEach(element => {
        formNoteEditFavorite.push(this.createItem(element.note_title, element.note_description, element.note_favorite, element.note_position, element.note_id, element.note_file, element.users_id));
      });
    } else {
      let formNoteEdit = this.form.controls['note_edit'] as FormArray;
      let notas = this.notes;

      for (let i = formNoteEdit.length - 1; i >= 0; i--) {
        formNoteEdit.removeAt(i);
      }

      filtro = notas.filter(filtro => filtro.note_title.toLowerCase().indexOf(value.toLowerCase()) !== -1);

      filtro.forEach(element => {
        formNoteEdit.push(this.createItem(element.note_title, element.note_description, element.note_favorite, element.note_position, element.note_id, element.note_file, element.users_id));
      });

    }

  }
  drop(event: CdkDragDrop<string[]>) {
    let formNoteEdit = this.form.controls['note_edit'] as FormArray;
    this.moveItemInFormArray(formNoteEdit, event.previousIndex, event.currentIndex);
  }

  dropFavorite(event: CdkDragDrop<string[]>) {
    let formNoteEditFavorite = this.form.controls['note_edit_favorite'] as FormArray;
    this.moveItemInFormArray(formNoteEditFavorite, event.previousIndex, event.currentIndex);
  }
  arrayBufferToString(buffer) {
    var bufView = new Uint16Array(buffer);
    var length = bufView.length;
    var result = '';
    var addition = Math.pow(2, 16) - 1;
    for (var i = 0; i < length; i += addition) {
      if (i + addition > length) {
        addition = length - i;
      }
      result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
    }
    return result;

  }

  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number) {
    const dir = toIndex > fromIndex ? 1 : -1;

    const from = fromIndex;
    const to = toIndex;
    const temp = formArray.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = formArray.at(i + dir);
      formArray.setControl(i, current);
    }
    formArray.setControl(to, temp);

    formArray.getRawValue().forEach((element, index) => {
      formArray.controls[index].get('note_position').setValue(index);
    })

    let arreglo = [];
    formArray.getRawValue().forEach(element => {
      arreglo.push({
        note_id: element.note_id,
        users_id: element.users_id,
        note_position: element.note_position
      })
    })

    this.updatePosition({
      arr: arreglo
    });
  }

  updatePosition(data) {
    this.homeService.updatePosition(data).subscribe(res => {
      // console.log(res);
    }, err => {
      // console.log(err);
    })
  }
}
