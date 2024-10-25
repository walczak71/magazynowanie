// Obsługa przejścia na podstrony
document.getElementById("viewList").addEventListener("click", function() {
    window.location.href = "lista-produktow.html";
});

document.getElementById("addRemove").addEventListener("click", function() {
    window.location.href = "dodaj-usun.html";
});

// Obsługa formularza dodawania produktów na głównej stronie
document.getElementById("inventoryForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const product = document.getElementById("product").value;
    const quantity = document.getElementById("quantity").value;
    
    if (product && quantity) {
        addToInventory(product, parseInt(quantity, 10));
        document.getElementById("inventoryForm").reset();
    }
});

// Funkcja dodająca produkt do magazynu i zapisująca go w localStorage
function addToInventory(product, quantity) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const existingProduct = inventory.find(item => item.product === product);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        inventory.push({ product, quantity });
    }
    
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventoryList();
}

// Funkcja aktualizująca listę produktów
function updateInventoryList() {
    const inventoryList = document.getElementById("inventoryList");
    if (inventoryList) {
        inventoryList.innerHTML = "";
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.product} - Ilość: ${item.quantity}`;
            inventoryList.appendChild(listItem);
        });
    }
}

// Funkcja aktualizująca listę produktów na stronie dodaj-usun.html
function updateModifyList() {
    const modifyProductList = document.getElementById("modifyProductList");
    if (modifyProductList) {
        modifyProductList.innerHTML = "";
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.product} - Ilość: ${item.quantity}`;
            listItem.dataset.index = index;
            listItem.addEventListener("click", () => selectProduct(index));
            modifyProductList.appendChild(listItem);
        });
    }
}

// Funkcja wyboru produktu do modyfikacji
function selectProduct(index) {
    const inventory = JSON.parse(localStorage.getItem("inventory"));
    const product = inventory[index];
    document.getElementById("modifyProduct").value = product.product;
}

// Obsługa formularza modyfikacji produktów
document.getElementById("modifyForm")?.addEventListener("submit", function(event) {
    event.preventDefault();

    const product = document.getElementById("modifyProduct").value;
    const quantity = parseInt(document.getElementById("modifyQuantity").value, 10);
    
    modifyInventory(product, quantity);
    updateModifyList();
});

// Funkcja dodająca lub aktualizująca produkt w magazynie
function modifyInventory(product, quantity) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const item = inventory.find(item => item.product === product);

    if (item) {
        item.quantity += quantity;
        if (item.quantity <= 0) {
            inventory.splice(inventory.indexOf(item), 1); // Usuń produkt, jeśli ilość jest 0 lub mniej
        }
    } else if (quantity > 0) {
        inventory.push({ product, quantity });
    }

    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Aktualizacja listy produktów na stronie dodaj-usun.html
function updateModifyList() {
    const modifyProductList = document.getElementById("modifyProductList");
    if (modifyProductList) {
        modifyProductList.innerHTML = "";
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.product} - Ilość: ${item.quantity}`;
            listItem.dataset.index = index;
            listItem.addEventListener("click", () => selectProduct(item.product));
            modifyProductList.appendChild(listItem);
        });
    }
}

// Funkcja wyboru produktu do edycji
function selectProduct(product) {
    document.getElementById("modifyProduct").value = product;
}

// Obsługa formularza zmiany stanu produktu
document.getElementById("modifyForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const product = document.getElementById("modifyProduct").value;
    const quantity = parseInt(document.getElementById("modifyQuantity").value, 10);
    
    if (product && !isNaN(quantity)) {
        modifyInventory(product, quantity);
        updateModifyList();
        document.getElementById("modifyForm").reset(); // Wyczyść formularz po dodaniu
    }
});

// Aktualizuj listę przy załadowaniu strony
window.addEventListener("load", function() {
    updateModifyList();
});

// Załaduj listy na odpowiednich stronach
window.addEventListener("load", function() {
    updateInventoryList();
    updateModifyList();
});
