
import { Constants } from "../../src/constants.js";
import { getWidget } from "../../src/lib-builder.js";
import ComponentValidator from "../util/ComponentValidator.js";

import { FormsEnvironment } from "../util/FormsEnvironment.js";
import suit from "../suite.json"  assert { type: "json" };

let model, block;
let formEnv = new FormsEnvironment();
let {adaptiveForm} =  formEnv.registrationForm();

suit.forEach((testCase) => {
    let blockName = testCase.blockName;
    describe(`${testCase.name}`, () => {

        beforeEach( async() => {
            [model, block] = await formEnv.getFieldView(adaptiveForm, testCase.fieldId);
            return;
        });

        it(`Validate ${testCase.component} Markup`, () => {
            ComponentValidator.validateWidget(model, blockName, block.querySelector("div"));
            ComponentValidator.validateLabel(model, blockName, block.querySelector("label"));
            ComponentValidator.validateInput(model, blockName, getWidget(block));
        });
        
        it("Model update verification", () => {
            model.value = testCase.value.model;
            ComponentValidator.validateInputValue(model, blockName, block, testCase.value.model, testCase.tag);
        })
        
        it("UI Update verification", () => {
            let value = testCase.value.ui;
            ComponentValidator.triggerValueChange(model, blockName, block, value);
            ComponentValidator.validateInputValue(model, blockName, block, value, testCase.tag)
        })
        
        it("Validate Required Constraint", () => {
            ComponentValidator.validateConstraint(model, blockName, block, testCase?.constraint?.required, model?.getState()?.constraintMessages?.required);
        })
        
        it("Validate Constraint", () => {
            let state = model?.getState();
            for(let key in testCase?.constraint) {
                if(key != "required")
                    ComponentValidator.validateConstraint(model, blockName, block, testCase?.constraint?.[key], state?.constraintMessages?.[key]);
            }
        })
        
        it("Validate Dynamic Hide/show", async() => {
            model.visible = false;
            ComponentValidator.validateWidget(model, blockName, block.querySelector("div"), false);
            model.visible = true;
        })
        
        it("Validate Dynamic Enabled/Disabled", async() => {
            model.enabled = false;
            ComponentValidator.validateWidget(model, blockName, block.querySelector("div"), true, false);
            model.enabled = true;
        })
    });
})
