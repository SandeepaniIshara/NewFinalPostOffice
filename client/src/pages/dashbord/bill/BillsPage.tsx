import { getBills } from "@/api/bill";
import { DataTable } from "@/components/atoms/DataTable";
import BillEditor from "@/components/bill/editor";
import BillPreview from "@/components/bill/preview";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import type { Bill } from "@/types/bill";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Plus } from "lucide-react";
import React from "react";
import { useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<Bill>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    accessorFn: (row) => row?.client.fName + " " + row.client.lName,
    id: "clientName",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name
          <ArrowUpDown size={16} />
        </span>
      );
    },
    cell: ({ row }) => <div>{row.getValue("clientName") ?? "—"}</div>,
  },
  {
    accessorKey: "billType",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bill Type
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    accessorKey: "accountNumber",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Number
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount(LKR)
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    accessorKey: "amountPaid",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount Paid(LKR)
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Method
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const bill = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [preview, setPreview] = React.useState(false);

      return (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setPreview(true)}
          >
            <Eye />
          </Button>

          {preview && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-4xl relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => setPreview(false)}
                >
                  ✕
                </button>
                <BillPreview bill={bill} />
              </div>
            </div>
          )}
        </>
      );
    },
  },
];

const BillsPage = () => {
  const { data, loading } = useFetch<{ bills: Bill[] }>(getBills);
  const bills = Array.isArray(data) ? data : data?.bills || [];

  const [editBox, setEditBox] = useState(false);

  if (loading) {
    return (
      <main className="container mx-auto mt-4 p-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-center text-lg font-medium mb-4">
            Loading Bills...
          </h2>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto mt-4 p-4 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Bill Lists</h1>
        {/* <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center mb-4"></div> */}
      </div>

      <div className="flex items-center justify-end">
        <Button className="text-sm w-50 h-10" onClick={() => setEditBox(true)}>
          Add New Bill
          <Plus size={14} />
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={bills}
        filterKeys={["id", "deliverName", "area"]}
        filterPlaceholder="Search Bills..."
      />

      {editBox && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setEditBox(false)}
            >
              ✕
            </button>
            <BillEditor />
          </div>
        </div>
      )}
    </main>
  );
};

export default BillsPage;
