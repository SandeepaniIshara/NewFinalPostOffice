import { getRoutingAreas } from "@/api/routing-areas";
import { DataTable } from "@/components/atoms/DataTable";
import RoutingAreaEditor from "@/components/routingArea/editor";
import RoutingAreaPreview from "@/components/routingArea/preview";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import type { RoutingArea } from "@/types/routing-areas";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Plus } from "lucide-react";
import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<RoutingArea>[] = [
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
    accessorFn: (row) => row?.deliver.fName + " " + row.deliver.lName,
    id: "deliverName",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deliver Name
          <ArrowUpDown size={16} />
        </span>
      );
    },
    cell: ({ row }) => <div>{row.getValue("deliverName") ?? "—"}</div>,
  },
  {
    accessorKey: "deliver.username",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown size={16} />
        </span>
      );
    },
  },
  {
    accessorKey: "area",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Area
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
      const routingArea = row.original;
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
                <RoutingAreaPreview routingArea={routingArea} />
              </div>
            </div>
          )}
        </>
      );
    },
  },
];

const RoutingAreaPage = () => {
  const { data, loading } = useFetch<{ routingAreas: RoutingArea[] }>(
    getRoutingAreas
  );
  const routingAreas = Array.isArray(data) ? data : data?.routingAreas || [];

  const [editBox, setEditBox] = React.useState(false);

  if (loading) {
    return (
      <main className="container mx-auto mt-4 p-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-center text-lg font-medium mb-4">
            Loading Routing Areas...
          </h2>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto mt-4 p-4 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Routing Areas Lists</h1>
        {/* <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center mb-4"></div> */}
      </div>

      <div className="flex items-center justify-end">
        <Button className="text-sm w-50 h-10" onClick={() => setEditBox(true)}>
          Add New Routing Area <Plus size={14} />
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={routingAreas}
        filterKeys={[
          "id",
          "deliver.fName",
          "deliver.lName",
          "deliver.username",
          "area",
          "status",
        ]}
        filterPlaceholder="Search Routing Areas..."
      />

      {editBox && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setEditBox(false)}
            >
              ✕
            </button>
            <RoutingAreaEditor routingArea={undefined} />
          </div>
        </div>
      )}
    </main>
  );
};

export default RoutingAreaPage;
