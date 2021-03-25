let qa_items = document.createElement("main");
let body = document.querySelector("body");
let category_checkboxes = document.querySelector(".checkboxes.category")
body.append(qa_items);

// Get default.txt into the template text box
let client = new XMLHttpRequest();
client.open('GET', '/default.txt');
client.onreadystatechange = function () {
    document.querySelector(".template_text").value = client.responseText;
    on_change();
}
client.send();

let on_change = () => {
    let categories = Array();
    let text = document.querySelector(".template_text").value;

    text.split("\n").forEach((line) => {
        let item;
        let content = line.split(" ");
        let type = content.shift();
        content = content.join(" ");

        switch (type) {
            case "##":
                category = document.createElement("div");
                category.classList.add("category_list");
                categories.push(category);

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
                console.log(`Doesn't have a case: '${type} | ${content}'`);
                return;
        }
        categories[categories.length - 1].append(item)

        qa_items.innerHTML = ""

        categories.forEach((category) => {
            qa_items.append(category);
        });
    });

    category_checkboxes.innerHTML = "<p>Categories:</p>"

    document.querySelectorAll(".category_list").forEach((item) => {
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

        category_checkboxes.append(checkbox);
        category_checkboxes.append(label);
        category_checkboxes.append(document.createElement("br"));
    })
}

document.querySelector(".template_text").addEventListener("change", on_change);

document.querySelector(".checkboxes.type").addEventListener("change", (event) => {
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

category_checkboxes = document.querySelector(".checkboxes.category")

document.querySelectorAll(".category_list").forEach((item) => {
    let text = item.querySelector("h2").innerText;

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = text;
    checkbox.value = text;
    checkbox.checked = true;

    let label = document.createElement("label");
    label.setAttribute("for", text);
    label.innerText = text;

    checkbox.addEventListener("change", (event) => {
        item.style = (event.target.checked) ? "" : "display: none;";
    });

    category_checkboxes.append(checkbox);
    category_checkboxes.append(label);
    category_checkboxes.append(document.createElement("br"));
})

document.querySelector(".markdown_clipboard").addEventListener("click", (event) => {
    let markdown_text = ""

    document.querySelectorAll(".category_list").forEach((category) => {
        if (category.style.display === "") {
            items = category.children
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.style.display === "") {
                    switch (item.nodeName) {
                        case "H2":
                            markdown_text += `\n## ${item.innerText}\n\n`;
                            break;
                        case "LI":
                            if (item.firstChild.checked) {
                                markdown_text += `- [x] ${item.innerText}\n`;
                            } else {
                                markdown_text += `- [ ] ${item.innerText}\n`;
                            }
                            break;
                    }
                }
            }
        }
    });

    window.navigator.clipboard.writeText(markdown_text)
})
