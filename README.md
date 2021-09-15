# Create Nativescript Project 
```
$ ng new [project name] --collection=@nativescript/schematics --shared --style=scss
```

# Basic Setting

## node version
> v12 +
## Merge to NS8
  - if @nativescript/core version in package.json is lower than 8
```
$ ns migrate
```

  - if there is no webpack.config.js on root directory,
  copy and paste the file from .migration_backup folder

  - change @nativescript/webpack version to ~4.1
```
$ npm i --only=dev @nativescript/webpack@~4.1
```

  - install @ngtools/webpack@~11.2
```
$ npm i --only=dev @ngtools/webpack@~11.2
```

  - modify "main" value in package.json
```
./src/main.tns.ts => main.tns.ts
```

  - modify script in webpack.config.js
```
new CopyWebpackPlugin({
          patterns: copyTargets,
      })
==> 
new CopyWebpackPlugin(copyTargets)
```

  - create tsconfig.tns.json on root directory

  - modify src/polyfills.ts file 
> import 'core-js/es7/reflect' => 'core-js/es/reflect'

  - upgrade typescript version to 4.1.0
```
$ npm i --only=dev typescript@~4.1.0
```

## Universal
  - 플러그인 추가를 위한 우선작업
> @src/main.ts 파일 수정
>> import { AppModule } from '@src/app/app.module'; ===> import { AppModule } from './app/app.module';   

  - Universal Engin 플러그인 추가
```
ng add @nguniversal/express-engine   
npm i @angular/platform-server   
npm i --only=dev @angular-devkit/build-angular@~0.1100
```


## Error Handle
  - cannot find module 'tslint'
```
$ npm i -D @nativescript/schematics @angular/cli
```
  - webpack-cli unknown argument --env...
  -> downgrade webpack-cli to ~v3.3
```
$ npm i webpack-cli@~3
```
  - Error: The Angular Compiler requires TypeScript >=4.0.0 and <4.2.0 but 4.4.3 was found instead.
```
$ npm i typescript@4.1.6 --save-dev
```