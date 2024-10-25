// Obsługa formularza dodawania produktów
document.getElementById("inventoryForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const product = document.getElementById("product").value;
    const quantity = document.getElementById("quantity").value;
    
    if (product && quantity) {
        addToInventory(product, parseInt(quantity, 10));
        document.getElementById("inventoryForm").reset();
    }
});

// Funkcja dodająca produkt do magazynu i zapisująca go w localStorage
// Funkcja dodająca produkt do magazynu i zapisująca go w localStorage
function addToInventory(product, quantity) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const existingProduct = inventory.find(item => item.product === product);

    if (existingProduct) {
        // Jeśli ilość po aktualizacji będzie poniżej 0, wyświetl ostrzeżenie
        if (existingProduct.quantity + quantity < 0) {
            alert(`Nie masz tyle ${product} baranie!`);
            return; // Przerwij, jeśli ilość byłaby ujemna
        }
        existingProduct.quantity += quantity;
    } else {
        // Dodaj nowy produkt, tylko jeśli ilość jest większa od 0
        if (quantity > 0) {
            inventory.push({ product, quantity });
        } else {
            alert("Nie można dodać produktu z ujemną ilością!");
            return; // Przerwij, jeśli próbujemy dodać produkt z ujemną ilością
        }
    }
    
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventoryList();
}


// Funkcja aktualizująca listę produktów
function updateInventoryList() {
    const inventoryList = document.getElementById("productList");
    inventoryList.innerHTML = ""; // Resetuj listę
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.product} - Ilość: ${item.quantity}`;
        listItem.addEventListener("click", () => selectProduct(item.product)); // Dodaj nasłuchiwanie na kliknięcie
        inventoryList.appendChild(listItem);
    });
}

// Funkcja wyboru produktu do edycji
function selectProduct(product) {
    document.getElementById("product").value = product; // Ustaw nazwę produktu w polu
    document.getElementById("quantity").value = ""; // Ustaw ilość na pusty ciąg
}

// Obsługa eksportu do pliku XLSX
document.getElementById("exportButton").addEventListener("click", function() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    
    const worksheet = XLSX.utils.json_to_sheet(inventory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    // Zapisz plik jako XLSX
    XLSX.writeFile(workbook, "inventory.xlsx");
});

// Aktualizacja listy produktów przy załadowaniu strony
window.addEventListener("load", function() {
    updateInventoryList();
});
