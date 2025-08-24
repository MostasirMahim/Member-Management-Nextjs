"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: number;
  invoice: string;
  payment_method: string;
  member: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  amount: string;
  transaction_type: string;
  transaction_date: string;
  status: string;
  notes: string;
  adjustment_reason: string;
}

interface Props {
  transaction: Transaction;
}

export default function TransactionDetails({ transaction }: Props) {
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
            Transaction Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <p className="text-gray-700"><strong>Invoice:</strong> {transaction.invoice}</p>
              <p className="text-gray-700"><strong>Member:</strong> {transaction.member}</p>
              <p className="text-gray-700"><strong>Payment Method:</strong> {transaction.payment_method}</p>
              <p className="text-gray-700"><strong>Transaction Type:</strong> {transaction.transaction_type || "-"}</p>
              <p className="text-gray-700"><strong>Notes:</strong> {transaction.notes || "-"}</p>
              <p className="text-gray-700"><strong>Adjustment Reason:</strong> {transaction.adjustment_reason || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-700"><strong>Transaction Date:</strong> {formatBDDate(transaction.transaction_date)}</p>
              <p className="text-gray-700"><strong>Created At:</strong> {formatBDDate(transaction.created_at)}</p>
              <p className="text-gray-700"><strong>Updated At:</strong> {formatBDDate(transaction.updated_at)}</p>
              <p>
                <strong className="text-gray-700">Status:</strong>{" "}
                <Badge
                  className={`${
                    transaction.status === "completed"
                      ? "bg-green-600 text-white"
                      : transaction.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  } px-2 py-1 rounded-lg`}
                >
                  {transaction.status || "N/A"}
                </Badge>
              </p>
              <p>
                <strong className="text-gray-700">Is Active:</strong>{" "}
                <Badge className={transaction.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                  {transaction.is_active ? "Active" : "Inactive"}
                </Badge>
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <p><strong>Amount:</strong> {transaction.amount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
