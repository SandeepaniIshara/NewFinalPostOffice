import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "react-toastify";
import { useState } from "react";
import { deleteRoutingArea } from "@/api/routing-areas";
import type { RoutingArea } from "@/types/routing-areas";
import RoutingAreaEditor from "./editor";

const RoutingAreaPreview = ({ routingArea }: { routingArea: RoutingArea }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editorBox, setEditorBox] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await deleteRoutingArea(routingArea.id.toString());

    toast.success("Routing area deleted successfully");
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
            <RoutingAreaEditor routingArea={routingArea} />
          </div>
        </div>
      ) : (
        <div className=" overflow-y-auto max-h-[calc(100vh-8rem)] p-4">
          <h1 className="text-xl font-bold">Routing Area Details</h1>

          <Separator className="mb-2" />

          <div className="space-y-2 mt-4">
            <div className="px-2 space-y-4 mb-8">
              <div className="flex gap-2">
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  ID: <span className="text-foreground">{routingArea.id}</span>
                </p>
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Status:{" "}
                  <span className="text-foreground">
                    {routingArea.deliver.status}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  First Name:{" "}
                  <span className="text-foreground">
                    {routingArea.deliver.fName}
                  </span>
                </p>
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Last Name:{" "}
                  <span className="text-foreground">
                    {routingArea.deliver.lName}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Email:{" "}
                  <span className="text-foreground">
                    {routingArea.deliver.email}
                  </span>
                </p>
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Phone Number:{" "}
                  <span className="text-foreground">
                    {routingArea.deliver.phoneNum}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Area:{" "}
                  <span className="text-foreground">{routingArea.area}</span>
                </p>
                <p className="w-full text-sm text-muted-foreground font-semibold">
                  Status:{" "}
                  <span className="text-foreground">{routingArea.status}</span>
                </p>
              </div>

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
                    disabled={
                      deleteLoading || routingArea.status === "INACTIVE"
                    }
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

export default RoutingAreaPreview;
