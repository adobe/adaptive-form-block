
import Constants from "../../src/libs/constants.js";
import decorate from "../../src/adaptiveform.js"
import { expect } from '@esm-bundle/chai';
import ComponentValidator from "../util/ComponentValidator.js";

import { FormsEnvironment, RegistrationForm } from "../util/FormsEnvironment.js";

let block, adaptiveForm;
let form, formEnv = new FormsEnvironment();
let expectedData = {
    "firstName": "Vijay",
    "lastName": "Kumar",
    "fullName": "Vijay Kumar",
    "education": "PG",
    "email": "vj@abc.com", 
    "gender": "M", 
    "company": "Abc", 
    "message": "Testing", 
    "companySize": "11-50", 
    "companySizeMultiple": ["201-500"], 
    "doboptions": [1], "dob": "2022-12-03", "testNo": 80, "phone": 9876543210, "radioOn": "on", "radioOnOff": "on", "submit": undefined, "hid": 20, "subscribe": true, "switchOn": "on", "switchOnOff": "on", "switchTrueFalse": "true"
};

describe("Adaptive Form test suit", () => {

    before("Setup", async () => {
        block = document.createElement("div");
        let a = document.createElement("a");
        a.href = "../../forms/crispr/test.json"
        block.appendChild(a);
        adaptiveForm = await decorate(block)

        expect(adaptiveForm).not.to.null;
        expect(block).not.to.null;

        form = block.querySelector("form");
        expect(form).not.to.null;
        expect(form instanceof HTMLFormElement).to.be.true;
    })

    it("Fill Form", async () => {
        ComponentValidator.setValue(adaptiveForm, form, RegistrationForm.firstNameId, Constants.TEXT_INPUT, "Vijay");
        ComponentValidator.setValue(adaptiveForm, form, "lastName", Constants.TEXT_INPUT, "Kumar");
        ComponentValidator.setValue(adaptiveForm, form, "email", Constants.TEXT_INPUT, "vj@abc.com");
        ComponentValidator.setValue(adaptiveForm, form, "gender", Constants.RADIO, "M");
        ComponentValidator.setValue(adaptiveForm, form, "company", Constants.TEXT_INPUT, "Abc");
        ComponentValidator.setValue(adaptiveForm, form, "message", Constants.TEXT_INPUT, "Testing");
        ComponentValidator.setValue(adaptiveForm, form, "companySize", Constants.SELECT, 2);
        ComponentValidator.setValue(adaptiveForm, form, "companySizeMultiple", Constants.SELECT, 4);
        ComponentValidator.setValue(adaptiveForm, form, "testNo", Constants.NUMBER, "80");
        ComponentValidator.setValue(adaptiveForm, form, "phone", Constants.TEXT_INPUT, "9876543210");
        ComponentValidator.setValue(adaptiveForm, form, "subscribe", Constants.CHECKBOX, true);
        ComponentValidator.setValue(adaptiveForm, form, "switchOn", Constants.CHECKBOX, true);
        ComponentValidator.setValue(adaptiveForm, form, "switchOnOff", Constants.CHECKBOX, true);
        ComponentValidator.setValue(adaptiveForm, form, "switchTrueFalse", Constants.CHECKBOX, true);
        ComponentValidator.setValue(adaptiveForm, form, "educationG", Constants.RADIO, true);
        ComponentValidator.setValue(adaptiveForm, form, "educationPG", Constants.RADIO, true);
        ComponentValidator.setValue(adaptiveForm, form, "radioOn", Constants.RADIO, true);
        ComponentValidator.setValue(adaptiveForm, form, "radioOnOff", Constants.RADIO, true);
    });

    it("Export Data", async () => {
        let data = adaptiveForm?.model?.exportData();
        console.log(data);
        expect(data).to.deep.equal(expectedData)
    })
});