
      // Replace with your own publishable key: https://dashboard.stripe.com/test/apikeys
      var PUBLISHABLE_KEY = "pk_test_QMefApR6KAUjVqk5Zviqrmd000zFUEjhyI";
      // Replace with the domain you want your users to be redirected back to after payment
      var DOMAIN = window.location.origin;
      // Replace with a Price for your own product (created either in the Stripe Dashboard or with the API)
      // You can also supply a SKU or Plan ID for 
      var PRICE_ID = "price_HNU0VbOSa64JsI";

      if (PUBLISHABLE_KEY === "pk_1234") {
        console.log(
          "Replace the hardcoded publishable key with your own publishable key: https://dashboard.stripe.com/test/apikeys"
        );
      }

      if (PRICE_ID === "price_1234") {
        console.log(
          "Replace the hardcoded SKU ID with your own SKU: https://stripe.com/docs/api/skus"
        );
      }

      var MIN_SHIRTS = 1;
      var MAX_SHIRTS = 10;

      var stripe = Stripe(PUBLISHABLE_KEY);

      var basicshirtButton = document.getElementById("basic-shirt-button");
      document
        .getElementById("quantity-input")
        .addEventListener("change", function(evt) {
          // Ensure customers only buy between 1 and 10 SHIRTS
          if (evt.target.value < MIN_SHIRTS) {
            evt.target.value = MIN_SHIRTS;
          }
          if (evt.target.value > MAX_SHIRTS) {
            evt.target.value = MAX_SHIRTS;
          }
        });

      var updateQuantity = function(evt) {
        if (evt && evt.type === "keypress" && evt.keyCode !== 13) {
          return;
        }

        var isAdding = evt.target.id === "add";
        var inputEl = document.getElementById("quantity-input");
        var currentQuantity = parseInt(inputEl.value);

        document.getElementById("add").disabled = false;
        document.getElementById("subtract").disabled = false;

        var quantity = isAdding ? currentQuantity + 1 : currentQuantity - 1;

        inputEl.value = quantity;
        document.getElementById("total").textContent = quantity * 2020;

        // Disable the button if the customers hits the max or min
        if (quantity === MIN_SHIRTS) {
          document.getElementById("subtract").disabled = true;
        }
        if (quantity === MAX_SHIRTS) {
          document.getElementById("add").disabled = true;
        }
      };

      Array.from(document.getElementsByClassName("increment-btn")).forEach(
        element => {
          element.addEventListener("click", updateQuantity);
        }
      );

      // Handle any errors from Checkout
      var handleResult = function(result) {
        if (result.error) {
          var displayError = document.getElementById("error-message");
          displayError.textContent = result.error.message;
        }
      };

      basicshirtButton.addEventListener("click", function() {
        var quantity = parseInt(
          document.getElementById("quantity-input").value
        );

        // Make the call to Stripe.js to redirect to the checkout page
        // with the current quantity
        stripe
          .redirectToCheckout({
            mode: 'payment',
            lineItems: [{ price: PRICE_ID, quantity: quantity }],
            successUrl:
              DOMAIN + "/success.html?session_id={CHECKOUT_SESSION_ID}",
            cancelUrl: DOMAIN + "/canceled.html"
          })
          .then(handleResult);
      });
    