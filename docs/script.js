
    let loadTemplate = async (selectEl) => {
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
        let view = document.getElementById("json_view");
        if(templateUrl) {
            let response = await fetch(templateUrl);
            let json = await response.json();
            view.innerHTML = (JSON.stringify(json, undefined, 2));
        } else {
            let view = document.getElementById("json_view");
            view.innerHTML = "";
        }

    }