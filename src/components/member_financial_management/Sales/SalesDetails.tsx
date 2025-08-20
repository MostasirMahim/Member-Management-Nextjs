"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Sale {
  id: number;
  sale_source_type: string;
  customer: string;
  invoice: string;
  is_active: boolean;
  sale_number: string;
  sub_total: string;
  total_amount: string;
  payment_status: string;
  sales_date: string;
  due_date: string;
  payment_method: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  sale: Sale;
}

export default function SaleDetails({ sale }: Props) {
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
            Sale Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <p className="text-gray-700"><strong>Sale Number:</strong> {sale.sale_number}</p>
              <p className="text-gray-700"><strong>Invoice:</strong> {sale.invoice}</p>
              <p className="text-gray-700"><strong>Customer:</strong> {sale.customer}</p>
              <p className="text-gray-700"><strong>Sale Type:</strong> {sale.sale_source_type}</p>
              <p className="text-gray-700"><strong>Notes:</strong> {sale.notes}</p>
              <p className="text-gray-700"><strong>Created At:</strong> {formatBDDate(sale.created_at)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-700"><strong>Sales Date:</strong> {formatBDDate(sale.sales_date)}</p>
              <p className="text-gray-700"><strong>Due Date:</strong> {formatBDDate(sale.due_date)}</p>
              <p className="text-gray-700"><strong>Payment Method:</strong> {formatBDDate(sale.payment_method)}</p>
              <p>
                <strong className="text-gray-700">Payment Status:</strong>{" "}
                <Badge
                  className={`${
                    sale.payment_status === "paid"
                      ? "bg-green-600 text-white"
                      : sale.payment_status === "partial_paid"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  } px-2 py-1 rounded-lg`}
                >
                  {sale.payment_status.replace("_", " ")}
                </Badge>
              </p>
              <p>
                <strong className="text-gray-700">Is Active:</strong>{" "}
                <Badge className={sale.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                  {sale.is_active ? "Active" : "Inactive"}
                </Badge>
              </p>
              <p>
                <strong className="text-gray-700">Updated At:</strong> {formatBDDate(sale.updated_at)}
              </p>  
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <p><strong>Sub Total:</strong> {sale.sub_total}</p>
              <p><strong>Total Amount:</strong> {sale.total_amount}</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
