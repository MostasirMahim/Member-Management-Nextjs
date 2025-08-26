"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Printer, CreditCard } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

interface PaymentData {
  id: number;
  invoice: string;
  member: string;
  payment_method: string;
  processed_by: string;
  transaction: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  payment_amount: string;
  payment_status: string;
  payment_date: string;
  payment_gateway: string;
  notes: string;
}

interface PaymentReceiptProps {
  data: PaymentData;
}

export function PaymentReceipt({ data }: PaymentReceiptProps) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: {
      [key: string]: { className: string; label: string };
    } = {
      paid: {
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
        label: "Paid",
      },
      full_paid: {
        className:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        label: "Fully Paid",
      },
      partial_paid: {
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        label: "Partial Paid",
      },
      pending: {
        className:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        label: "Pending",
      },
      failed: {
        className:
          "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        label: "Failed",
      },
      refunded: {
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        label: "Refunded",
      },
    };

    const config = statusConfig[status.toLowerCase()] || {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800",
      label: status.charAt(0).toUpperCase() + status.slice(1),
    };

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig: {
      [key: string]: { className: string; label: string };
    } = {
      cash: {
        className:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        label: "Cash",
      },
      card: {
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        label: "Card",
      },
      bank_transfer: {
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
        label: "Bank Transfer",
      },
      digital_wallet: {
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        label: "Digital Wallet",
      },
      cheque: {
        className:
          "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800",
        label: "Cheque",
      },
    };

    const config = methodConfig[method.toLowerCase()] || {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800",
      label: method.charAt(0).toUpperCase() + method.slice(1),
    };

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pageHeight;
      }

      pdf.save(`Payment-${data.id}-Receipt.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("There was an error generating the PDF. Please try again.");
    }
  };

  return (
    <div
      ref={pdfRef}
      className="min-h-screen  p-4 md:p-8 flex justify-center items-start"
    >
      <Card className="w-full max-w-2xl shadow-lg border-teal-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm print:shadow-none print:border-0 print:bg-white">
        {/* Header */}
        <CardHeader className="pb-4 border-b border-teal-200 dark:border-gray-700 print:border-b-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                <CreditCard className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                  Payment Receipt
                </h1>
                <p className="text-sm text-teal-600 dark:text-teal-300">
                  Payment Confirmation
                </p>
              </div>
            </div>
            <div className="text-right">
              <CardTitle className="text-xl text-teal-900 dark:text-teal-100">
                PAY-{data.id.toString().padStart(6, "0")}
              </CardTitle>
              <p className="text-xs text-teal-600 dark:text-teal-300">
                {formatDate(data.payment_date)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Payment Details */}
            <div className="space-y-4 p-4 rounded-lg bg-teal-50/50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50">
              <div>
                <h3 className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">
                  Invoice Number
                </h3>
                <p className="text-lg font-semibold text-teal-900 dark:text-teal-100">
                  {data.invoice}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">
                  Member
                </h3>
                <p className="text-lg font-semibold text-teal-900 dark:text-teal-100">
                  {data.member}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">
                  Processed By
                </h3>
                <p className="text-sm text-teal-900 dark:text-teal-100">
                  {data.processed_by}
                </p>
              </div>
            </div>

            {/* Right Column - Status & Payment */}
            <div className="space-y-4 p-4 rounded-lg bg-cyan-50/50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/50">
              <div>
                <h3 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                  Payment Status
                </h3>
                <div className="text-lg">
                  {getStatusBadge(data.payment_status)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                  Payment Method
                </h3>
                <div className="text-lg">
                  {getPaymentMethodBadge(data.payment_method)}
                </div>
              </div>

              {data.payment_gateway && (
                <div>
                  <h3 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-1">
                    Payment Gateway
                  </h3>
                  <p className="text-sm text-cyan-900 dark:text-cyan-100">
                    {data.payment_gateway}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6 bg-teal-200 dark:bg-gray-700" />

          {/* Amount Summary - Changed color to indigo */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800/50">
              <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                Payment Amount
              </h3>
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-indigo-100">
                  {formatCurrency(data.payment_amount)}
                </span>
                <span className="text-lg text-indigo-600 dark:text-indigo-300">
                  USD
                </span>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-300 mt-2">
                {data.payment_status === "paid" ||
                data.payment_status === "full_paid"
                  ? "Payment successfully processed"
                  : data.payment_status === "partial_paid"
                  ? "Partial payment processed"
                  : "Payment processing"}
              </p>
            </div>
          </div>

          {/* Transaction Reference */}
          <div className="mb-6 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Transaction Reference
            </h3>
            <div className="flex items-center ">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Transaction :{" "}
                <span className="font-mono text-sm text-blue-900 dark:text-blue-100">
                  {formatCurrency(data.transaction)}
                </span>
              </span>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment ID:
                  </span>
                  <p className="font-mono text-gray-800 dark:text-gray-200">
                    PAY-{data.id.toString().padStart(6, "0")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Created:
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {formatDate(data.created_at)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Last Updated:
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {formatDate(data.updated_at)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Active:
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {data.is_active ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {data.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">
                    Notes:
                  </span>
                  <p className="text-gray-800 dark:text-gray-200 mt-1">
                    {data.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6 bg-teal-200 dark:bg-gray-700" />

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-teal-600 dark:text-teal-400 mb-2">
              This is an official payment receipt. Please keep it for your
              records.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Generated on {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* Action Buttons */}
          <Separator className="my-6 bg-teal-200 dark:bg-gray-700" />
          <div className="flex justify-center gap-4 pt-4 print:hidden">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="gap-1 bg-white dark:bg-gray-700 border-teal-200 dark:border-gray-600"
            >
              <FileText className="h-4 w-4" />
              Save PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-white dark:bg-gray-700 border-teal-200 dark:border-gray-600"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
