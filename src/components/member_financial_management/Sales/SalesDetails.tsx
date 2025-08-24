"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";

interface SaleData {
  id: number;
  sale_source_type: string;
  customer: string;
  payment_method: string;
  invoice: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  sale_number: string;
  sale_source_id: string | null;
  sub_total: string;
  total_amount: string;
  payment_status: "partial_paid" | "paid" | "due" | "unpaid";
  sales_date: string;
  due_date: string;
  notes: string;
}

interface SaleReceiptProps {
  data: SaleData;
}

export function SaleReceipt({ data }: SaleReceiptProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: {
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
        label: "Paid",
      },
      partial_paid: {
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        label: "Partial Paid",
      },
      due: {
        className:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        label: "Due",
      },
      unpaid: {
        className:
          "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        label: "Unpaid",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    return (
      <Badge
        variant="outline"
        className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      >
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </Badge>
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen  md:p-8 flex justify-center items-start">
      <Card className="w-full max-w-2xl shadow-lg border-blue-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm print:shadow-none print:border-0 print:bg-white">
        {/* Header */}
        <CardHeader className="pb-4 border-b border-blue-200 dark:border-gray-700 print:border-b-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Sales Receipt</h1>
              <p className="text-sm ">Official Transaction Record</p>
            </div>
            <div className="text-right">
              <CardTitle className="text-xl">{data.sale_number}</CardTitle>
              <p className="text-xs ">Issued: {formatDate(data.sales_date)}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Sale Details */}
            <div className="space-y-4 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
              <div>
                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Sale Source
                </h3>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {data.sale_source_type}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Customer
                </h3>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {data.customer}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Invoice Number
                </h3>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {data.invoice}
                </p>
              </div>
            </div>

            {/* Right Column - Status & Payment */}
            <div className="space-y-4 p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
              <div>
                <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                  Payment Status
                </h3>
                <div className="text-lg">
                  {getPaymentStatusBadge(data.payment_status)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                  Payment Method
                </h3>
                <div className="text-lg">
                  {getPaymentMethodBadge(data.payment_method)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                  Sale Date
                </h3>
                <p className="text-sm text-indigo-900 dark:text-indigo-100">
                  {formatDate(data.sales_date)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-blue-200 dark:bg-gray-700" />

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3 p-4 rounded-lg bg-green-50/50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
              <h3 className="font-semibold text-green-800 dark:text-green-300">
                Amount Summary
              </h3>

              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  Subtotal:
                </span>
                <span className="font-mono font-semibold text-green-900 dark:text-green-100">
                  {formatCurrency(data.sub_total)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-700/50">
                <span className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Total Amount:
                </span>
                <span className="font-mono text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(data.total_amount)}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                Payment Details
              </h3>

              {data.payment_status === "partial_paid" && (
                <div className="flex justify-between text-sm">
                  <span className="text-amber-700 dark:text-amber-300">
                    Amount Due:
                  </span>
                  <span className="font-mono font-semibold text-amber-900 dark:text-amber-100">
                    {formatCurrency(
                      (
                        parseFloat(data.sub_total) -
                        parseFloat(data.total_amount)
                      ).toFixed(2)
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-amber-700 dark:text-amber-300">
                  Due Date:
                </span>
                <span className="font-semibold text-amber-900 dark:text-amber-100">
                  {formatDate(data.due_date)}
                </span>
              </div>

              <div className="pt-2 border-t border-amber-200 dark:border-amber-700/50">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  {data.payment_status === "paid"
                    ? "Fully paid - Thank you!"
                    : data.payment_status === "partial_paid"
                    ? "Partial payment received"
                    : "Payment pending"}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Additional Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Transaction ID:
                  </span>
                  <p className="font-mono text-gray-800 dark:text-gray-200">
                    {data.sale_number}
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
              </div>

              {data.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">
                    Notes:
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {data.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6 bg-blue-200 dark:bg-gray-700" />

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
              This is an official sales receipt. Please keep it for your
              records.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Generated on {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* Action Buttons */}
          <Separator className="my-6 bg-blue-200 dark:bg-gray-700" />
          <div className="flex justify-center gap-4 pt-4 print:hidden">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-white dark:bg-gray-700 border-blue-200 dark:border-gray-600"
            >
              <FileText className="h-4 w-4" />
              Save PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-white dark:bg-gray-700 border-blue-200 dark:border-gray-600"
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
