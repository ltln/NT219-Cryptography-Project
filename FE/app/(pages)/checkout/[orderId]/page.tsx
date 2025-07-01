"use client"

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import httpClient from "@/app/lib/httpClient";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from '@/app/lib/stripe';
import CheckoutForm from "@/app/components/CheckoutForm";
import { PaymentIntent } from "@/app/types/paymentIntent";
import { StoreContext } from "@/app/context";

export default function CheckoutPage() {
    const { cartData, setCartData } = useContext(StoreContext);
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { orderId } = useParams<{ orderId: string }>();
    async function fetchStripeClientSecret() {
        try {
            const paymentIntentData = await httpClient.get<PaymentIntent>(`/order/intent/${orderId}`);
            setPaymentIntent(paymentIntentData);
            setLoading(false);
            console.log("Stripe data:", paymentIntentData);
        } catch (error) {
            console.error("Failed to fetch Stripe client secret:", error);
            setError("Failed to fetch payment details. Please try again later.");
        }
    }

    useEffect(() => {
        document.title = "Thanh toán";
        if (!user) {
            setLoading(false);
            return;
        }

        fetchStripeClientSecret();
    }, [orderId, user])

    if (loading) return <div>Loading...</div>;
    if (!user) return <p>Please log in to proceed with payment.</p>;
    if (error) return <p>Error: {error}</p>;
    if (!paymentIntent) return <p>No payment details available.</p>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret: paymentIntent.clientSecret }}>
            <CheckoutForm paymentIntent={paymentIntent} cart={cartData} setCart={setCartData} />
        </Elements>
    );
}