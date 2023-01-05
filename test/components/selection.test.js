
import { expect } from '@esm-bundle/chai';
import ComponentValidator from "../util/ComponentValidator.js";

import { FormsEnvironment } from "../util/FormsEnvironment.js";
import checkboxsuit from "../checkbox_suite.json"  assert { type: "json" };
import radiosuit from "../radio_suite.json"  assert { type: "json" };
import chechboxgroupsuit from "../checkbox_group_suite.json"  assert { type: "json" };

let model, block;
let formEnv = new FormsEnvironment();
let {adaptiveForm} =  formEnv.registrationForm();

let executeSuit = (suit) => {
    suit.forEach((testCase) => {
        let blockName = testCase.blockName;
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
                    expect(model?.value).deep.to.equal(testSet.value);
                });
            })
        });
    });
}
executeSuit(checkboxsuit);
executeSuit(chechboxgroupsuit);
executeSuit(radiosuit);

