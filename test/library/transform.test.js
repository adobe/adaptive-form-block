import ExcelToFormModel from "../../src/libs/afb-transform.js";
import { expect } from '@esm-bundle/chai';

import registrationFranklinForm from "../../forms/templates/registration_franklin.json" assert { type: "json" };
import registrationTemplate from "../../forms/templates/registration.json" assert { type: "json" };
import personalloanTemplate from "../../forms/templates/loancalculator.json" assert { type: "json" };

import registrationForm from "../../forms/crispr/registration.json" assert { type: "json" };
import registration_franklin from "../../forms/crispr/registration_franklin.json" assert { type: "json" };
import personalloan from "../../forms/crispr/loancalculator.json" assert { type: "json" };

let transform = new ExcelToFormModel();

describe('Excel to Form Model test suit', () => {
  it('Franklin Form to Crispr Form', () => {
    let response = transform.transform(registrationFranklinForm, "/registration.json")
    //console.log("re", JSON.stringify(response.formDef));
    verify(response, registrationFranklinForm, registration_franklin);
  });

  it('Registration Template to Crispr Form', () => {
    let response = transform.transform(registrationTemplate, "/registration.json")
    //console.log("re", JSON.stringify(response.formDef));
    verify(response, registrationTemplate, registrationForm);
  })

  it('Calculator Template to Crispr Form', () => {
    let response = transform.transform(personalloanTemplate, "/personalloan.json")
    //console.log("re", JSON.stringify(response.formDef));
    verify(response, personalloanTemplate, personalloan);
  })
});


let verify = (response, expectedExcelData, expectedFormDef) => {
  expect(response).not.null
  let {formDef, excelData} = response;
  expect(excelData).not.null
  expect(excelData).to.deep.equal(expectedExcelData)
  expect(formDef).not.null
  console.log("Expected")
  expect(formDef).to.deep.equal(expectedFormDef)

}