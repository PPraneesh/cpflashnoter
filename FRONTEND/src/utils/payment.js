import { api } from "../api/axios";
const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY_ID;
const server_url = import.meta.env.VITE_SERVER_URL;

const PAYMENT_AMOUNT = 50;

export default async function paymentHandler(
  paymentData,
  price,
  navigate,
  context
) {
  try {
    if (price != PAYMENT_AMOUNT) {
      throw new Error("Invalid payment amount");
    }
    await api
      .post(
        `${server_url}/payment`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          // for register route, which saves data in database
          var razorpayOptions = {
            key: razorpay_key,
            amount: price * 100,
            currency: "INR",
            name: "CPFLASHNOTER",
            description: "cpflashnoter premium",
            image:
              "https://upload.wikimedia.org/wikipedia/en/4/47/VNRVJIETLogo.png",
            order_id: res.data.order_id,
            prefill: {
              name: paymentData.payersContact.name,
              email: paymentData.payersContact.email,
              contact: paymentData.payersContact.mobileNumber,
            },
            handler: async function (response) {
              try {
                api
                  .post(
                    `${server_url}/success`,
                    {
                      response: response,
                      category: res.data.category,
                      order_id: response.razorpay_order_id,
                      payment_id: response.razorpay_payment_id,
                      payment_signature: response.razorpay_signature,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then((res) => {
                    if (res.data.status) {
                      navigate("/success", {
                        state: { data: response, success: true },
                      });
                    } else {
                      navigate("/failure", {
                        state: {
                          error:
                            "Error in backend, please contact support for further assistance",
                        },
                      });
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                    navigate("/failure", {
                      state: { error: "Payment confirmation failed" },
                    });
                  });
              } catch (err) {
                console.error(err);
              } finally {
                context.setLoading(false);
              }
            },
            notes: {
              name: paymentData.payersContact.name,
              email: paymentData.payersContact.email,
              category: res.data.category,
              address: "VNR VJIET, Bachupally",
            },
            theme: {
              color: "#3399cc",
            },
          };

          // eslint-disable-next-line no-undef
          var rzp1 = new Razorpay(razorpayOptions);

          rzp1.on("payment.failed", function (response) {
            navigate("/failure", {
              state: {
                error: response.error.description || "Payment failed",
                reason: response.error.reason || "Unknown",
              },
            });
          });
          rzp1.open();
        } else {
          alert("here's the error", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
}
