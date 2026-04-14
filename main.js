//Store all productss loaded from the JSON file
let products = [];
//Store items that the user adds to the shopping cart
let cart = [];

//waits until tha page has fully loaded before running the app
document.addEventListener("DOMContentLoaded", startApp);

//Starts the app
function startApp() {
    //sets up the nav link
    setupNavigation();

    //sets up the browse filters and buttons
    setupControls();

    //loads product data from the JSON file
    loadProducts();

    //sets up the cart functions
    setupCartOptions();

    //shows the home view first
    showView("homeView");

    //updates cart count
    updateCartCount();
}

//adds click events to the nav links
function setupNavigation() {
    //when home is clicked, show the home view
    document.getElementById("navHome").addEventListener("click", function (event) {

        event.preventDefault();

        document.getElementById("homeCheckoutMessage").style.display = "none";

        showView("homeView");

    });

    //when browse is clicked, show the browse view
    document.getElementById("navBrowse").addEventListener("click", function (event) {

        event.preventDefault();

        document.getElementById("homeCheckoutMessage").style.display = "none";

        showView("browseView");

    });

    //when cart is clicked, show cart view
    document.getElementById("navCart").addEventListener("click", function (event) {

        event.preventDefault();

        document.getElementById("homeCheckoutMessage").style.display = "none";

        showView("cartView");
        renderCart();

    });

    //when about is clicked, show the about dialog
    document.getElementById("navAbout").addEventListener("click", function (event) {

        event.preventDefault();

        document.getElementById("homeCheckoutMessage").style.display = "none";

        document.getElementById("aboutDialog").style.display = "block";

    });

    //when close is clicked, hide the about dialog
    document.getElementById("closeAboutBtn").addEventListener("click", function () {

        document.getElementById("aboutDialog").style.display = "none";

    });
}


function setupControls() {
    //renders the products when the search text changes
    document.getElementById("searchInput").addEventListener("input", function () {

        renderProducts();
    });

    //renders products when the category changes
    document.getElementById("categorySelect").addEventListener("change", function () {

        renderProducts();
    });

    //renders the products when the gender changes
    document.getElementById("genderSelect").addEventListener("change", function () {

        renderProducts();
    });

    //renders the products when the color changes
    document.getElementById("colorSelect").addEventListener("change", function () {

        renderProducts();
    });

    //renders the products when the sort options change
    document.getElementById("sortSelect").addEventListener("change", function () {

        renderProducts();
    });

    //clear all function to clear options and show all products again
    document.getElementById("clearFiltersBtn").addEventListener("click", function () {

        document.getElementById("searchInput").value = "";
        document.getElementById("categorySelect").value = "all";
        document.getElementById("genderSelect").value = "all";
        document.getElementById("colorSelect").value = "all";
        document.getElementById("sortSelect").value = "default";

        renderProducts();
    });
}

//hides all views and then shows only the selected one
function showView(viewId) {
    //hide home
    document.getElementById("homeView").style.display = "none";

    //hide browse
    document.getElementById("browseView").style.display = "none";

    //hide product
    document.getElementById("singleProductView").style.display = "none";

    //hide cart
    document.getElementById("cartView").style.display = "none";

    //shows the view that was passed into the function
    document.getElementById(viewId).style.display = "block";
}

//loads products data from the JSON file
function loadProducts() {
    //get the JSON text from the script tag in the HTML page
    let jsonText = document.getElementById("productData").textContent;

    //converts the JSON text into a JavaScript array
    products = JSON.parse(jsonText);

    //fill the category dropdown
    fillCategoryOptions();

    //fill the color dropdown
    fillColorOptions();

    //display the products
    renderProducts();
}

