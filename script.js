
class Item {
    static list = [];
    static countItems = 0;

    constructor(name, qtyAvailable, qtyPerUnity, price, category, measure, place, description, img) {
        Item.countItems++;
        this.id = Item.countItems;
        this.name = name;
        this.qtyAvailable = qtyAvailable;
        this.qtyPerUnity = qtyPerUnity;
        this.price = Number.parseFloat(price).toFixed(2);
        this.category = category;
        this.measure = measure;
        this.place = place;
        this.description = description;
        this.img = img;
        Item.list.push(this);
    }

    getHtml() {
        return `<div class="item" id="${this.id}" onclick="Site.itemAction(${this.id})">
                    <div>
                        <div class="img-container">
                            <img width="175" height="250" src="${this.img}">
                        </div>
                        <div class="description-container">
                            <div class="price">
                                <span>R$&nbsp</span><div>${this.price}</div>
                            </div>
                            <div class="name">${this.name}</div>
                            <div class="qtyAvailable center">Disponível: ${this.qtyAvailable+this.measure}</div>
                        </div>
                    </div>
                </div>`;
    }

    toObject() {
        return {
            name:this.name, 
            qtyAvailable:this.qtyAvailable, 
            qtyPerUnity:this.qtyPerUnity, 
            price:this.price, 
            category:this.category, 
            measure:this.measure, 
            place:this.place,
            description:this.description,
            img:this.img
        };
    }

    static saveEdit(id) {
        let item = Item.list[id-1];
        item.name = document.getElementById("editName").innerText;
        let price = Number.parseFloat(document.getElementById("editPrice").value);
        item.price = Number(price).toFixed(2);
        let qtyAvailable = document.getElementById("editQtyAvailable").value;
        item.qtyAvailable = qtyAvailable;
        let qtyPerUnity = document.getElementById("editQtyPerUnity").value;
        item.qtyPerUnity = qtyPerUnity;
        item.category = document.getElementById("editCategory").innerText;
        item.measure = document.getElementById("editMeasure").value;
        item.place = document.getElementById("editPlace").innerText;
        item.description = document.getElementById("editDescription").innerText;
        item.img = document.getElementById("editImg").value;
        Inventory.refresh();
        Inventory.htmlRefresh();
    }

    static add() {
        let name = document.getElementById("editName").innerText;
        let price = Number(Number.parseFloat(document.getElementById("editPrice").value)).toPrecision(3);
        let qtyAvailable = document.getElementById("editQtyAvailable").value;
        let qtyPerUnity = document.getElementById("editQtyPerUnity").value;
        let category = document.getElementById("editCategory").innerText;
        let measure = document.getElementById("editMeasure").value;
        let place = document.getElementById("editPlace").innerText;
        let description = document.getElementById("editDescription").innerText;
        let img = document.getElementById("editImg").value;
        new Item(name, qtyAvailable, qtyPerUnity, price, category, measure, place, description, img);
        Inventory.refresh();
        Inventory.htmlRefresh();
    }
    
    static remove(id) {
        Item.list.splice(id-1,1)
        Inventory.refresh();
        Inventory.htmlRefresh();
    }
}

const Storage = {
    get(key) {
        return JSON.parse(window.localStorage.getItem(JSON.stringify(key)));
    },

    set(key, value) {
        window.localStorage.setItem(JSON.stringify(key), JSON.stringify(value));
    },

    remove(key) {
        window.localStorage.removeItem(JSON.stringify(key));
    }
}

const Inventory = {
    init() {
        this.constructItems();
        this.htmlRefresh()
    },

    constructItems() {
        let items = Storage.get("Items");
        for (let i = 0; i < items.length; i++) {
            new Item(items[i].name, items[i].qtyAvailable, items[i].qtyPerUnity, items[i].price, items[i].category, items[i].measure, items[i].place, items[i].description, items[i].img);
        }
    },

    htmlRefresh() {
        let content = "";
        for (let i = 0; i < Item.list.length; i++) {
            content += Item.list[i].getHtml();
        }
        if (content == "") {
            content += '<h2 style="margin: auto; color: white;">Nenhum item cadastrado</h2>';
        }
        document.getElementById("itemContainer").innerHTML = content;
    },

    refresh() {
        let items = [];
        for (let i = 0; i < Item.list.length; i++) {
            items.push(Item.list[i].toObject());
        }
        Storage.set("Items", items);
    }

}

