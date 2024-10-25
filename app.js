// Funkcja dodająca produkt do Local Storage
function addProductToLocalStorage(product) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
}

// Funkcja ładująca produkty z Local Storage
function loadProductsFromLocalStorage() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Wyczyść listę przed dodaniem

    products.forEach(product => {
        const li = document.createElement("li");
        li.textContent = `${product.name} - ${product.quantity}`;
        productList.appendChild(li);
    });
}

// Funkcja do przełączania widoków
function toggleView(mainVisible, productListVisible, addProductVisible) {
    document.getElementById("productListContainer").style.display = productListVisible ? "block" : "none";
    document.getElementById("addProductContainer").style.display = addProductVisible ? "block" : "none";
    document.querySelector(".container").style.display = mainVisible ? "flex" : "none";
}

// Ustawienia zdarzeń na elementach
document.addEventListener("DOMContentLoaded", () => {
    loadProductsFromLocalStorage();

    document.getElementById("productsCard").addEventListener("click", () => {
        toggleView(false, true, false);
    });

    document.getElementById("addRemoveCard").addEventListener("click", () => {
        toggleView(false, false, true);
    });

    document.getElementById("exportCard").addEventListener("click", () => {
        // Funkcja eksportu do pliku Excel (dodaj ją tutaj)
    });

    document.getElementById("backToMain").addEventListener("click", () => {
        toggleView(true, false, false);
    });

    document.getElementById("backToMainFromAdd").addEventListener("click", () => {
        toggleView(true, false, false);
    });

    document.getElementById("submitButton").addEventListener("click", function() {
        const productName = document.getElementById("productName").value;
        const productQuantity = parseInt(document.getElementById("productQuantity").value);
        
        if (productName && !isNaN(productQuantity)) {
            const product = { name: productName, quantity: productQuantity };
            addProductToLocalStorage(product);
            loadProductsFromLocalStorage(); // Odśwież listę produktów
        }
    });
});
