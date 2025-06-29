import { getCustomers } from "@/api/customer";
import { DataTable } from "@/components/atoms/DataTable";
import CustomerEditor from "@/components/customers/editor";
import CustomerPreview from "@/components/customers/preview";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import type { Customer } from "@/types/customer";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Plus } from "lucide-react";
import React from "react";
import { useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<Customer>[] = [
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
    accessorFn: (row) => row?.fName + " " + row.lName,
    id: "customerName",
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
    cell: ({ row }) => <div>{row.getValue("customerName") ?? "—"}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    accessorKey: "contactNum",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact Number
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original;
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
                <CustomerPreview customer={customer} />
              </div>
            </div>
          )}
        </>
      );
    },
  },
];

const CustomerPage = () => {
  const { data, loading } = useFetch<{ customers: Customer[] }>(getCustomers);
  const customers = Array.isArray(data) ? data : data?.customers || [];

  const [customerEditBox, setCustomerEditBox] = useState(false);

  if (loading) {
    return (
      <main className="container mx-auto mt-4 p-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-center text-lg font-medium mb-4">
            Loading Customer...
          </h2>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto mt-4 p-4 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Customer Lists</h1>
        {/* <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center mb-4"></div> */}
      </div>

      <div className="flex items-center justify-end">
        <Button
          className="text-sm w-50 h-10"
          onClick={() => setCustomerEditBox(true)}
        >
          Add New Customer <Plus size={14} />
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        filterKeys={["id", "fName","lName", "email", "contactNum", "address","status"]}
        filterPlaceholder="Search customer..."
      />

      {customerEditBox && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setCustomerEditBox(false)}
            >
              ✕
            </button>
            <CustomerEditor customer={undefined} />
          </div>
        </div>
      )}
    </main>
  );
};

export default CustomerPage;
