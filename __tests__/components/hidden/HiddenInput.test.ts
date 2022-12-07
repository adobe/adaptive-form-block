
import { FieldJson, FieldModel, FormModel, State } from "@aemforms/af-core";
import FormFieldBase from "../../../src/models/FormFieldBase";
import ComponentValidator from "../../util/ComponentValidator";

import { FormsEnvironment } from "../../util/FormsEnvironment";

let model:FieldModel, fieldView: FormFieldBase;
let componentValidator: ComponentValidator = new ComponentValidator();
let formEnv: FormsEnvironment = new FormsEnvironment();
let {formInstance, hiddenFieldId} =  formEnv.registrationForm();

beforeEach(() => {
    [model, fieldView] = formEnv.getFieldView(formInstance, hiddenFieldId);
});

test('Validate Text Input Markup', () => {
    componentValidator.validateWidget(fieldView, model);
    //componentValidator.validateLabel(fieldView, model);
    componentValidator.validateInput(fieldView, model, "text");
});

test("Model update verification", () => {
    let value = 60;
    model.value = value;
    componentValidator.validateInputValue(fieldView, model, value+"");
})

test("UI Update verification", () => {
    let value = 60;
    componentValidator.triggerValueChange(fieldView, model, value+"");
    componentValidator.validateInputValue(fieldView, model, value+"")
})
