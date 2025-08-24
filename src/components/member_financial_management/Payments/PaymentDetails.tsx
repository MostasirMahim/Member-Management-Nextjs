"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Payment {
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

interface Props {
  payment: Payment;
}

export default function PaymentDetails({ payment }: Props) {
  const formatBDDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <p className="text-gray-700"><strong>Invoice:</strong> {payment.invoice}</p>
              <p className="text-gray-700"><strong>Member:</strong> {payment.member}</p>
              <p className="text-gray-700"><strong>Payment Method:</strong> {payment.payment_method}</p>
              <p className="text-gray-700"><strong>Processed By:</strong> {payment.processed_by}</p>
              <p className="text-gray-700"><strong>Notes:</strong> {payment.notes || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-700"><strong>Payment Date:</strong> {formatBDDate(payment.payment_date)}</p>
              <p className="text-gray-700"><strong>Created At:</strong> {formatBDDate(payment.created_at)}</p>
              <p className="text-gray-700"><strong>Updated At:</strong> {formatBDDate(payment.updated_at)}</p>
              <p>
                <strong className="text-gray-700">Payment Status:</strong>{" "}
                <Badge
                  className={`${
                    payment.payment_status === "paid"
                      ? "bg-green-600 text-white"
                      : payment.payment_status === "partial_paid"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  } px-2 py-1 rounded-lg`}
                >
                  {payment.payment_status.replace("_", " ")}
                </Badge>
              </p>
              <p>
                <strong className="text-gray-700">Is Active:</strong>{" "}
                <Badge className={payment.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                  {payment.is_active ? "Active" : "Inactive"}
                </Badge>
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <p><strong>Transaction Amount:</strong> {payment.transaction}</p>
              <p><strong>Payment Amount:</strong> {payment.payment_amount}</p>
              <p><strong>Payment Gateway:</strong> {payment.payment_gateway || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
