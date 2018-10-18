This solution is part of a demo solution to show how Ballard Chalmers have implemented a fully serverless solution in Azure. It is based on a real customer solution which has been updated to allow us to open source the code.

This solution shows the web client implemented in Angular to connect to the Azure Functions set up. For more information, please view the Ballard Chalmers blog at https://ballardchalmers.com/2018/08/08/modern-serverless-development-part-1-an-application-journey-series/.

# BCServerlessDemo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Firstly you will need to run the Cosmos Emulator from powershell:
docker run -v $env:LOCALAPPDATA\CosmosDBEmulatorCert:C:\CosmosDB.Emulator\CosmosDBEmulatorCert -p 8081:8081 -P -t -i -m 2GB microsoft/azure-cosmosdb-emulator

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
