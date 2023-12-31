import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SharedModule } from 'src/shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/profile/profile.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    SearchComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    InfiniteScrollModule,
  ],
})
export class MainModule {}
