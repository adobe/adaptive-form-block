
const PROPERTY = "property";
const PROPERTY_RULES = "rules.properties";

export default class ExcelToFormModel {
    
    fieldPropertyMapping: any = {
        "Default" : "default",
        "MaxLength" : "maxLength",
        "MinLength" : "minLength",
        "Maximum" : "maximum",
        "Minimum" : "minimum",
        "Step" : "step",
        "Pattern" : "pattern",
        "Value" : "value",
        "Placeholder": "placeholder",
        "Field" : "name",
        "ReadOnly": "readOnly",
        "Description": "description",
        "Type" : "fieldType",
        "Label" : "label.value",
        "Mandatory": "required",
        "Options" : "enum"
    }
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

    #initFormDef(formPath:string): any {
        return {
            adaptiveform: "0.10.0",
            metadata: {
              grammar: "json-formula-1.0.0",
              version: "1.0.0"
            },
            properties: {},
            rules: {},
            items: [],
            action: formPath?.split('.json')[0]
          }
    }

    #initField() : any {
        return {
            constraintMessages: {
                required: "Please fill in this field."
            }
        }
    }

    async getFormModel(formPath: string)  {
        if(formPath) {
            console.time("Get Excel JSON")
            let exData = await this._getForm(formPath);
            console.timeEnd("Get Excel JSON")
            return this.transform(exData, formPath);
        }
    }

    transform(exData : any, formPath: string): {formDef: any, excelData: any} {
        // if its adaptive form json just return it.
        if(exData?.adaptiveform) {
            return {formDef : exData, excelData : null}
        }
        if(!exData || !exData.data) {
            throw new Error("Unable to retrieve the form details from " + formPath);
        }
        const formDef = this.#initFormDef(formPath);
        var stack: Array<any> = [];
        stack.push(formDef.items);
        let currentPanel:any = formDef;
        exData.data.forEach((item: any)=> {

            let source: any = Object.fromEntries(Object.entries(item).filter(([_, v]) => (v != null && v!= "")));
            let field = {...source, ...this.#initField()};
            this.#transformFieldNames(field);

            if(this.#isProperty(field)) {
                this.#handleProperites(formDef, field);
            }
             else {
                currentPanel.items.push(this.#handleField(field));
            }
        });
        this.#transformPropertyRules(formDef);
        return {formDef : formDef, excelData : exData};
    }

    #handleProperites(formDef:any, item: any) {
        formDef.properties[item.name] = item.default
        if(item.hasOwnProperty(PROPERTY_RULES)) {
            if(!formDef.rules.properties) {
                formDef.rules.properties = [];
            }
            formDef.rules.properties.push(`{${item.name}: ${item[PROPERTY_RULES]}}`)
        }
    }

    #transformPropertyRules(formDef: any) {
        if(formDef.rules.properties) {
            let properites = "merge($properties"
            formDef.rules.properties.forEach((rule:string) => {
                properites = properites + "," + rule
            })
            properites += ")"
            formDef.rules.properties = properites;
        }
    }

    /**
     * Transform flat field to Crispr Field
     * @param field 
     * @returns 
     */
    #handleField(field: any) {
        this.#transformFieldType(field);
        this.#transformFlatToHierarchy(field);

        this.#handleMultiValues(field, "enum");
        this.#handleMultiValues(field, "enumNames");

        this.#handleFranklinSpecialCases(field);

        this.#handleCheckbox(field);
        return field;
    }

    /**
     * Transform CRISPR fieldType to HTML Input Type.
     * @param field 
     */
    #transformFieldType(field: any) {
        if(ExcelToFormModel.fieldMapping.has(field.fieldType)) {
            field.fieldType = ExcelToFormModel.fieldMapping.get(field.fieldType) 
        }
    }

    /**
     * Convert Field names from Franklin Form to crispr def.
     * @param item Form Def received from excel
     */
    #transformFieldNames(item: any) {
        Object.keys(this.fieldPropertyMapping).forEach((key) => {
            if(item[key]) {
                item[this.fieldPropertyMapping[key]] = item[key];
                delete item[key]
            }
        })
    }

    /**
     * Convert flat field to hierarchy based on dot notation.
     * @param item Flat field Definition
     * @returns 
     */
    #transformFlatToHierarchy(item: any) {
        Object.keys(item).forEach((key) => {
            if(key.includes(".")) {
                let temp = item;
                key.split('.').map((k, i, values) => {
                    temp = (temp[k] = (i == values.length - 1 ? item[key] : (temp[k] != null ? temp[k] : {})))
                });
                delete item[key];
            }
        });
    }

    /**
     * If checkbox doesn't have any enum add ON.
     * @param field 
     */
    #handleCheckbox(field: any) {
        if(field?.fieldType == "checkbox" && (!field.enum || field.enum.length == 0)) {
            field.enum = ["on"];
        }
    }

    /**
     * handle multivalues field i.e. comma seprator to array.
     * @param item 
     * @param key 
     */
    #handleMultiValues(item: any, key: string) {
        let values;
        if(item && item[key]) {
            values = item[key].split(",").map((value:string)=> value.trim());
            item[key] = values;
        }
    }

    /**
     * Handle special use cases of Franklin.
     * @param item 
     */
    #handleFranklinSpecialCases(item: any) {
        //Franklin Mandatory uses x for true.
        item.required = (item.required == "x" || item.required == "true");
    }

    #isProperty(item: any) {
        return item && item.fieldType == PROPERTY;
    }
}