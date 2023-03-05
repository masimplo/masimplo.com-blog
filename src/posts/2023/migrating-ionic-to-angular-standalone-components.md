---
layout: post
title: Migrating Ionic App to use Angular standalone components
author: [masimplo]
tags: [Code,Ionic]
image: ../../images/headers/bernd-dittrich-pivF3guSUgI-unsplash.jpg
date: 2023-03-05
draft: false
---


After upgrading some of our projects to Angular 15 and making sure everything works as expected, I decided it was time to delve into standalone components. I always viewed Angular modules as a necessary evil. I understood why they were needed, however always wished there was a better way to achieve similar results without them.

There have been countless times that it was hard to decide in which module a new component should belong to. What about a page, should it belong to an existing one, or define its own? Earlier than that we even had to deal with EntryComponents (noone misses them, I believe). Many times in the past I had to break up modules to smaller ones to avoid circular dependencies, move components to different modules, switch between eager and lazy load and sometimes I had to wonder if what I had arrived to, was something that was both best practices and something that everyone in the future would agree was the best approach.

I couldn't wait to move forward to a codebase that would not put such burden to me or anyone else in the future.

Converting existing components to standalone was made pretty easy by the Angular team.

>From the docs: As of version 15.2.0, Angular offers a schematic to help project authors convert existing projects to the new standalone APIs. The schematic aims to transform as much code as possible automatically, but it may require some manual fixes by the project author.

Just run:
```bash
ng generate @angular/core:standalone
```
And select `Convert all components, directives and pipes to standalone`

This will convert all components in a project to standalone automatically, by compiling the html templates to check what dependencies to other components are needed. It doesn't get easier than that. For me, it converted over 500 components with maybe one or two manual fixes needed afterwards.

>Pro Tip: If you do not want to convert all components to standalone at once, you can either specify a path when running the schematic or use your source control to check in what you want each time.

After all components have been converted, you will find that many modules are not used anymore. You can run the schematics again, selecting `Remove unnecessary NgModule classes` this time to remove them, or you can remove them manually - which I enjoyed doing.

Some extra care should be given to modules that contain providers as they need to be loaded somewhere. In my case I had no modules that had both components and providers so I included everything in main.ts - more on that later.

Modules that contain route definitions need some special handling also. If you are declaring the routes inline in the module, you should extract the route definitions to a separate file exporting a Routes variable. If you are using routing modules, you can get rid of the module definition and just export the Routes variable again.

Here is an example:
```typescript
const routes: Routes = [
    {
      path: SETTINGS_ROUTES_NAMES.Messages,
      loadChildren: () => import('../messages/messages.module').then(m => m.MessagesModule)
    },
    {
      path: SETTINGS_ROUTES_NAMES.Units,
      component: UnitsPageComponent
    },
]

 @NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
 })
 export class SettingsRoutingModule {}
```

becomes:
```typescript
export const routes: Routes = [
    {
      path: SETTINGS_ROUTES_NAMES.Messages,
      loadChildren: () => import('../messages/messages.routes').then(m => m.routes)
    },
    {
      path: SETTINGS_ROUTES_NAMES.Units,
      component: UnitsPageComponent
      // could also convert to lazy loading if we want here, using:
      // loadComponent: () =>import('./units.page').then(m=>m.UnitsPageComponent)
    },
]
```

Let's jump to main.ts to bootstrap everything now that we have no modules left.

Right now you should have something like this:
```typescript
platformBrowserDynamic()
   .bootstrapModule(AppModule)
   .catch(err => console.log(err));
```
Here we need to use the bootstrap API and also load everything that we were loading in app.module.ts before.

In my case it was something like this:
```typescript
bootstrapApplication(MainAppComponent, {
   providers: [
     provideRouter(routes), // routes is the exported variable from a file declaring the first level of routing
     importProvidersFrom(
       CommonModule,
       HttpClientModule,
       BrowserModule,
       BrowserAnimationsModule,
       FormsModule,
       ReactiveFormsModule,
       IonicModule.forRoot(ionicConfig),
       IonicStorageModule.forRoot({
         driverOrder: ['indexeddb', 'sqlite', 'websql']
       }),
       // this is a module where we declare all special providers needed by our app, this can include
       // error handlers, httpInterceptors, decorators, pipes as services, etc.
       CoreModule
     )
   ]
 }).catch(err => console.log(err));
```

Finally we need to add an attribute to our app component so that Ionic works as expected.
```typescript
// if you are using tabs:
<ion-tabs [environmentInjector]="environmentInjector">
// if you are not using tabs
<ion-router-outlet [environmentInjector]="environmentInjector"></ion-router-outlet>
```
and in the component code we need to inject the environmentInjector service
```typescript
constructor(
    **public readonly environmentInjector: EnvironmentInjector**,
    private readonly _platform: Platform,
    loggerFactory: LoggerFactory
  ) {
    ...
  }
```

That's it. If everything went as planned, you should have gotten rid of quite few lines of code - and mental overhead - and have a nice fresh, up to date project, to keep building amazing stuff on.

*You can read more about standalone components [in the Angular documentation](https://angular.io/guide/standalone-components)*.
*You can also find a nice overview of the steps needed for an Ionic project in [this article](https://ionic.zendesk.com/hc/en-us/articles/10386373742231-Angular-Standalone-Components-with-Ionic)*.
