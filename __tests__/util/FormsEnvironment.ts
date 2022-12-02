import { createFormInstance, FieldModel, FormModel } from "@aemforms/af-core";
import test from "../../forms/crispr/test.json"
import EmailInput from "../../src/components/email/EmailInput";
import TextArea from "../../src/components/textarea/TextArea";
import TextInput from "../../src/components/textinput/TextInput";
import FormFieldBase from "../../src/models/FormFieldBase";

class FormsEnvironment {

    registrationForm(): RegistrationForm {
        let formInstance = createFormInstance(test);
        let state = formInstance.getState();

        expect(state).not.toBeNull();
        expect(state.items).not.toBeNull();
        return new RegistrationForm(formInstance);
    }

    getFieldView(formInstance: FormModel, id: string, type:string = "text"): [FieldModel, FormFieldBase] {

        let model = (formInstance.getElement(id) as FieldModel);
        let params = {
            element: document.createElement('div'),
            id: id
        }
        let fieldView: FormFieldBase
        switch(type) {
            case "email": 
                fieldView = new EmailInput(params, model);
                break;
            case "text-area": 
                fieldView = new TextArea(params, model);
                break;
            default:
                fieldView = new TextInput(params, model);
        }
        fieldView.render();
        return [model, fieldView];
    }
}

class RegistrationForm {
    formInstance: FormModel;
    firstNameId: string = "firstName";
    emailFieldId:string = "email";
    messageFieldId:string = "message";
    phoneNoFieldId:string = "phone";
    constructor(formInstance: FormModel) {
        this.formInstance = formInstance;
    }
}

export { FormsEnvironment, RegistrationForm }