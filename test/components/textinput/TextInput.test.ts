
import { FieldJson, FieldModel, FormModel, State } from "@aemforms/af-core";
import TextInput from "../../../src/components/textinput/TextInput";
import FormFieldBase from "../../../src/models/FormFieldBase";
import ComponentValidator from "../../util/ComponentValidator";

import { FormsEnvironment } from "../../util/FormsEnvironment";

let model:FieldModel, fieldView: FormFieldBase;
let componentValidator: ComponentValidator = new ComponentValidator();
let formEnv: FormsEnvironment = new FormsEnvironment();
let {formInstance, firstNameId, emailFieldId} =  formEnv.registrationForm();

beforeEach(() => {
    [model, fieldView] = formEnv.getFieldView(formInstance, firstNameId);
});

test('Validate Text Input Markup', () => {
    componentValidator.validateWidget(fieldView, model);
    componentValidator.validateLabel(fieldView, model);
    componentValidator.validateInput(fieldView, model, "text");
});

test("Model update verification", () => {
    model.value = "VJ";
    componentValidator.validateInputValue(fieldView, model, "VJ");
})

test("UI Update verification", () => {
    let value = "Test";
    componentValidator.triggerValueChange(fieldView, model, value);
    componentValidator.validateInputValue(fieldView, model, value)
})

test("Validate Required Constraint", () => {
    componentValidator.validateConstraint(fieldView, model, "", model?.getState()?.constraintMessages?.required);
})

test("Validate Length Constraint", () => {
    componentValidator.validateConstraint(fieldView, model, "a", model?.getState()?.constraintMessages?.minLength);
    componentValidator.validateConstraint(fieldView, model, "abcsss", model?.getState()?.constraintMessages?.maxLength);
})

test("Validate Dynamic Hide/show", async() => {
    model.visible = false;
    componentValidator.validateWidget(fieldView, model, false);
    model.visible = true;
})

test("Validate Dynamic Enabled/Disabled", async() => {
    model.enabled = false;
    componentValidator.validateWidget(fieldView, model, true, false);
    model.enabled = true;
})
