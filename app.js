// Przejścia między stronami
const viewListButton = document.getElementById("viewList");
if (viewListButton) {
    viewListButton.addEventListener("click", function() {
        window.location.href = "lista-produktow.html";
    });
}

const addRemoveButton = document.getElementById("addRemove");
if (addRemoveButton) {
    addRemoveButton.addEventListener("click", function() {
        window.location.href = "dodaj-usun.html";
    });
}

// Obsługa formularza dodawania produktów na głównej stronie
const inventoryForm = document.getElementById("inventoryForm");
if (inventoryForm) {
    inventoryForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const product = document.getElementById("product").value;
        const quantity = parseInt(document.getElementById("quantity").value, 10);
        
        if (product && !isNaN(quantity)) {
            modifyInventory(product, quantity);
            inventoryForm.reset();
            updateInventoryList();
        }
    });
}

// Funkcja dodająca lub aktualizująca produkt w magazynie
function modifyInventory(product, quantity) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const existingProduct = inventory.find(item => item.product === product);

    if (existingProduct) {
        existingProduct.quantity += quantity;
        if (existingProduct.quantity <= 0) {
            // Usuń produkt, jeśli ilość jest 0 lub mniej
            inventory.splice(inventory.indexOf(existingProduct), 1);
        }
    } else if (quantity > 0) {
        // Dodaj nowy produkt tylko, jeśli ilość jest większa niż 0
        inventory.push({ product, quantity });
    }

    // Zapisz zaktualizowaną listę w localStorage
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Funkcja aktualizująca listę produktów na `lista-produktow.html`
function updateInventoryList() {
    const inventoryList = document.getElementById("productList");
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

// Funkcja aktualizująca listę produktów na `dodaj-usun.html`
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

// Obsługa formularza zmiany stanu produktu na `dodaj-usun.html`
const modifyForm = document.getElementById("modifyForm");
if (modifyForm) {
    modifyForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const product = document.getElementById("modifyProduct").value;
        const quantity = parseInt(document.getElementById("modifyQuantity").value, 10);
        
        if (product && !isNaN(quantity)) {
            modifyInventory(product, quantity);
            updateModifyList();
            modifyForm.reset(); // Wyczyść formularz po dodaniu
        }
    });
}

// Funkcja eksportująca do pliku Excel
function exportToExcel() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    
    if (inventory.length === 0) {
        alert("Brak danych do eksportu!");
        return;
    }

    // Tworzenie nowego arkusza
    const worksheet = XLSX.utils.json_to_sheet(inventory);
    const workbook = XLSX.utils.book_new();
    
    // Dodaj arkusz do książki
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produkty");

    // Zapisz plik
    XLSX.writeFile(workbook, "inventory.xlsx");
}

// Dodaj nasłuchiwacz zdarzeń dla przycisku eksportu na stronie głównej
const exportButton = document.getElementById("exportButton");
if (exportButton) {
    exportButton.addEventListener("click", exportToExcel);
}

// Aktualizacja listy przy załadowaniu strony na odpowiednich stronach
window.addEventListener("load", function() {
    updateInventoryList();
    updateModifyList();
});
