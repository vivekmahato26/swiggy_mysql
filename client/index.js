const stripe = Stripe(
  "pk_test_51MtlEoSFZSziLAgQexyBWacrLD8I132royGeFKRVmSLBbsQZ7rdxHEAR4IsfvJxOdIa9vmhqZ83v5RtBC6Ob97GB00KcwCmCLu"
);

const createPayment = async () => {
  try {
    const fetchIntent = await fetch(
      "http://localhost:4000/payment/paymentIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 120000,
        }),
      }
    );
    const paymentIntent = await fetchIntent.json();
    var { client_secret } = paymentIntent;
    const options = {
      clientSecret: client_secret,
    };

    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 3
    const elements = stripe.elements(options);

    // Create and mount the Payment Element
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");

    const form = document.getElementById("payment-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "http://loclhost:4000/success",
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        const messageContainer = document.querySelector("#error-message");
        messageContainer.textContent = error.message;
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    });
  } catch (error) {
    console.log(error);
  }
};