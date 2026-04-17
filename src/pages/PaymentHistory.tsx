import { useEffect, useState } from 'react';
import axios from 'axios';
import InvoiceDownload from '../components/InvoiceDownload';

interface Payment {
  _id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  status: string;
  movieTitle: string;
  createdAt: string;
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('https://moviehub-backend-5.onrender.com/api/payment/all-payments');
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">💳 Payment History</h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No payments yet</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-gray-300">Invoice</th>
                <th className="px-6 py-4 text-left text-gray-300">Movie</th>
                <th className="px-6 py-4 text-left text-gray-300">Amount</th>
                <th className="px-6 py-4 text-left text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-gray-300">Date</th>
                <th className="px-6 py-4 text-left text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                    INV-{payment.orderId.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-white">{payment.movieTitle || 'N/A'}</td>
                  <td className="px-6 py-4 text-green-400 font-bold">₹{payment.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      payment.status === 'completed' ? 'bg-green-600' :
                      payment.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {payment.status === 'completed' ? (
                      <InvoiceDownload
                        paymentId={payment._id}
                        invoiceNumber={`INV-${payment.orderId.slice(-8).toUpperCase()}`}
                        amount={payment.amount}
                        movieTitle={payment.movieTitle || 'Movie'}
                        date={payment.createdAt}
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">Not Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;