const Menu = {
    isOpened:false,

    show() {
        document.getElementById("overlay-box").style.display = "block";
        setTimeout( () => {
            document.getElementById("content-box").style.marginBlockStart = "96px";
        }, 100 );
    },

    hide() {
        document.getElementById("content-box").style.marginBlockStart = "";
        setTimeout( () => {
            document.getElementById("overlay-box").style.display = "";
        }, 300 );
    },

    switch() {
        if (Menu.isOpened) {
            Menu.hide();
            Menu.isOpened = false;
        } else {
            Menu.show();
            Menu.isOpened = true;
        }
    },

    setContent(content) {
        document.getElementById("content-menu").innerHTML = content;
    },

    models:{   
        getItemInfo(id) {
            let item = Item.list[Number.parseInt(id)-1].toObject();
            let tableContent = `
                <h2>Informações</h2>
                <div style="display:flex; overflow-y: hidden; max-width: 80vw; max-height: 60vh;">
                    <table style="display: flex;">
                        <tbody>
                            <tr>
                                <td>Nome</td>
                                <td>${item.name}</td>
                            </tr>
                            <tr>
                                <td>Preço</td>
                                <td>R$ ${item.price}</td>
                            </tr>
                            <tr>
                                <td>Pacotes Disponíveis</td>
                                <td>${item.qtyAvailable}</td>
                            </tr>
                            <tr>
                                <td>${item.measure + " por pacote"}</td>
                                <td>${item.qtyPerUnity + item.measure}</td>
                            </tr>
                            <tr>
                                <td>Valor em estoque</td>
                                <td>R$ ${item.qtyAvailable * item.price}</td>
                            </tr>
                            <tr>
                                <td>Tipo</td>
                                <td>${item.category}</td>
                            </tr>
                            <tr>
                                <td>Medida</td>
                                <td>${item.measure}</td>
                            </tr>
                            <tr>
                                <td>Localização</td>
                                <td>${item.place}</td>
                            </tr>
                            <tr>
                                <td>Descrição</td>
                                <td>${item.description}</td>
                            </tr>
                            <tr>
                                <td>Imagem</td>
                                <td><a href="" onclick="
                                    event.preventDefault();
                                    document.getElementById('menu-img-container').style.display='block';
                                ">Ver imagem</a></td>
                            </tr>
                        </tbody>
                    </table>
                    <div id="menu-img-container" style="overflow-x: auto;">
                        <img src="${item.img}" onload="
                            let aspectRatio = this.width/this.height;
                            let containerHeight = document.querySelector('#content-menu div').getClientRects()[0].height;
                            this.height = containerHeight*0.9;
                            this.width = this.height*aspectRatio;
                        ">
                        <div>
                            <a href="" onclick="event.preventDefault();document.getElementById('menu-img-container').style.display='none';
                            ">Esconder imagem</a>
                        </div>
                    </div>
                </div>
            `;
            Menu.setContent(tableContent);
            Menu.isOpened = true;
            Menu.show();
        },

        editItemInfo(id) {
            let item = Item.list[Number.parseInt(id)-1].toObject();
            let tableContent = `
                <h2>Editar Produto</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Nome</td>
                            <td><p id="editName" contentEditable="true">${item.name}</p></td>
                        </tr>
                        <tr>
                            <td>Preço</td>
                            <td><input type="number" id="editPrice" contentEditable="true" value="${item.price}"></td>
                        </tr>
                        <tr>
                            <td>Pacotes Disponíveis</td>
                            <td><input type="number" id="editQtyAvailable" contentEditable="true" value="${item.qtyAvailable}"></td>
                        </tr>
                        <tr>
                            <td id="measureLabel">${item.measure + " por pacote"}</td>
                            <td><input type="number" id="editQtyPerUnity" contentEditable="true" value="${item.qtyPerUnity}"></td>
                        </tr>
                        <tr>
                            <td>Tipo</td>
                            <td><p id="editCategory" contentEditable="true">${item.category}</p></td>
                        </tr>
                        <tr>
                            <td>Medida</td>
                            <td>
                                <select id="editMeasure" style="border-radius: 10px;padding: 3px;width: 100%; cursor: pointer;">
                                    <option value="un" ${item.measure == "un"?"selected":""}>Unidade (un)</option>
                                    <option value="kg" ${item.measure == "kg"?"selected":""}>Kilos (kg)</option>
                                    <option value="l" ${item.measure == "l"?"selected":""}>Litros (l)</option>
                                    <option value="m" ${item.measure == "m"?"selected":""}>Metros (m)</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Localização</td>
                            <td><p id="editPlace" contentEditable="true">${item.place}</p></td>
                        </tr>
                        <tr>
                            <td>Descrição</td>
                            <td><p id="editDescription" contentEditable="true">${item.description}</p></td>
                        </tr>
                        <tr>
                            <td>Imagem</td>
                            <td><div class="getFileContainer" style="display: flex;">
                                <input type="text" id="editImg" value="${item.img}" placeholder="Link da Imagem" required>
                                <label for="selectLocalImg"><img src="https://raw.githubusercontent.com/DaviSenai/e-commerce/main/icons/searchImg.png"></label>
                                <input type="file" id="selectLocalImg" accept="image/png, image/gif, image/jpeg">
                            </div></td>
                        </tr>
                    </tbody>
                </table>
                <div style="display:flex; justify-content: end;">
                    <button class="simpleButton" style="background: transparent" onclick="Menu.switch();">Cancelar</button>
                    <button class="simpleButton" style="color: white; background: linear-gradient(to right, #006175 0%, #00a950 100%)" onclick="Item.saveEdit(${id}); Menu.switch()">Salvar</button>
                </div>
            `;
            Menu.setContent(tableContent);
            Menu.isOpened = true;
            Menu.show();
            
            for (let element of document.querySelectorAll("table p")) {
                element.addEventListener('keydown', (e) => {
                    if (e.key == "Enter") {
                        e.preventDefault() ;
                    }
                })
            }

            document.getElementById("editMeasure").addEventListener("change", (event) => {
                document.getElementById("measureLabel").innerText = event.target.value + " por pacote";
            });

            document.getElementById("selectLocalImg").addEventListener('change', (event) => {  
                let input = document.getElementById("selectLocalImg");
                let fReader = new FileReader();
                fReader.readAsDataURL(input.files[0]);
                fReader.onloadend = function(event){
                    document.getElementById("editImg").value = event.target.result;
                }
            });
        },

        addForm() {
            let tableContent = `
                <h2>Cadastrar Produto</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Nome</td>
                            <td><p id="editName" contentEditable="true"></p></td>
                        </tr>
                        <tr>
                            <td>Preço</td>
                            <td><input type="number" id="editPrice" contentEditable="true" value="0.00"></td>
                        </tr>
                        <tr>
                            <td>Pacotes Disponíveis</td>
                            <td><input type="number" id="editQtyAvailable" contentEditable="true" value="0"></td>
                        </tr>
                        <tr>
                            <td id="measureLabel">un por pacote</td>
                            <td><input type="number" id="editQtyPerUnity" contentEditable="true" value="0"></td>
                        </tr>
                        <tr>
                            <td>Tipo</td>
                            <td><p id="editCategory" contentEditable="true"></p></td>
                        </tr>
                        <tr>
                            <td>Medida</td>
                            <td>
                                <select id="editMeasure" style="border-radius: 10px;padding: 3px;width: 100%; cursor: pointer;">
                                    <option value="un">Unidade (un)</option>
                                    <option value="kg">Kilos (kg)</option>
                                    <option value="l">Litros (l)</option>
                                    <option value="m">Metros (m)</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Localização</td>
                            <td><p id="editPlace" contentEditable="true"></p></td>
                        </tr>
                        <tr>
                            <td>Descrição</td>
                            <td><p id="editDescription" contentEditable="true"></p></td>
                        </tr>
                        <tr>
                            <td>Imagem</td>
                            <td><div class="getFileContainer" style="display: flex;">
                                <input type="text" id="editImg" placeholder="Link da Imagem" required>
                                <label for="selectLocalImg"><img src="https://raw.githubusercontent.com/DaviSenai/e-commerce/main/icons/searchImg.png"></label>
                                <input type="file" id="selectLocalImg" accept="image/png, image/gif, image/jpeg">
                            </div></td>
                        </tr>
                    </tbody>
                </table>
                <div style="display:flex; justify-content: end;">
                    <button class="simpleButton" style="background: transparent" onclick="Menu.switch();">Cancelar</button>
                    <button class="simpleButton" style="color: white; background: linear-gradient(to right, #006175 0%, #00a950 100%)" onclick="Item.add(); Menu.switch()">Salvar</button>
                </div>
            `;
            Menu.setContent(tableContent);
            Menu.isOpened = true;
            Menu.show();
            
            for (let element of document.querySelectorAll("table p")) {
                element.addEventListener('keydown', (e) => {
                    if (e.key == "Enter") {
                        e.preventDefault() ;
                    }
                })
            }

            document.getElementById("editMeasure").addEventListener("change", (event) => {
                document.getElementById("measureLabel").innerText = event.target.value + " por pacote";
            });

            document.getElementById("selectLocalImg").addEventListener('change', (event) => {  
                let input = document.getElementById("selectLocalImg");
                let fReader = new FileReader();
                fReader.readAsDataURL(input.files[0]);
                fReader.onloadend = function(event){
                    document.getElementById("editImg").value = event.target.result;
                }
            });
        },

        removeItem(id) {
            let tableContent = `
                <h2>Tem certeza que deseja excluir esse produto?</h2>
                <div style="display:flex; justify-content: end;">
                    <button class="simpleButton" style="background: transparent" onclick="Menu.switch()">Cancelar</button>
                    <button class="simpleButton" style="color: white; background: linear-gradient(to right, #006175 0%, #00a950 100%)" onclick="Item.remove(${id}); Menu.switch();">Confirmar</button>
                </div>
            `;
            Menu.setContent(tableContent);
            Menu.isOpened = true;
            Menu.show();
        }
    }
}

