import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user.model';

export const login = createAction('[Auth] Login');

export const loginSuccess = createAction('[Auth] Login Success');

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ errorMessage: string }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ errorMessage: string }>()
);

export const storedIdToken = createAction(
  '[Auth] Stored Id Token',
  (idToken: string) => ({ idToken })
);

export const storedFirebaseUser = createAction(
  '[Auth] Stored Firebase User',
  (firebaseUser: User) => ({ firebaseUser })
);
