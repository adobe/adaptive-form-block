
import test from "../../forms/crispr/test.json" assert { type: "json" };
import { expect } from '@esm-bundle/chai';
import { AdaptiveForm } from "../../src/adaptiveform.js";

class FormsEnvironment {

    registrationForm() {

        let adaptiveForm = new AdaptiveForm(document.createElement("form"), test);

        expect(adaptiveForm).not.to.be.null;
        expect(adaptiveForm.model).not.to.be.null;
        return new RegistrationForm(adaptiveForm);
    }

    getFieldView = async (adaptiveForm, id) => {
        let model = adaptiveForm.getModel(id);
        let block = await adaptiveForm.getRender(model);
        return [model, block];
    }
}

class RegistrationForm {
    adaptiveForm;
    firstNameId = "firstName";
    emailFieldId = "email";
    messageFieldId = "message";
    phoneNoFieldId = "phone";
    testNoFieldId = "testNo";
    hiddenFieldId = "hidden";
    constructor(adaptiveForm) {
        this.adaptiveForm = adaptiveForm;
    }
}

export { FormsEnvironment, RegistrationForm }