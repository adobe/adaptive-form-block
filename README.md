# Adpative Form Block
Adaptive Form Block for Franklin

AEM Form, Headless Adaptive Forms (HAF) specifies a mechanism to create a Form or Data Capture Experience using a JSON representation, which allows rendering that experience across multiple channels.

Adaptive Form Block is Form rendition block which renders the form based on Adaptive Forms Specification (JSON) for Franklin.

## Playground

[Live Playground](https://git.corp.adobe.com/pages/jalagari/adpative-form-block/index.html)

### Local Playground

* Open the project in VSC 
* Open docs/index.html with Live Server ( Live Server is VSC extension)
* On selecting template
  * Left side view will open the JSON View and
  * On Right side form will be rendered using Adaptive Form Block

## Getting Started -- Franklin

> Adaptive Form authoring is similar to Franklin Form authoring but it expected Excel headers according to Adaptive Form Specification

### Authoring

* Project Creation -- Follow the [Getting started with Franklin - Developer Tutorial](https://www.hlx.live/developer/tutorial)
* Create an Excel workbook or Google sheet anywhere under your Franklin project directory. 
* For this tutorial we will create a sheet in the root of our Franklin project in OneDrive called registration.
* Share the sheet or a parent directory containing the sheet with helixfrm@adobe.com for OneDrive or helix@adobe.com for GDrive.
* Open the workbook and create sheet with name helix-default
* Created header using Adaptive Form specification terminology. 
* You can copy past the table data from [registration template](https://docs.google.com/spreadsheets/d/1_1j-4rZmGFxTmHue15_KnhuskzK_oBhYjR5cskf5Ruc/edit?usp=sharing).

See below an example of what the spreadsheet for the form definition could look like.

![Registration Template](images/example.png)

### Form Reference

Usually, there is a Adaptive Form block that takes a reference to the spreadsheet and renders the form and handles the user flow through submission.

![Form Reference](images/reference.png)

More details in [Adaptive Form Block documentation](https://main--crispr--jalagari.hlx.page/).


## Developer Mode 

### `npm i --force`

Install all the depedency packages.

### `npm run dev`

Any changes made in code, style is auto reload.


## Prod Build

For build Adaptive Form Block for Frankling run following command

### `npm run build`

It generate ESM module in production mode and optimizes the build for the best performance. It will generate 2 fields in [dist](dist)

* adaptiveform.js -- Java Script file which provide export decorator for Franklin.
* adaptiveform.css -- Form default styling file.


# Links 

* [Adaptive Form Block Documentation](https://main--crispr--jalagari.hlx.page/).
* [Supported Features](https://main--crispr--jalagari.hlx.page/features)

## Templates

* [Registration Template](https://main--crispr--jalagari.hlx.page/templates/registration/)
* [Personal Loan Calculator](https://main--crispr--jalagari.hlx.page/templates/calculator/)
