
import { getWidget } from "../../src/libs/afb-builder.js";
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
            ComponentValidator.validateWidget(model, blockName, block.querySelector(testCase.element));
            if(testCase.element == "div") {
                ComponentValidator.validateLabel(model, blockName, block.querySelector("label"));
                ComponentValidator.validateInput(model, blockName, getWidget(block));
            }
        });
        
        if(testCase.value?.model) {
            it("Model update verification", () => {
                let value = testCase.value.model;
                model.value = value;
                ComponentValidator.validateInputValue(model, blockName, block, value, testCase.widget);
            })
        }
        
        if(testCase.value?.ui) {
            it("UI Update verification", () => {
                let value = testCase.value.ui;
                ComponentValidator.triggerValueChange(model, blockName, block, value);
                ComponentValidator.validateInputValue(model, blockName, block, value, testCase.widget)
            })
        }
        
        it("Validate Required Constraint", () => {
            if(testCase.constraint?.required) 
                ComponentValidator.validateConstraint(model, blockName, block, testCase?.constraint?.required, model?.getState()?.constraintMessages?.required);
        })
        
        for(let key in testCase?.constraint) {
            if(key != "required") {
                it(`Validate ${key} Constraint`, () => {
                    let state = model?.getState();
                    ComponentValidator.validateConstraint(model, blockName, block, testCase?.constraint?.[key], state?.constraintMessages?.[key]);
                })
            }
        }
        
        it("Validate Dynamic Hide/show", async() => {
            model.visible = false;
            ComponentValidator.validateWidget(model, blockName, block.querySelector(testCase.element), false);
            model.visible = true;
        })
        
        it("Validate Dynamic Enabled/Disabled", async() => {
            model.enabled = false;
            ComponentValidator.validateWidget(model, blockName, block.querySelector(testCase.element), true, false);
            model.enabled = true;
        })
    });
})
