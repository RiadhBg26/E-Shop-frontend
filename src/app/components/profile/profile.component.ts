import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { UserService, ResponseModel } from '../../services/user.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myUser: any;

  constructor(private authService: SocialAuthService ,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.userService.userData$
      .pipe(
        map((user: SocialUser | ResponseModel) => {
          if (user instanceof SocialUser || user.type === 'social') {
            return {
              ...user,
              email: 'test@test.com',
            };
          } else {
            return user
          }
        })
      )
      .subscribe((data: ResponseModel | SocialUser) => {
        this.myUser = data
        console.log("this is my user :: ", this.myUser.userId);
        
      });


      // this.authService.authState
      // .pipe(
      //   map((user: SocialUser | ResponseModel) => {
      //     if (user instanceof SocialUser || user.type === 'social') {
      //       return {
      //         ...user,
      //         email: 'test@test.com',
      //       };
      //     } else {
      //       return [user, console.log(user.userId)
      //       ]
      //     }
      //   })
      // )
      // .subscribe((user : SocialUser) => {
      //   if (user !== null) {
      //     this.myUser = user;
      //   }else{
      //     return
      //   }        
      // });
  };

  logout() {
    this.userService.logout();
  };

  


}
