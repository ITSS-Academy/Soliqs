import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import { GroupService } from "src/app/services/group/group.service";
import * as GroupActions from "../actions/group.actions";
import { group } from "@angular/animations";

@Injectable()
export class GroupEffects {
    constructor(private actions$: Actions, private groupService: GroupService) {}

    getGroups$ = createEffect(() => this.actions$.pipe(
        ofType(GroupActions.get),
        exhaustMap(() =>
            this.groupService.getGroups().pipe(
                map((grouplist) => {
                    return GroupActions.getSuccess({groupList: grouplist})
                }),
                catchError((error) => of(GroupActions.getFailure({errorMessage: error})))
            )
        )
    )
    );

    createGroup$ = createEffect(() => this.actions$.pipe(
        ofType(GroupActions.create),
        exhaustMap((action) =>
            this.groupService.createGroup(action.group).pipe(
                map(() => {
                    return GroupActions.createSuccess()
                }),
                catchError((error) => of(GroupActions.createFailure({errorMessage: error})))
            )
        )
    )
    );

    updateGroup$ = createEffect(() => this.actions$.pipe(
        ofType(GroupActions.update),
        exhaustMap((action) =>
            this.groupService.updateGroup(action.id , action.group).pipe(
                map(() => {
                    return GroupActions.updateSuccess()
                }),
                catchError((error) => of(GroupActions.updateFailure({errorMessage: error})))
            )
        )
    )
    );

}