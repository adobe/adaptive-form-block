
import { FieldJson, FieldModel, FormModel, State } from "@aemforms/af-core";
import TextInput from "../../../src/components/textinput/TextInput";
import FormFieldBase from "../../../src/models/FormFieldBase";
import ComponentValidator from "../../util/ComponentValidator";

import { FormsEnvironment } from "../../util/FormsEnvironment";

let model:FieldModel, fieldView: FormFieldBase;
let componentValidator: ComponentValidator = new ComponentValidator();
let formEnv: FormsEnvironment = new FormsEnvironment();
let {formInstance, emailFieldId} =  formEnv.registrationForm();

beforeEach(() => {
    [model, fieldView] = formEnv.getFieldView(formInstance, emailFieldId, "email");
});

test('Validate Text Input Markup', () => {
    componentValidator.validateWidget(fieldView, model);
    componentValidator.validateLabel(fieldView, model);
    componentValidator.validateInput(fieldView, model, "email");
});

test("Model update verification", () => {
    let value = "vj@test.com";
    model.value = value;
    componentValidator.validateInputValue(fieldView, model, value);
})

test("UI Update verification", () => {
    let value = "test@vj.com";
    componentValidator.triggerValueChange(fieldView, model, value);
    componentValidator.validateInputValue(fieldView, model, value)
})

test("Validate Required Constraint", () => {
    componentValidator.validateConstraint(fieldView, model, "", model?.getState()?.constraintMessages?.required);
})

test("Validate Pattern Constraint", () => {
    componentValidator.validateConstraint(fieldView, model, "a", model?.getState()?.constraintMessages?.pattern);
})

test("Validate Dynamic Hide/show", async() => {
    model.visible = false;
    componentValidator.validateWidget(fieldView, model, false);
})

test("Validate Dynamic Enabled/Disabled", async() => {
    model.enabled = false;
    componentValidator.validateWidget(fieldView, model, true, false);
})
