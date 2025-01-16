import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from '../home/home.component';
import { BlogDetailsComponent } from '../blog-details/blog-details.component';
import { LoginComponent } from '../login/login.component';
import { ProfileComponent } from '../profile/profile.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SignupComponent } from '../signup/signup.component';

// Guards
import { AuthGuard } from '../auth.guard';
import { CanDeactivateGuard } from '../deactivate.guard';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Home page
  { path: 'login', component: LoginComponent }, // Login page
  { path: 'signup', component: SignupComponent }, // Signup page
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }, // User profile (protected)
  { path: 'blog/:id', component: BlogDetailsComponent, canActivate: [AuthGuard] }, // Blog details (protected)
  
  { 
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protect dashboard
    children: [
      { 
        path: 'create-post', 
        component: CreatePostComponent, 
        canDeactivate: [CanDeactivateGuard], // Warn about unsaved changes
      },
      { 
        path: 'edit-post/:id', 
        component: EditPostComponent, 
        canDeactivate: [CanDeactivateGuard], // Warn about unsaved changes
      },
    ],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }, // Fallback route
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
