
import { Constants } from "../../src/constants.js";
import { expect } from '@esm-bundle/chai';
import { getWidget } from "../../src/lib-builder.js";
import ComponentValidator from "../util/ComponentValidator.js";

import { FormsEnvironment } from "../util/FormsEnvironment.js";
import suit from "../checkbox_suite.json"  assert { type: "json" };

let model, block;
let formEnv = new FormsEnvironment();
let {adaptiveForm} =  formEnv.registrationForm();
let blockName = Constants.CHECKBOX;


suit.forEach((testCase) => {
    describe(`${testCase.name} `, () => {

        beforeEach( async() => {
            [model, block] = await formEnv.getFieldView(adaptiveForm, testCase.fieldId);
            return;
        });
        
        it(`Model update verification -- ${testCase.name}`, () => {
            
            testCase?.model?.forEach((testSet) => {
                model.value = testSet.set;
                ComponentValidator.validateInputValue(model, blockName, block, testSet.expected);
            });
        })
        
        it(`UI Update verification -- ${testCase.name}`, () => {
            testCase?.ui?.forEach((testSet) => {

                ComponentValidator.triggerValueChange(model, blockName, block, testSet.set);
                ComponentValidator.validateInputValue(model, blockName, block, testSet.expected);
                expect(model?.value).to.equal(testSet.value);
            });
        })
    });
});