const Site = {
    //1 - View, 2 - Edit, 3 - Remove
    mode: 1,

    showModeBar(status) {
        if (status) {
            document.getElementById("editContainer").classList.add("active");
            document.querySelector("#toolContainer :nth-child(1)").classList.remove("active");
            document.querySelector("#toolContainer :nth-child(2)").classList.add("active");
        } else {
            document.getElementById("editContainer").classList.remove("active");
            document.querySelector("#toolContainer :nth-child(1)").classList.add("active");
            document.querySelector("#toolContainer :nth-child(2)").classList.remove("active");
        }
    },

    setEditMode(mode){
        if (mode == 2) {
            this.mode = mode;
            document.querySelector("#editContainer").classList.add("active");
            document.querySelector("#editContainer :nth-child(2)").classList.add("active");
            document.querySelector("#editContainer :nth-child(3)").classList.remove("active");
        } else if (mode == 3) {
            this.mode = mode;
            document.querySelector("#editContainer").classList.add("active");
            document.querySelector("#editContainer :nth-child(2)").classList.remove("active");
            document.querySelector("#editContainer :nth-child(3)").classList.add("active");
        } else {
            this.mode = 1;
            this.showModeBar(false);
        }
        this.switchModeButton(this.mode);
    },
    
    switchModeButton(selected){
        if (selected == 1) {
            document.querySelector("#toolContainer :nth-child(1)").classList.add("active");
            document.querySelector("#toolContainer :nth-child(2)").classList.remove("active");
        } else {
            document.querySelector("#toolContainer :nth-child(1)").classList.remove("active");
            document.querySelector("#toolContainer :nth-child(2)").classList.add("active");
        }
    },

    itemAction(id) {
        switch(this.mode) {
            case 1:
                Menu.models.getItemInfo(id);
                break;
            case 2:
                Menu.models.editItemInfo(id);
                break;
            case 3:
                Menu.models.removeItem(id);
                break;
        }
    },

    config() {
        let site = Storage.get("Site");
        let name = "";
        let logo = "";
        if (site != null) {
            name = site.name;
            logo = site.logo;
        }
        let inputStyle = `
            display: block; margin: auto;
            width: 100%;
            margin: 10px auto;
            padding: 3px;
            border: 0;
            border-radius: 5px;
            color: black;
            background: rgb(14, 14, 16, 0.1);
        `;
        let tableContent = `
            <form onsubmit="event.preventDefault(); Site.saveConfig(); Menu.switch()">
                <input type="text" id="editSiteName" value="${name}" placeholder="Nome do Site" style="${inputStyle}" required>
                <div class="getFileContainer" style="display: flex;">
                    <input type="text" id="editSiteLogo" value="${logo}" placeholder="Link da Logotipo" style="${inputStyle}" required>
                    <label for="selectLocalImg"><img src="https://raw.githubusercontent.com/DaviSenai/e-commerce/main/icons/searchImg.png"></label>
                    <input type="file" id="selectLocalImg" accept="image/png, image/gif, image/jpeg">
                </div>
                <div>
                    <input type="submit" value="Confirmar" class="gradientButton" style="width: fit-content; height: fit-content; padding: 5px; margin: 0 0 0 auto; color: white;">
                </div>
            </form>
        `;
        Menu.setContent(tableContent);
        Menu.isOpened = true;
        Menu.show();

        document.getElementById("selectLocalImg").addEventListener('change', (event) => {  
            let input = document.getElementById("selectLocalImg");
            let fReader = new FileReader();
            fReader.readAsDataURL(input.files[0]);
            fReader.onloadend = function(event){
                document.getElementById("editSiteLogo").value = event.target.result;
            }
        });
        

    },

    saveConfig() {
        let name = document.getElementById("editSiteName").value;
        let logo = document.getElementById("editSiteLogo").value;
        let config = {name:name, logo:logo};
        Storage.set("Site",config);
        document.getElementById("siteName").innerText = name;
        document.getElementById("siteLogo").src = logo;
        document.getElementById("siteTitle").innerText = name;
        document.getElementById("siteIcon").href = logo;
    },

    resizeWindow() {
        document.getElementById("itemContainer").style.width = Math.floor(document.body.getClientRects()[0].width * 0.8 / 250) * 250 + "px";
    }
}

