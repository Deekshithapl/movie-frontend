import { useState } from 'react';
import axios from 'axios';

interface Props {
  amount: number;
  movieId: string;
  movieTitle: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentButton = ({ amount, movieId, movieTitle, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Step 1: Create Order
      console.log('Creating order...');
      const orderResponse = await axios.post('https://moviehub-backend-5.onrender.com/api/payment/create-order', {
        amount,
        movieId,
        movieTitle,
        userId: 'guest_user_' + Date.now(),
      });

      console.log('Order response:', orderResponse.data);

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { order } = orderResponse.data;

      // Step 2: Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id_here',
        amount: order.amount,
        currency: order.currency,
        name: 'MovieHub',
        description: `Purchase: ${movieTitle}`,
        order_id: order.id,
        handler: async (response: any) => {
          console.log('Payment response:', response);
          
          // Step 3: Verify Payment
          try {
            const verifyResponse = await axios.post(
              'https://moviehub-backend-5.onrender.com/api/payment/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            console.log('Verification response:', verifyResponse.data);

            if (verifyResponse.data.success) {
              alert('🎉 Payment Successful!');
              if (onSuccess) onSuccess();
            } else {
              alert('❌ Payment Verification Failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('❌ Payment Verification Failed');
          }
        },
        prefill: {
          name: 'Guest User',
          email: 'guest@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setLoading(false);
          },
        },
      };

      // Step 4: Open Razorpay Checkout
      console.log('Opening Razorpay...');
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        alert('❌ Payment Failed: ' + response.error.description);
        setLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('❌ ' + (error.response?.data?.message || error.message || 'Payment failed'));
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center space-x-2 transition-all ${
        loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
      }`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>💳</span>
          <span>Pay ₹{amount}</span>
        </>
      )}
    </button>
  );
};

export default PaymentButton;