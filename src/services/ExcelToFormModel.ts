const PANEL_TYPE = "object";
const PANEL_END = "page-break";

const RULE_TYPE = "Rules.";
const EVENTS = "Events.";
const CONSTRAINT_MESSAGE = "ConstraintMessages.";

export default class ExcelToFormModel {
    
    static fieldMapping : Map<string, string> = new Map([
        ["text-input", "text"],
        ["number-input", "number"],
        ["date-input", "datetime-local"],
        ["file-input", "file"],
        ["drop-down", "select"],
        ["radio-group", ""],
        ["checkbox-group", ""],
        ["plain-text", "plain-text"],
        ["checkbox", "checkbox"],
        ["multiline-input", "text-area"],
        ["panel", "panel"],
        ["submit", "button"]
    ]);

    async _getForm(formPath:string) {
        if(!formPath) {
            throw new Error("formPath is required");
        }
        const resp = await fetch(formPath);
        const json = await resp.json();
        return json;
    }

    #getFormDef(formPath:string): any {
        return {
            adaptiveform: "0.10.0",
            metadata: {
              grammar: "json-formula-1.0.0",
              version: "1.0.0"
            },
            items: [],
            action: formPath.split('.json')[0]
          }
    }

    async getFormModel(formPath: string)  {
        if(formPath) {
            
            console.time("Get Excel JSON")
            let exData = await this._getForm(formPath);
            console.timeEnd("Get Excel JSON")
    
            if(!exData || !exData.data) {
                throw new Error("Unable to retrieve the form details from " + formPath);
            }
            const formDef = this.#getFormDef(formPath);
            var stack: Array<any> = [];
            stack.push(formDef.items);
            let currentPanel:any = formDef;
            exData.data.forEach((item: any, index: number)=> {
                if(this.#isPanel(item)) {
                    item.items = {};
                    let panel = JSON.parse(JSON.stringify(item));
                    this.#handlePanel(panel);
                    currentPanel.items.push(panel);
                    stack.push(currentPanel);
                    currentPanel = panel;
                } else if(this.#isEndingPanel(item)) {
                    currentPanel = stack.pop();
                    if(!currentPanel) {
                        currentPanel = formDef;
                    }
                } else {
                    currentPanel.items.push(this.#handleProperty(formDef, item, index));
                }
            });
            return {formDef : formDef, excelData : exData};
        }
    }

    #handlePanel(item: any) {
        this.#cleanUpPanel(item);
        if(this.#haveRule(item)) {
            let rule = this.#handleHierarchy(item, RULE_TYPE);
            if(rule && Object.keys(rule).length != 0) {
                item.rules = rule;
            }
        }
        // Handle Events
        let events = this.#handleHierarchy(item, EVENTS);
        if(events && Object.keys(events).length != 0) {
            item.events = events;
        }
    }

    #handleProperty(formDef:any, item: any, index:number) {
        let source: any = Object.fromEntries(Object.entries(item).filter(([_, v]) => (v != null && v!= "")));
        let fieldType = ExcelToFormModel.fieldMapping.has(source.Type) ? ExcelToFormModel.fieldMapping.get(source.Type) : source.Type;
        let field: any = {
            name : source.Field,
            placeholder: source.Placeholder,
            type : "string", // TODO - define data type in excel
            fieldType : fieldType,
            value: source.Value,
            label : {
                value : source.Label
            },
            required: source.Mandatory ? true : false
        }

        if(field.type == "string") {
            this.#setProperty(source, "MaxLength", field, "maxLength");
            this.#setProperty(source, "MinLength", field, "minLength");
        } else {
            this.#setProperty(source, "Maximum", field, "maximum");
            this.#setProperty(source, "Minimum", field, "minimum");
            this.#setProperty(source, "Step", field, "step");
        }

        if(this.#haveRule(source)) {
            let rule = this.#handleHierarchy(source, RULE_TYPE);
            if(rule && Object.keys(rule).length != 0) {
                field.rules = rule;
                formDef.metadata.rulesUsed = true;
            }
        }
        if(this.#haveConstraintMsg(source)) {
            let constraints = this.#handleHierarchy(source, CONSTRAINT_MESSAGE);
            if(constraints && Object.keys(constraints).length != 0) {
                field.constraintMessages = constraints;
            }

        }
        // Handle Events
        let events = this.#handleHierarchy(source, EVENTS);
        if(events && Object.keys(events).length != 0) {
            field.events = events;
        }
        let enumNames = this.#handleMultiValues(source, "Options");
        if(enumNames) {
            field.enumNames = field.enum = enumNames
        }

        this.#handleCheckbox(field);
        return field;
    }

    #handleCheckbox(field: any) {
        if(field?.fieldType == "checkbox" && (!field.enum || field.enum.length == 0)) {
            field.enum = ["on"];
        }
    }

    #setProperty(source: any, sourceKey:string, target: any, targetKey: string) {
        if(source && source[sourceKey]) {
            target[targetKey] = source[sourceKey];
        }
    }

    #handleMultiValues(item: any, source: string): Array<string> {
        let values;
        if(item && item[source]) {
            values = item[source].split(",").map((value:string)=> value.trim());
        }
        return values;
    }

    #handleHierarchy(item: any, match: string) {
        let constraints:any = {};
        Object.keys(item).forEach((key) => {
            if(~key.indexOf(match)) {
                let constraint = key.split(".")[1];
                if(item[key]) {
                    constraints[constraint] = item[key];
                }
                delete item[key]
            }
        });
        return constraints;
    }

    #haveRule(item: any) {
        return (Object.keys(item).some(function(key){ return ~key.indexOf(RULE_TYPE) }));
    }

    #haveConstraintMsg(item: any) {
        return (Object.keys(item).some(function(key){ return ~key.indexOf(CONSTRAINT_MESSAGE) }));
    }

    #isPanel(item: any) {
        return item && item.type == PANEL_TYPE;
    }

    #isEndingPanel(item: any) {
        return item && item.viewType == PANEL_END;
    }

    #determineDataType(field: any) {
        
    }

    #cleanUpPanel(item: any) {
        //delete item.viewType;
        delete item.type;
    }
}