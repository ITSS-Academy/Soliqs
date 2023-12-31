import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Subscription, combineLatest } from 'rxjs';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthState } from 'src/app/ngrx/states/auth.state';
import { UserState } from 'src/app/ngrx/states/user.state';

import * as UserActions from '../../ngrx/actions/user.actions';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 200;

  idToken: string = '';
  uid: string = '';
  subscriptions: Subscription[] = [];

  idToken$ = this.store.select('auth', 'idToken');
  user$ = this.store.select('user', 'user');
  firebaseUser$ = this.store.select('auth', 'firebaseUser');
  isSuccess$ = this.store.select('user', 'isSuccess');
  isGetSuccess$ = this.store.select('user', 'isGetSuccess');
  isGetFailure$ = this.store.select('user', 'isGetFailure');

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private store: Store<{ auth: AuthState; user: UserState }>
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('user', 'isLoading').subscribe((res) => {
        if (res) {
          this.openSnackBar('Creating user...');
        }
      }),
      this.store.select('user', 'isSuccess').subscribe((res) => {
        if (res) {
          this.openSnackBar('Create user successfully!');
        }
      }),
      this.store.select('user', 'errorMessage').subscribe((res) => {
        if (res) {
          this.openSnackBar(`Error: ${res.error.message}`);
        }
      })
    );
    setTimeout(() => {
      this.subscriptions.push(
        combineLatest([
          this.idToken$,
          this.user$,
          this.firebaseUser$,
          this.isSuccess$,
          this.isGetSuccess$,
          this.isGetFailure$,
        ]).subscribe(
          ([
            idToken,
            user,
            firebaseUser,
            isSuccess,
            isGetSuccess,
            isGetFailure,
          ]) => {
            if (firebaseUser.uid && idToken && isSuccess) {
              if (
                firebaseUser.uid !== this.uid ||
                idToken !== this.idToken ||
                !this.uid ||
                !this.idToken
              ) {
                this.uid = firebaseUser.uid;
                this.idToken = idToken;
                this.store.dispatch(
                  UserActions.get({ uid: firebaseUser.uid, idToken })
                );
              }
            }
            if (isGetFailure && !isSuccess) {
              this.store.dispatch(UserActions.create({ idToken }));
            }
            if (isGetSuccess && user.email) {
              if (user.profile != null) {
                this.router.navigate(['/home']);
              } else if (user.profile === null) {
                this.router.navigate(['/register']);
              }
            }
          }
        )
      );
    }, 3000);
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 2000,
      panelClass: ['snackbar'],
    });
  }
}
