import ExcelToFormModel from "../../src/services/ExcelToFormModel";

import registrationFranklinForm from "../../forms/templates/registration_franklin.json";
import registrationTemplate from "../../forms/templates/registration.json";
import personalloanTemplate from "../../forms/templates/loancalculator.json";

import registrationForm from "../../forms/crispr/registration.json";
import personalloan from "../../forms/crispr/loancalculator.json";

let transform: ExcelToFormModel = new ExcelToFormModel();

test('Franklin Form to Crispr Form', () => {
  let response = transform.transform(registrationFranklinForm, "/registration.json")
   verify(response, registrationFranklinForm, registrationForm);
});

test('Registration Template to Crispr Form', () => {
  let response = transform.transform(registrationTemplate, "/registration.json")
  verify(response, registrationTemplate, registrationForm);
})

test('Calculator Template to Crispr Form', () => {
  let response = transform.transform(personalloanTemplate, "/personalloan.json")
  verify(response, personalloanTemplate, personalloan);
})

let verify = (response: any, expectedExcelData: any, expectedFormDef: any) => {
  expect(response).not.toBeNull()
  let {formDef, excelData} = response;
  expect(excelData).not.toBeNull()
  expect(excelData).toEqual(expectedExcelData)
  expect(formDef).not.toBeNull();
  expect(formDef).toEqual(expectedFormDef)

}