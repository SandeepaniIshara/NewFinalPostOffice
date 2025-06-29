import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "react-toastify";
import { useState } from "react";
import type { Customer } from "@/types/customer";
import { deleteCustomer } from "@/api/customer";
import CustomerEditor from "./editor";

const CustomerPreview = ({ customer }: { customer: Customer }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editorBox, setEditorBox] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await deleteCustomer(customer.id.toString());

    toast.success("Customer deleted successfully");
    setDeleteLoading(false);
    window.location.reload();
  };

  return (
    <>
      {editorBox ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setEditorBox(false)}
            >
              ✕
            </button>
            <CustomerEditor customer={customer} />
          </div>
        </div>
      ) : (
        <div className=" overflow-y-auto max-h-[calc(100vh-8rem)] p-4">
          <h1 className="text-xl font-bold">Customer Details</h1>

          <Separator className="mb-2" />

          <div className="space-y-2 mt-4">
            <div className="px-2 space-y-4 mb-8">
              <div className="flex gap-2">
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  ID: <span className="text-foreground">{customer.id}</span>
                </p>
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Status: <span className="text-foreground">{customer.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  First Name:{" "}
                  <span className="text-foreground">{customer.fName}</span>
                </p>
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Last Name:{" "}
                  <span className="text-foreground">{customer.lName}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Email:{" "}
                  <span className="text-foreground">{customer.email}</span>
                </p>
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Phone Number:{" "}
                  <span className="text-foreground">{customer.contactNum}</span>
                </p>
              </div>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Address:{" "}
                <span className="text-foreground">{customer.address}</span>
              </p>

              <div className="flex justify-end">
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    className="w-25 mt-4"
                    onClick={() => setEditorBox(true)}
                    disabled={deleteLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-25 mt-4"
                    onClick={handleDelete}
                    disabled={deleteLoading || customer.status === "INACTIVE"}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerPreview;
