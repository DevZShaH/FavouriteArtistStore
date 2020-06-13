//-------NOTE: document.get... or document.queryselector... always return the DOM elements in the form of array-------------------------------------------------------
//First check if the page has been loaded or not
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    let removeCartItemBtns = document.getElementsByClassName("btn-danger"); //selects in the form of array
    // console.log(removeCartItemBtns);
    for (let i = 0; i < removeCartItemBtns.length; i++) {
        let btn = removeCartItemBtns[i];
        btn.addEventListener("click", removeCartItem);
    }

    let quantityInputs = document.getElementsByClassName("cart-quantity-input");
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    let addToCartButtons = document.getElementsByClassName("shop-item-button");
    for (let i = 0; i < addToCartButtons.length; i++) {
        let btn = addToCartButtons[i];
        btn.addEventListener("click", addToCartClicked);
    }

    document
        .getElementsByClassName("btn-purchase")[0]
        .addEventListener("click", purchaseClicked);
}

function removeCartItem(event) {
    // console.log("clicked")
    let btnClicked = event.target;
    btnClicked.parentElement.parentElement.remove(); // should remove item from the cart entirely with its parent div
    updateCartTotal();
}

function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function addToCartClicked(event) {
    let btn = event.target;
    let shopItem = btn.parentElement.parentElement; //Moving up towards parent element to refer that shop item element
    let shopItemTitle = shopItem.getElementsByClassName("shop-item-title")[0]
        .innerText; // get the title text of that item
    let shopItemPrice = shopItem.getElementsByClassName("shop-item-price")[0]
        .innerText;
    let shopItemImageSrc = shopItem.getElementsByClassName("shop-item-image")[0]
        .src;
    // console.log(shopItemTitle, shopItemPrice, shopItemImageSrc);
    let id = shopItem.dataset.itemId; //NOTE: itemId in js implies 'data-item-id' in html.
    addItemToCart(shopItemTitle, shopItemPrice, shopItemImageSrc, id);
    updateCartTotal();
}

//STRIPE HANDLER

let stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: "auto",
    token: function(token) {
        // console.log(token);
        let items = [];
        let cartItemContainer = document.getElementsByClassName("cart-items")[0];
        let cartRows = cartItemContainer.getElementsByClassName("cart-row");
        for (let i = 0; i < cartRows.length; i++) {
            let cartRow = cartRows[i];
            let quantityElement = cartRow.getElementsByClassName(
                "cart-quantity-input"
            )[0];
            let quantity = quantityElement.value;
            // console.log(quantity);
            let id = cartRow.dataset.itemId;
            items.push({
                id: id,
                quantity: quantity,
            });
        }
        fetch("/purchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    stripeTokenId: token.id,
                    items: items,
                }),
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                alert(data.message);
                let cartItems = document.getElementsByClassName("cart-items")[0]; // after clicking purchase item clear the cart items
                while (cartItems.hasChildNodes()) {
                    // remove cart items utill every node is deleted
                    cartItems.removeChild(cartItems.firstChild);
                }
                updateCartTotal();
            })
            .catch((error) => {
                console.log(error);
            });
    },
});

function purchaseClicked() {
    // alert("Thank you for your purchase!");

    //STRIPE HANDLER
    let priceElement = document.getElementsByClassName("cart-total-price")[0];
    let price = parseFloat(priceElement.innerText.replace("$", "") * 100);
    if (price <= 0) {
        alert("Please, add some item to the cart..");
    } else {
        stripeHandler.open({
            amount: price,
        });
    }
}

function addItemToCart(shopItemTitle, shopItemPrice, shopItemImageSrc, id) {
    let cartRow = document.createElement("div"); // creating a div element for cart row to be appended
    cartRow.classList.add("cart-row"); // row styling after adding item must be same as cart-row
    cartRow.dataset.itemId = id; //to set id on cart item
    let cartItems = document.getElementsByClassName("cart-items")[0]; //refer to cart items div as array
    let cartItemNames = cartItems.getElementsByClassName("cart-item-title");
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == shopItemTitle) {
            alert("This item is already in the cart!");
            return;
        }
    }

    let cartRowContents = `<div class="cart-item cart-column">
                    <img src="${shopItemImageSrc}" class="cart-item-image" width="100" height="100">
                    <span class="cart-item-title">${shopItemTitle}</span>
                    <!-- &lt;&gt; -->
                </div>
                <span class="cart-price cart-column">${shopItemPrice}</span>
                <!-- &lt;&gt; -->
                <div class="cart-quantity cart-column">
                    <input type="number" value="1" class="cart-quantity-input">
                    <button role="button" class="btn btn-danger cart-quantity-button">REMOVE</button>
                </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow
        .getElementsByClassName("btn-danger")[0]
        .addEventListener("click", removeCartItem);
    cartRow
        .getElementsByClassName("cart-quantity-input")[0]
        .addEventListener("change", quantityChanged);
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName("cart-items")[0]; //refer to the cart container DOM that selects as an array but we've only one container so we used index as [0]
    let cartRows = cartItemContainer.getElementsByClassName("cart-row"); // selects each row from cart container in the form of array
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
        //going through each element in the cartRows array
        let eachCartRow = cartRows[i];
        let priceElement = eachCartRow.getElementsByClassName("cart-price")[0]; // refer to each cart row price element in form of array as we've only one cart row price in each row so we take as index [0]
        let quantityElement = eachCartRow.getElementsByClassName(
            "cart-quantity-input"
        )[0]; //similarly as priceElement
        let itemPrice = parseFloat(priceElement.innerText.replace("$", "")); //returns a price in float
        let quantity = quantityElement.value; // returns input value as quantity from quantityElement
        total += itemPrice * quantity;
    }
    total = Math.round(total * 100) / 100; // rounds upto two decimal places incase of multiple decimal places
    document.getElementsByClassName(
        "cart-total-price"
    )[0].innerText = `$${total}`;
}