//fills the category drop down with unique categories
function fillCategoryOptions() {

    let categorySelect = document.getElementById("categorySelect");
    let foundCategories = [];

    //loops through all products
    for (let i = 0; i < products.length; i++) {

        let category = products[i].category;
        let exists = false;

        //checks if this category is already in the FoundCategories array
        for (let j = 0; j < foundCategories.length; j++) {

            if (foundCategories[j] === category) {

                exists = true;

            }
        }

        //if its not stored already this adds it
        if (exists === false) {

            foundCategories.push(category);
        }

    }

    //create an option element for each different category
    for (let i = 0; i < foundCategories.length; i++) {

        let option = document.createElement("option");

        option.value = foundCategories[i];
        option.textContent = foundCategories[i];
        categorySelect.appendChild(option);

    }
}

function fillColorOptions() {
    let colorSelect = document.getElementById("colorSelect");
    let foundColors = [];

    //loops through all products
    for (let i = 0; i < products.length; i++) {

        let productColors = products[i].color;

        //loops through the colors for one product
        for (let j = 0; j < productColors.length; j++) {

            let colorName = productColors[j].name;
            let exists = false;

            //check if this color is already stored
            for (let k = 0; k < foundColors.length; k++) {

                if (foundColors[k] === colorName) {

                    exists = true;
                }
            }

            //if not already stored, add it
            if (exists === false) {

                foundColors.push(colorName);
            }
        }
    }

    //create an option for each different color
    for (let i = 0; i < foundColors.length; i++) {

        let option = document.createElement("option");
        option.value = foundColors[i];
        option.textContent = foundColors[i];
        colorSelect.appendChild(option);
    }
}

//shows the filtered products in the browse view
function renderProducts() {

    let productList = document.getElementById("productList");
    let filtered = getFilteredProducts();

    //the area where the filters will be displayed
    let currentFilters = document.getElementById("currentFilters");

    //clear old selection
    currentFilters.innerHTML = "";

    //clears any products that are being shown
    productList.innerHTML = "";

    //get the current values from the filter controls
    let searchText = document.getElementById("searchInput").value;
    let categoryValue = document.getElementById("categorySelect").value;
    let genderValue = document.getElementById("genderSelect").value;
    let colorValue = document.getElementById("colorSelect").value;

    //if there is search text, this shows it as a selected filter
    if (searchText !== "") {

        let filterBox = document.createElement("span");
        filterBox.className = "filter-box";
        filterBox.textContent = "Search: " + searchText;

        let removeButton = document.createElement("button");
        removeButton.textContent = "x";

        removeButton.addEventListener("click", function () {
            document.getElementById("searchInput").value = "";
            renderProducts();
        });

        filterBox.appendChild(removeButton);
        currentFilters.appendChild(filterBox);
    }

    //if a category is selected, show it as a selected filter
    if (categoryValue !== "all") {

        let filterBox = document.createElement("span");
        filterBox.className = "filter-box";
        filterBox.textContent = "Category: " + categoryValue;

        let removeButton = document.createElement("button");
        removeButton.textContent = "x";

        removeButton.addEventListener("click", function () {
            document.getElementById("categorySelect").value = "all";
            renderProducts();
        });

        filterBox.appendChild(removeButton);
        currentFilters.appendChild(filterBox);
    }

    //if a gender is selected then show it as a selected filter
    if (genderValue !== "all") {

        let filterBox = document.createElement("span");
        filterBox.className = "filter-box";
        filterBox.textContent = "Gender: " + genderValue;

        let removeButton = document.createElement("button");
        removeButton.textContent = "x";

        removeButton.addEventListener("click", function () {
            document.getElementById("genderSelect").value = "all";
            renderProducts();
        });

        filterBox.appendChild(removeButton);
        currentFilters.appendChild(filterBox);
    }

    //if a color is selected then show it as a selected filter
    if (colorValue !== "all") {

        let filterBox = document.createElement("span");
        filterBox.className = "filter-box";
        filterBox.textContent = "Color: " + colorValue;

        let removeButton = document.createElement("button");
        removeButton.textContent = "x";

        removeButton.addEventListener("click", function () {
            document.getElementById("colorSelect").value = "all";
            renderProducts();
        });

        filterBox.appendChild(removeButton);
        currentFilters.appendChild(filterBox);
    }

    //if no products match the filter, this shows the message
    if (filtered.length === 0) {
        productList.innerHTML = "<p>No products found.</p>";
        return;
    }

    //loops through all filtered products
    for (let i = 0; i < filtered.length; i++) {

        let product = filtered[i];

        //creates a card for one product
        let card = document.createElement("div");
        card.className = "product-card";

        //product name
        let name = document.createElement("h3");
        name.textContent = product.name;
        name.style.cursor = "pointer";

        name.addEventListener("click", function () {
            showSingleProduct(product.id);
        });

        //product image placeholder
        let imageBox = document.createElement("div");
        imageBox.className = "product-card-image";
        imageBox.textContent = "Product Image";
        imageBox.style.cursor = "pointer";

        imageBox.addEventListener("click", function () {
            showSingleProduct(product.id);
        });

        //product category
        let category = document.createElement("p");
        category.textContent = "Category: " + product.category;

        //product gender
        let gender = document.createElement("p");
        gender.textContent = "Gender: " + product.gender;

        //product color
        let color = document.createElement("p");
        color.textContent = "Color: " + product.color[0].name;

        //product price
        let price = document.createElement("p");
        price.textContent = "Price: $" + product.price;

        //button area for the product card
        let buttonArea = document.createElement("div");
        buttonArea.className = "product-card-actions";

        //button to open single product view
        let detailsButton = document.createElement("button");
        detailsButton.textContent = "View Details";

        detailsButton.addEventListener("click", function () {
            showSingleProduct(product.id);
        });

        //button to add product to cart from browse view
        let addButton = document.createElement("button");
        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", function () {
            addToCart(product, 1, "", "");
        });

        buttonArea.appendChild(detailsButton);
        buttonArea.appendChild(addButton);

        //adds all product info to the card
        card.appendChild(imageBox);
        card.appendChild(name);
        card.appendChild(category);
        card.appendChild(gender);
        card.appendChild(color);
        card.appendChild(price);
        card.appendChild(buttonArea);

        //adds the card to the product list
        productList.appendChild(card);
    }
}

