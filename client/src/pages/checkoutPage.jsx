import React, { useEffect, useState } from "react";
import { defineCustomElements } from "stripe-stenciljs/dist/loader";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const navigate = useNavigate();
  useEffect(() => {
    defineCustomElements(window);
  }, []);
  useEffect(() => {
    const btnClick = (event) => {
      const button = event.target.closest("button");
      if (button) {
        setTimeout(() => {
          navigate("/");
          window.location.reload(true);
        }, 3000);
      }
    };
    document.addEventListener("click", btnClick);
    return () => {
      document.removeEventListener("click", btnClick);
    };
  }, [navigate]);

  return <stripe-component />;
}

export default CheckoutPage;
