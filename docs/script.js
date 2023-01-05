import loadForm from "../src/adaptiveform.js"


let loadTemplate = async (event) => {
    let selectEl = event.target;
    let templateUrl = selectEl.value;
    let a = document.createElement("a");
    a.id = "form";
    a.href = templateUrl;
    a.textContent = selectEl.options[selectEl.selectedIndex].text
    document.getElementById("form").innerHTML = "";
    document.getElementById("form").appendChild(a);
    if(templateUrl) {
        loadForm(document.getElementById("form"))
    } 
    await loadJson(templateUrl);
}

let loadJson = async (templateUrl) => {
    if(templateUrl) {
        let response = await fetch(templateUrl);
        let json = await response.json();
        setJSON(json);
        view.innerHTML = (JSON.stringify(json, undefined, 2));
    } else {
        setJSON();
    }
}

let setJSON = (data) => {
    let editor = ace.edit("editor");
    editor.session.setUseWorker(false);
    editor.getSession().setMode("ace/mode/json");
    editor.getSession().setUseWrapMode(true);editor.setOptions({
        maxLines: 400
    });
    editor.setValue(JSON.stringify(data, null , 2));
}
document.querySelector("[id='template']")?.addEventListener("change", loadTemplate);