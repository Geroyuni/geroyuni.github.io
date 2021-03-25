let body = document.querySelector("body");
let categories = document.querySelector(".categories");
let section_area = document.createElement("div");
body.append(section_area);

// Get default.txt into the template text box
let client = new XMLHttpRequest();
client.open('GET', '/default.txt');
client.onreadystatechange = function () {
    document.querySelector(".template_text").value = client.responseText;
    update_categories_settings();
}
client.send();

// Listener function for "Categories" settings
let update_categories_settings = () => {
    let sections = Array();
    let text = document.querySelector(".template_text").value;

    text.split("\n").forEach((line) => {
        let item;
        let content = line.split(" ");
        let type = content.shift();
        content = content.join(" ");

        switch (type) {
            case "##":
                section = document.createElement("div");
                section.classList.add("section");
                sections.push(section);

                item = document.createElement("h2");
                item.innerHTML = content;
                break;
            case "-e":
                item = document.createElement("li");
                item.classList.add("essential");
                item.innerHTML = `<input type="checkbox"> ${content}`;
                break;
            case "-t":
                item = document.createElement("li");
                item.classList.add("thorough");
                item.innerHTML = `<input type="checkbox"> ${content}`;
                break;
            case "-d":
                item = document.createElement("li");
                item.classList.add("deep");
                item.innerHTML = `<input type="checkbox"> ${content}`;
                break;
            default:
                console.log(`Section of template being ignored: '${type} ${content}'`);
                return;
        }
        sections[sections.length - 1].append(item)

        section_area.innerHTML = ""

        sections.forEach((section) => {
            section_area.append(section);
        });
    });

    categories.innerHTML = "<p>Categories:</p>"

    document.querySelectorAll(".section").forEach((item) => {
        let inner_text = item.querySelector("h2").innerText;

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = inner_text;
        checkbox.value = inner_text;
        checkbox.checked = true;

        let label = document.createElement("label");
        label.setAttribute("for", inner_text);
        label.innerText = inner_text;

        checkbox.addEventListener("change", (event) => {
            item.style = (event.target.checked) ? "" : "display: none;";
        });

        categories.append(checkbox);
        categories.append(label);
        categories.append(document.createElement("br"));
    })
}

// Add listener for "Categories" settings
document.querySelector(".template_text").addEventListener("change", update_categories_settings);

// Add listener for "Types" settings
document.querySelector(".types").addEventListener("change", (event) => {
    document.querySelectorAll("li").forEach((item) => {
        switch (event.target.value) {
            case "nocategory":
                if (item.classList.contains("nocategory")) {
                    item.style = (event.target.checked) ? "" : "display: none;";
                }
            case "essential":
                if (item.classList.contains("essential")) {
                    item.style = (event.target.checked) ? "" : "display: none;";
                }
                break;
            case "thorough":
                if (item.classList.contains("thorough")) {
                    item.style = (event.target.checked) ? "" : "display: none;";
                }
                break;
            case "deep":
                if (item.classList.contains("deep")) {
                    item.style = (event.target.checked) ? "" : "display: none;";
                }
                break;
        }
    });
});

// Copy Markdown button
document.querySelector(".clipboard").addEventListener("click", (event) => {
    let markdown_text = ""

    document.querySelectorAll(".section").forEach((section) => {
        if (section.style.display === "") {
            items = section.children
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.style.display === "") {
                    switch (item.nodeName) {
                        case "H2":
                            markdown_text += `\n## ${item.innerText}\n`;
                            break;
                        case "LI":
                            if (item.firstChild.checked) {
                                markdown_text += `- [x]${item.innerText}\n`;
                            } else {
                                markdown_text += `- [ ]${item.innerText}\n`;
                            }
                            break;
                    }
                }
            }
        }
    });

    window.navigator.clipboard.writeText(markdown_text)
})
