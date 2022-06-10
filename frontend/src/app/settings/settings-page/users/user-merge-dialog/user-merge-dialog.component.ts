import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {CommunicationService, UserRole} from '@shared/communication.service';
import {User} from '@models/user';
import {Observable} from 'rxjs';
import {Branch} from '@models/branch';
import {BranchService} from '../../branch.service';


@Component({
  selector: 'user-merge-dialog',
  templateUrl: './user-merge-dialog.component.html',
  styleUrls: ['./user-merge-dialog.component.scss']
})
export class UserMergeDialogComponent implements OnInit {
  title = 'Registering new user';
  userForm: FormGroup;
  doBorderHighlight: boolean;
  @ViewChild('avatarFileChoose')
  avatarFileChoose: ElementRef;
  @ViewChild('userAvatarPreview')
  avatarElRef: ElementRef;
  avatarDisplay: string = 'none';
  avatarSrc: string = '';
  roles: Map<number, UserRole>;
  branches$:Observable<Branch[]>;
  constructor(@Inject(MAT_DIALOG_DATA) public data: User,
              private fb: FormBuilder,
              private domSanitizer: DomSanitizer,
              public communicationService: CommunicationService,
              private branchService: BranchService) {
  }

  ngOnInit(): void {
    this.branches$ = this.branchService.branchesSubj.asObservable();
    this.roles = this.communicationService.getUserRoles();
    this.userForm = this.fb.group({
        id: [0],
        firstName: [this.data.firstName, [Validators.required]],
        lastName: [this.data.lastName, [Validators.required]],
        username: [this.data.username, [Validators.required]],
        password: [this.data.password, [Validators.required]],
        image: ['', [Validators.required]],
        email: [this.data.lastName, [Validators.email]],
        role: [this.data.role, [Validators.required]],
        phoneNumber: [this.data.phoneNumber, null],
        branches: [this.data.branches, [Validators.required]]
      }
    );
  }

  handleAvatar(e: Event) {
    const imgs = (<any> e.target).files;
    this.handleAvatarChange(imgs);
  }

  handleAvatarChange(imgs) {
    if (imgs) {
      const [img] = imgs;
      this.userForm.patchValue({image: img});
      this.avatarSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(img)) as string;
      this.avatarDisplay = 'block';
    } else {
      this.avatarSrc = '';
      this.avatarDisplay = 'none';
    }
  }

  handleAvatarDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.files) {
      this.handleAvatarChange(e.dataTransfer.files);
    }
  }

  highlightBorder(e: DragEvent, doHighlight: boolean) {
    e.preventDefault();
    e.stopPropagation();
    this.doBorderHighlight = doHighlight;
  }

  openAvatarFileChoose() {
    this.avatarFileChoose.nativeElement.click();
  }
}
