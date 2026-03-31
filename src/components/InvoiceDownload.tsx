import { useState } from 'react';
import axios from 'axios';

interface Props {
  paymentId: string;
  invoiceNumber: string;
  amount: number;
  movieTitle: string;
  date: string;
}

const InvoiceDownload = ({ paymentId, invoiceNumber, amount, movieTitle, date }: Props) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/invoice/download/${paymentId}`,
        { responseType: 'blob' }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert('📄 Invoice downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      alert('❌ Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
        downloading
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      {downloading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <span>📄</span>
          <span>Download Invoice</span>
        </>
      )}
    </button>
  );
};

export default InvoiceDownload;