//returns only the products that match the current filters
function getFilteredProducts() {

    let result = [];
    let searchText = document.getElementById("searchInput").value;
    let categoryValue = document.getElementById("categorySelect").value;
    let genderValue = document.getElementById("genderSelect").value;
    let colorValue = document.getElementById("colorSelect").value;
    let sortValue = document.getElementById("sortSelect").value;

    //checks every product in the products array
    for (let i = 0; i < products.length; i++) {

        let product = products[i];

        let matchesSearch = false;
        let matchesCategory = false;
        let matchesGender = false;
        let matchesColor = false;

        //checks if the search matches the products name
        if (searchText === "" || product.name === searchText) {
            matchesSearch = true;
        }

        //checks if the category matches or if all is selected
        if (categoryValue === "all" || product.category === categoryValue) {
            matchesCategory = true;
        }

        //checks if the gender matches or if all is selected
        if (genderValue === "all" || product.gender === genderValue) {
            matchesGender = true;
        }

        //checks if the color matches or if all is selected
        if (colorValue === "all") {
            matchesColor = true;
        }
        else {
            for (let j = 0; j < product.color.length; j++) {
                if (product.color[j].name === colorValue) {
                    matchesColor = true;
                }
            }
        }

        //adds if the product matches all current filters
        if (matchesSearch && matchesCategory && matchesGender && matchesColor) {
            result.push(product);
        }
    }

    //sorts the name alphabetically
    if (sortValue === "nameAsc") {

        result.sort(function (a, b) {

            if (a.name < b.name) {
                return -1;
            }

            if (a.name > b.name) {
                return 1;
            }

            return 0;
        });
    }

    //sorts by lowest price first
    else if (sortValue === "priceAsc") {
        result.sort(function (a, b) {
            return a.price - b.price;
        });
    }

    //sort by highest price first
    else if (sortValue === "priceDesc") {
        result.sort(function (a, b) {
            return b.price - a.price;
        });
    }

    return result;
}
//shows one selected product in the single product view
function showSingleProduct(productId) {
    let product = null;

    //finds the product with the matching id
    for (let i = 0; i < products.length; i++) {

        if (products[i].id === productId) {

            product = products[i];
        }
    }

    //if the product isnt found, stops the function
    if (product === null) {

        return;
    }

    //store the selected size and color for product
    let selectedSize = "";
    let selectedColor = "";

    let box = document.getElementById("singleProductContent");

    //clear old product details
    box.innerHTML = "";

    //breadcrumb of product pages
    let breadcrumb = document.createElement("p");
    breadcrumb.textContent = "Home > " + product.gender + " > " + product.category + " > " + product.name;

    //fixes the layout of the single product view
    let layout = document.createElement("div");
    layout.className = "single-product-layout";

    let leftColumn = document.createElement("div");
    leftColumn.className = "single-left";

    let rightColumn = document.createElement("div");
    rightColumn.className = "single-right";

    //main image placeholder
    let imageBox = document.createElement("div");
    imageBox.textContent = "Main Product Image";
    imageBox.className = "image-placeholder";

    //container for smaller image placeholders
    let smallImages = document.createElement("div");


    let smallImage1 = document.createElement("div");
    smallImage1.className = "small-image";
    smallImage1.textContent = "Image";


    let smallImage2 = document.createElement("div");
    smallImage2.className = "small-image";
    smallImage2.textContent = "Image";


    smallImages.appendChild(smallImage1);
    smallImages.appendChild(smallImage2);

    //product name
    let name = document.createElement("h2");
    name.textContent = product.name;

    //product price
    let price = document.createElement("p");
    price.textContent = "Price: $" + product.price;

    //product description
    let description = document.createElement("p");
    description.textContent = product.description;

    //product material
    let material = document.createElement("p");
    material.textContent = "Material: " + product.material;

    //quantity label
    let quantityLabel = document.createElement("label");
    quantityLabel.textContent = "Quantity: ";

    //quantity input box
    let quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.id = "quantityInput";
    quantityInput.value = "1";
    quantityInput.min = "1";

    //sizes heading
    let sizeTitle = document.createElement("p");
    sizeTitle.textContent = "Sizes:";

    //container for size buttons
    let sizeBox = document.createElement("div");

    //create one button for each available size
    for (let i = 0; i < product.sizes.length; i++) {

        let sizeButton = document.createElement("button");
        sizeButton.textContent = product.sizes[i];

        // when a size button is clicked, save the selected size
        sizeButton.addEventListener("click", function () {
            selectedSize = product.sizes[i];

            //get all size buttons inside the size section
            let allSizeButtons = sizeBox.getElementsByTagName("button");

            //remove the selected look from every size button
            for (let j = 0; j < allSizeButtons.length; j++) {
                allSizeButtons[j].style.backgroundColor = "";
                allSizeButtons[j].style.border = "";
            }

            //highlight the clicked size
            sizeButton.style.backgroundColor = "#cccccc";
            sizeButton.style.border = "2px solid #666666";
        });

        sizeBox.appendChild(sizeButton);
    }

    //colors heading
    let colorTitle = document.createElement("p");
    colorTitle.textContent = "Colors:";

    //container for color buttons
    let colorBox = document.createElement("div");

    //create one button for each color
    for (let i = 0; i < product.color.length; i++) {


        let colorButton = document.createElement("button");
        colorButton.textContent = product.color[i].name;


        //when a color button is clicked, save the selected color
        colorButton.addEventListener("click", function () {
            selectedColor = product.color[i].name;

            //get all color buttons inside the color section
            let allColorButtons = colorBox.getElementsByTagName("button");

            //remove the selected look from every color button
            for (let j = 0; j < allColorButtons.length; j++) {
                allColorButtons[j].style.backgroundColor = "";
                allColorButtons[j].style.border = "";
            }

            //highlight the clicked color
            colorButton.style.backgroundColor = "#cccccc";
            colorButton.style.border = "2px solid #666666";
        });

        colorBox.appendChild(colorButton);
    }

    //button to add product to cart
    let addButton = document.createElement("button");
    addButton.textContent = "Add to Cart";

    addButton.addEventListener("click", function () {

        //convert the quantity input into a number
        let quantity = quantityInput.value * 1;

        //if the quantity is less than 1, reset it to 1
        if (quantity < 1) {

            quantity = 1;
        }

        //add the product to cart with size and color
        addToCart(product, quantity, selectedSize, selectedColor);

        //show a simple confirmation message
        let message = document.createElement("p");
        message.textContent = "Item added to cart.";
        box.appendChild(message);

    });

    // add image content to the left column
    leftColumn.appendChild(imageBox);
    leftColumn.appendChild(smallImages);

    // add product details to the right column
    rightColumn.appendChild(name);
    rightColumn.appendChild(price);
    rightColumn.appendChild(description);
    rightColumn.appendChild(material);
    rightColumn.appendChild(quantityLabel);
    rightColumn.appendChild(quantityInput);
    rightColumn.appendChild(sizeTitle);
    rightColumn.appendChild(sizeBox);
    rightColumn.appendChild(colorTitle);
    rightColumn.appendChild(colorBox);
    rightColumn.appendChild(addButton);

    // add both columns to the layout
    layout.appendChild(leftColumn);
    layout.appendChild(rightColumn);

    // add breadcrumb and layout to the page
    box.appendChild(breadcrumb);
    box.appendChild(layout);

    //switch to the single product view
    showView("singleProductView");
}

