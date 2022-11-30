import { createFormInstance, FieldModel, FormModel } from "@aemforms/af-core";
import registrationTemplate from "../../forms/crispr/test.json"
import EmailInput from "../../src/components/email/EmailInput";
import TextArea from "../../src/components/textarea/TextArea";
import TextInput from "../../src/components/textinput/TextInput";
import FormFieldBase from "../../src/models/FormFieldBase";

class FormsEnvironment {

    registrationForm(): RegistrationForm {
        let formInstance = createFormInstance(registrationTemplate);
        let state = formInstance.getState();

        expect(state).not.toBeNull();
        expect(state.items).not.toBeNull();
        expect(state.items.length).toEqual(11);
        return {
            formInstance : formInstance,
            firstNameId : formInstance.getState().items[0].id,
            emailFieldId : formInstance.getState().items[3].id,
            messageFieldId : formInstance.getState().items[6].id,
            phoneNoFieldId : formInstance.getState().items[8].id
        }
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

interface RegistrationForm {
    formInstance: FormModel;
    firstNameId: string;
    emailFieldId:string;
    messageFieldId:string;
    phoneNoFieldId:string;
}

export { FormsEnvironment, RegistrationForm }