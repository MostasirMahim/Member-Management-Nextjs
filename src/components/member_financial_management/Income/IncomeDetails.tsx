"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Printer, DollarSign, TrendingUp } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

interface IncomeData {
  id: number;
  particular: string;
  received_from_type: string;
  receiving_type: string;
  member: string;
  received_by: string;
  sale: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  date: string;
  receivable_amount: string;
  discount_name: string;
  discounted_amount: string;
  final_receivable: string;
  actual_received: string;
  reaming_due: string;
  due_payable_last_date: string | null;
}

interface IncomeReceiptProps {
  data: IncomeData;
}

export function IncomeReceipt({ data }: IncomeReceiptProps) {
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

  const getReceivingTypeBadge = (type: string) => {
    const typeConfig: { [key: string]: { className: string; label: string } } =
      {
        full: {
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
          label: "Full Payment",
        },
        partial: {
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
          label: "Partial Payment",
        },
        advance: {
          className:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          label: "Advance Payment",
        },
      };

    const config = typeConfig[type.toLowerCase()] || {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800",
      label: type.charAt(0).toUpperCase() + type.slice(1),
    };

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getReceivedByBadge = (method: string) => {
    const methodConfig: {
      [key: string]: { className: string; label: string };
    } = {
      cash: {
        className:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        label: "Cash",
      },
      card: {
        className:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        label: "Card",
      },
      bank_transfer: {
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
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

      pdf.save(`Income-${data.id}-Receipt.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("There was an error generating the PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const isFullyPaid = parseFloat(data.reaming_due) === 0;
  const hasDiscount = parseFloat(data.discounted_amount) > 0;

  return (
    <div
      ref={pdfRef}
      className="min-h-screen   p-4 md:p-8 flex justify-center items-start"
    >
      <Card className="w-full max-w-2xl shadow-lg border-green-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm print:shadow-none print:border-0 print:bg-white">
        {/* Header */}
        <CardHeader className="pb-4 border-b border-green-200 dark:border-gray-700 print:border-b-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-900 dark:text-green-100">
                  Income Receipt
                </h1>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Club Revenue Record
                </p>
              </div>
            </div>
            <div className="text-right">
              <CardTitle className="text-xl text-green-900 dark:text-green-100">
                INC-{data.id.toString().padStart(6, "0")}
              </CardTitle>
              <p className="text-xs text-green-600 dark:text-green-300">
                {formatDate(data.date)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Income Details */}
            <div className="space-y-4 p-4 rounded-lg bg-green-50/50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
              <div>
                <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                  Particular
                </h3>
                <p className="text-lg font-semibold text-green-900 dark:text-green-100 capitalize">
                  {data.particular}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                  Received From
                </h3>
                <p className="text-lg font-semibold text-green-900 dark:text-green-100 capitalize">
                  {data.received_from_type}: {data.member}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                  Sale Reference
                </h3>
                <p className="text-sm font-bold text-green-900 dark:text-green-100 font-mono">
                  {data.sale}
                </p>
              </div>
            </div>

            {/* Right Column - Payment Details */}
            <div className="space-y-4 p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
              <div>
                <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                  Receiving Type
                </h3>
                <div className="text-lg">
                  {getReceivingTypeBadge(data.receiving_type)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                  Received By
                </h3>
                <div className="text-lg">
                  {getReceivedByBadge(data.received_by)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                  Transaction Date
                </h3>
                <p className="text-sm text-emerald-900 dark:text-emerald-100">
                  {formatDate(data.date)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-green-200 dark:bg-gray-700" />

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                Amount Breakdown
              </h3>

              <div className="flex justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-300">
                  Receivable Amount:
                </span>
                <span className="font-mono text-blue-900 dark:text-blue-100">
                  {formatCurrency(data.receivable_amount)}
                </span>
              </div>

              {hasDiscount && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700 dark:text-blue-300">
                    Discount ({data.discount_name}):
                  </span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    -{formatCurrency(data.discounted_amount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm pt-2 border-t border-blue-200 dark:border-blue-700/50">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Final Receivable:
                </span>
                <span className="font-mono font-semibold text-blue-900 dark:text-blue-100">
                  {formatCurrency(data.final_receivable)}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                Payment Summary
              </h3>

              <div className="flex justify-between text-sm">
                <span className="text-amber-700 dark:text-amber-300">
                  Actual Received:
                </span>
                <span className="font-mono text-green-600 dark:text-green-400 font-semibold">
                  {formatCurrency(data.actual_received)}
                </span>
              </div>

              {!isFullyPaid && (
                <div className="flex justify-between text-sm">
                  <span className="text-amber-700 dark:text-amber-300">
                    Remaining Due:
                  </span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    {formatCurrency(data.reaming_due)}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-amber-200 dark:border-amber-700/50">
                <p
                  className={`text-xs font-medium ${
                    isFullyPaid
                      ? "text-green-600 dark:text-green-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isFullyPaid
                    ? "✅ Fully Paid - Thank you!"
                    : "⚠️ Partial Payment Received"}
                </p>
                {data.due_payable_last_date && !isFullyPaid && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Due by: {formatDate(data.due_payable_last_date)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-green-200 dark:bg-gray-700" />

          {/* Main Amount Highlight - Changed to green for income */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/50">
              <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                Total Income Received
              </h3>
              <div className="flex justify-center items-baseline gap-2">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(data.actual_received)}
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-300 mt-2">
                {isFullyPaid
                  ? "Full amount received successfully"
                  : "Partial amount received"}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Income ID:
                  </span>
                  <p className="font-mono text-gray-800 dark:text-gray-200">
                    INC-{data.id.toString().padStart(6, "0")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Recorded:
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
                    Active Record:
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {data.is_active ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-green-200 dark:bg-gray-700" />

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-green-600 dark:text-green-400 mb-2">
              This is an official income receipt for club records. Please keep
              it for accounting purposes.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Generated on {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* Action Buttons */}
          <Separator className="my-6 bg-green-200 dark:bg-gray-700" />
          <div className="flex justify-center gap-4 pt-4 print:hidden">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-white dark:bg-gray-700 border-green-200 dark:border-gray-600"
              onClick={handleDownloadPDF}
            >
              <FileText className="h-4 w-4" />
              Save PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-white dark:bg-gray-700 border-green-200 dark:border-gray-600"
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
