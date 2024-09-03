import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const ServicerSubscriptionStatusComponent = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isPaymentCanceled = queryParams.get("canceled") === "true";
  const isSuccess = queryParams.get("success") === "true";
  const amount = queryParams.get("amount");
  const currency = queryParams.get("currency");
  useEffect(() => {
    if (isPaymentCanceled) {
      console.log("Payment canceled");
    } else if (isSuccess) {
      console.log("Payment successful");
      console.log("Amount:", amount);
      console.log("Currency:", currency);
    } else {
      console.log("Unexpected order status");
    }
  }, [isPaymentCanceled, isSuccess, amount, currency]);
  return (
    <>
    <div className="text-center">
      {isPaymentCanceled && (
        <div className="flex flex-col items-center justify-center h-screen">
          <img
            src="https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif"
            alt="Payment Canceled GIF"
            className="w-64 h-60"
          />
          <h2 className="text-2xl font-semibold text-red-500 font-serif">
            Payment Canceled
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            Your payment was not completed. Please try again or contact support if you need help.
          </p>
          <Link
            to="/homepage"
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Go to Home
          </Link>
          
        </div>
      )}

      {isSuccess && (
        <div className="flex flex-col items-center justify-center h-screen">
          <img
            src="https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif"
            alt="Payment Success GIF"
            className="w-64 h-60"
          />
          <h2 className="text-2xl font-semibold text-blue-300 font-serif">
            Payment Successfully Completed
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            Thank you for your payment! Your subscription has been activated.
          </p>
          <Link
            to="/homepage"
            className="mt-4 bg-customColorA text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </Link>
        </div>
      )}

      {!isPaymentCanceled && !isSuccess && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-semibold text-gray-700">
            Payment Status Unknown
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            We could not determine the status of your payment. Please contact support if you need assistance.
          </p>
          <Link
            to="/homepage"
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Go to Home
          </Link>
        </div>
      )}
    </div>
    </>
  )
}

export default ServicerSubscriptionStatusComponent