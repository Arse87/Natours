import axios from "axios";
import { showAlert, hideAlert } from "./alerts";

const stripe = Stripe("pk_test_34ngqoS9WHUsGIJmmbJ2WFdI00EvOHpVTv");

export const getCheckout = async tourId => {
  try {
    const res = await axios(`/api/v1/bookings/session-checkout/${tourId}`);
    await stripe.redirectToCheckout({
      sessionId: res.data.session.id
    });
  } catch (err) {
    showAlert("error", "Problemi con il sistema, lascia perdere");
    window.setTimeout(hideAlert, 3500);
  }
};
