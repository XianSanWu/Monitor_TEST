import { Routes } from '@angular/router';
import { LoginComponent } from './page/login-manage/login/login.component';
import { AuthGuard } from './common/guard/auth.guard';
import { Test1Component } from './page/test-manage/test1/test1.component';
import { Test2Component } from './page/test-manage/test2/test2.component';
import { LayoutComponent } from './theme/layout/layout.component';
import { HomeComponent } from './page/home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,  // 登入頁面
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',  // 默認重定向至 /test
  },
  {
    path: '',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],  // 使用 AuthGuard 進行授權檢查
    children: [
      {
        path: 'test',
        data: { title: 'Test', icon: 'house-door' },  // 設定對應資料
        children: [
          {
            path: 'test1',
            component: Test1Component,  // /test/test1
            data: { title: 'Test 1', fullPath: '/test/test1', icon: 'file-earmark' },
          },
          {
            path: 'test2',
            component: Test2Component,  // /test/test2
            data: { title: 'Test 2', fullPath: '/test/test2', icon: 'file-earmark' },
          },
        ],
      },
      {
        path: 'home',
        component: HomeComponent,  // /home 的根頁面
        data: { title: 'Home', icon: 'gear' },
        children: [
          {
            path: 'home',
            component: HomeComponent,  // /home/home
            data: { title: 'Home 1', fullPath: '/home/home', icon: 'file-earmark' },
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',  // 未定義的路由並重定向
  },
];