//adds a product to the cart
function addToCart(product, quantity, size, color) {
    let found = false;

    //check is product with the same size and colour is already in cart
    for (let i = 0; i < cart.length; i++) {

        if (cart[i].id === product.id && cart[i].size === size && cart[i].color === color) {

            cart[i].quantity = cart[i].quantity + quantity;
            found = true;

        }
    }

    //if it isnt in cart add as new item
    if (found === false) {

        let item = {

            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            size: size,
            color: color
        };


        cart.push(item);
    }

    //updates the cart count
    updateCartCount();
}

//shows all items currently in the cart
function renderCart() {

    let cartContent = document.getElementById("cartContent");
    let cartSummary = document.getElementById("cartSummary");
    let checkoutBtn = document.getElementById("checkoutBtn");
    let shippingSelect = document.getElementById("shippingSelect");
    let destinationSelect = document.getElementById("destinationSelect");

    let merchandiseTotal = 0;

    //clear old cart content
    cartContent.innerHTML = "";
    cartSummary.innerHTML = "";
    document.getElementById("checkoutMessage").textContent = "";

    //if the cart is empty show an empty message and disables the cart options
    if (cart.length === 0) {

        cartContent.innerHTML = "<p>Your cart is empty.</p>";
        cartSummary.innerHTML = "<p>Total: $0</p>";

        document.getElementById("cartOptions").style.display = "none";
        checkoutBtn.style.display = "none";

        return;
    }

    //if the cart has items, enable the cart options
    document.getElementById("cartOptions").style.display = "flex";
    checkoutBtn.style.display = "inline-block";

    //loops through each cart item
    for (let i = 0; i < cart.length; i++) {

        let item = cart[i];

        let line = document.createElement("div");

        //cart image placeholder
        let imageBox = document.createElement("div");
        imageBox.className = "cart-image-placeholder";
        imageBox.textContent = "Image";

        //calculates the items subtotal
        let subtotal = item.price * item.quantity;
        merchandiseTotal = merchandiseTotal + subtotal;

        //shows items details
        let text = document.createElement("p");

        //same source as the cart decimals
        //couldnt find any other way to fix this, this is the source
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
        text.textContent = item.name + " | Color: " + item.color + " | Size: " + item.size + " | Price: $" + item.price.toFixed(2) + " | Quantity: " + item.quantity + " | Subtotal: $" + subtotal.toFixed(2);

        //remove button for cart
        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {

            let newCart = [];

            //rebuilds cart without the selected items
            for (let j = 0; j < cart.length; j++) {

                if (j !== i) {

                    newCart.push(cart[j]);
                }
            }

            cart = newCart;
            updateCartCount();
            renderCart();
        });

        // adds the remove button and item text to the cart item
        line.appendChild(removeButton);
        line.appendChild(imageBox);
        line.appendChild(text);
        cartContent.appendChild(line);
    }

    //shipping type and destination
    let shippingType = shippingSelect.value;
    let destination = destinationSelect.value;

    //calculates shipping cost
    let shippingCost = getShippingCost(merchandiseTotal, shippingType, destination);

    //calculates tax
    let tax = 0;

    //canada gets 5% tax
    if (destination === "Canada") {
        tax = merchandiseTotal * 0.05;
    }

    //calculates final total
    let total = merchandiseTotal + shippingCost + tax;

    //shows the summary details
    //i couldnt find a way to correctly format the decimal places and
    //this is the simplest fix i could find
    //this is the source
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    cartSummary.innerHTML =
        "<p>Merchandise: $" + merchandiseTotal + "</p>" +
        "<p>Shipping: $" + shippingCost + "</p>" +
        "<p>Tax: $" + tax.toFixed(2) + "</p>" +
        "<h3>Total: $" + total.toFixed(2) + "</h3>";
}

