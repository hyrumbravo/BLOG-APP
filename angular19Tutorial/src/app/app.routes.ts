import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TemplateFormComponent } from './components/Forms/template-form/template-form.component';
import { ReactiveFormComponent } from './components/Forms/reactive-form/reactive-form.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './components/guard/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { ViewAllPostComponent } from './components/view-all-post/view-all-post.component';
import { PublicPostsComponent } from './components/public-posts/public-posts.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'

    },
    {
        path:'login',
        component:LoginComponent    
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'',
        component:LayoutComponent,
        canActivate:[authGuard],
        children:[
            {
                path:'blog-post',
                component:BlogPostComponent
            },
            {
                path:'public-posts',
                component:PublicPostsComponent
            },
            {
                path:'view-all-post',
                component:ViewAllPostComponent
            },
            {
                path:'template-form',
                component:TemplateFormComponent
            },
            {
                path:'reactive-form',
                component:ReactiveFormComponent
            },

        ]
    }
];
