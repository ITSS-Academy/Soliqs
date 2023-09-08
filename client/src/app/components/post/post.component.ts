import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import { Router } from '@angular/router';
import { Comment } from 'src/app/models/comment.model';
import { Store } from '@ngrx/store';
import { CommentState } from 'src/app/ngrx/states/comment.state';
import * as CommentActions from '../../ngrx/actions//comment.actions';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { PostState } from 'src/app/ngrx/states/post.state';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Profile } from 'src/app/models/profile.model';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import * as ProfileActions from '../../ngrx/actions/profile.actions';
import { Subscription, combineLatest, mergeMap } from 'rxjs';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  idToken$ = this.store.select('auth', 'idToken');
  profile$ = this.store.select('profile', 'profile');
  profile: Profile = <Profile>{};
  idToken = '';
  post$ = this.store.select('post', 'posts');
  idpost: string = '';
  selectedPost: any;
  authorId: string = '';

  isCommentSuccess$ = this.store.select('comment', 'isCreateSuccess');
  // commentsPost: Array<Comment> = [];
  comments$ = this.store.select('comment', 'comments');

  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private store: Store<{
      comment: CommentState;
      auth: AuthState;
      post: PostState;
      profile: ProfileState;
    }>
  ) {
    this.subscriptions.push(
      combineLatest([this.idToken$, this.profile$]).subscribe(
        ([idToken, profile]) => {
          this.idToken = idToken;
          this.profile = profile;
        }
      ),
      this.isCommentSuccess$.subscribe((isCommentSuccess) => {
        if (isCommentSuccess) {
          this.closeCommentDialog();
          this.commentForm.reset();
          this.commentData = {
            authorId: '',
            content: this.commentForm.value.content || '',
            postId: '',
          };
        }
      })
      // this.comments$.subscribe((comments) => {
      //   //console.log('comments', comments);
      //   if (comments.length) {
      //     this.commentsPost = comments;
      //   }
      // });
    );
  }
  commentForm = new FormGroup({
    content: new FormControl('', Validators.required),
    authorId: new FormControl(''),
    postId: new FormControl(''),
  });

  commentData = {
    authorId: '',
    content: this.commentForm.value.content || '',
    postId: '',
  };

  @Input() post!: [] | any;
  postCommented: any;
  itemSelected: any;
  Selectitem(item: any) {
    this.itemSelected = item;
    // //console.log(this.itemSelected);
    this.router.navigate(['/photo'], {
      queryParams: {
        id: item._id,
      },
      queryParamsHandling: 'merge',
    });
  }

  item1 = {
    sync: false,
    favorite: false,
    monitoring: false,
  };

  showImageInput = false;
  @ViewChild('appDialog2', { static: true })
  dialog2!: ElementRef<HTMLDialogElement>;
  cdr2 = inject(ChangeDetectorRef);

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    this.showImageInput = false;
  }
  postComment() {
    this.commentData = {
      authorId: this.profile._id,
      content: this.commentForm.value.content || '',
      postId: this.postCommented._id,
    };
    this.store.dispatch(
      CommentActions.create({
        idToken: this.idToken,
        postId: this.selectedPost._id,
        comment: this.commentData,
      })
    );
  }

  repost1() {
    if (!this.item1.sync) {
      this.item1.sync = true;
    } else {
      this.item1.sync = false;
    }
  }
  like1() {
    if (!this.item1.favorite) {
      this.item1.favorite = true;
    } else {
      this.item1.favorite = false;
    }
  }

  monitoring1() {
    if (!this.item1.monitoring) {
      this.item1.monitoring = true;
    } else {
      this.item1.monitoring = false;
    }
  }

  openCommentDialog(item: any) {
    this.selectedPost = item;
    this.authorId = item.authorId._id;
    this.postCommented = item;

    this.dialog2.nativeElement.showModal();
    this.cdr2.detectChanges();
  }
  closeCommentDialog() {
    this.dialog2.nativeElement.close();
    this.cdr2.detectChanges();
  }
}
