// src/components/CheckoutForm.jsx
import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { createPaymentIntent } from "../utils/API";


function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        try {
            // Make a POST request to create a PaymentIntent
            const response = await createPaymentIntent();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const { clientSecret } = await response.json();

            // Confirm the card payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (error) {
                console.error(error);
                alert(`Payment failed: ${error.message}`);
                setLoading(false);
            } else if (paymentIntent.status === 'succeeded') {
                console.log('Payment successful!');
                alert('Payment successful!');
                setLoading(false);
            }
        } catch (error) {
            console.log('Payment error:', error);
            alert('Payment error occurred.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement className="StripeElement" />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing…' : 'Pay'}
            </button>
        </form>
    );
}

export default CheckoutForm;