//return the shipping cost on orders value, type and destination
function getShippingCost(merchandiseTotal, shippingType, destination) {

    //free shipping over $500
    if (merchandiseTotal > 500) {
        return 0;
    }

    //shipping rules for canada
    if (destination === "Canada") {

        if (shippingType === "Standard") {

            return 10;
        }

        if (shippingType === "Express") {

            return 25;
        }

        if (shippingType === "Priority") {

            return 35;
        }
    }

    //rules for USA
    if (destination === "United States") {

        if (shippingType === "Standard") {

            return 15;
        }

        if (shippingType === "Express") {

            return 25;
        }

        if (shippingType === "Priority") {

            return 50;
        }

    }

    //rules for everywhere else
    if (destination === "International") {

        if (shippingType === "Standard") {

            return 20;
        }

        if (shippingType === "Express") {

            return 30;
        }

        if (shippingType === "Priority") {

            return 50;
        }

    }

    //default
    return 0;
}

//sets up cart controls
function setupCartOptions() {

    //when shipping changes renders the cart totals
    document.getElementById("shippingSelect").addEventListener("change", function () {

        renderCart();

    });


    //when destination changes render the cart totals
    document.getElementById("destinationSelect").addEventListener("change", function () {

        renderCart();

    });

    //checkout button clicked
    document.getElementById("checkoutBtn").addEventListener("click", function () {

        if (cart.length === 0) {
            return;
        }

        cart = [];
        updateCartCount();
        renderCart();

        let homeMessage = document.getElementById("homeCheckoutMessage");
        homeMessage.style.display = "block";

        showView("homeView");
    });
}

//updates the cart count shown beside the cart link
function updateCartCount() {

    let totalItems = 0;

    //adds up the quanitity of all cart items
    for (let i = 0; i < cart.length; i++) {

        totalItems = totalItems + cart[i].quantity;

    }

    //shows the total item count in the header
    document.getElementById("cartCount").textContent = totalItems;
}