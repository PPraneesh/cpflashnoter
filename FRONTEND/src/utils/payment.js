import { api } from "../api/axios";
const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY_ID;


export default async function paymentHandlerOneTime(
  paymentData,
  navigate,
) {
  try {
    await api
      .get(`/payment`)
      .then((res) => {
        if (res.data.status) {
          // for register route, which saves data in database
          var   razorpayOptions = {
            key: razorpay_key,
            amount: 59 * 100,
            currency: "INR",
            name: "CPNOTER",
            description: "cpnoter premium",
            image:
              "/logo.png",
            order_id: res.data.order_id,
            prefill: {
              email: paymentData.email
            },
            handler: async function (response) {
              try {
                api
                  .post(
                    `/success`,
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
                        state: { data: response, success: true, order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id },
                      });
                    } else {
                      navigate("/failure", {
                        state: {
                          error:
                            "Error in backend, please contact support for further assistance",
                            order_id : response.razorpay_order_id,
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
                // context.setLoading(false);
              }
            },
            notes: {
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
