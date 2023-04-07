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

    const elements = stripe.elements(options);

    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");

    const form = document.getElementById("payment-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:4000/success",
        },
      });

      if (error) {
        const messageContainer = document.querySelector("#error-message");
        messageContainer.textContent = error.message;
      }
    });
  } catch (error) {
    console.log(error);
  }
};
