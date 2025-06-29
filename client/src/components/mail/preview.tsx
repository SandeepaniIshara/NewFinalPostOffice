/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
// import type { Customer } from "@/types/customer";
// import { deleteCustomer } from "@/api/customer";
// import CustomerEditor from "./editor";
import type { Mail } from "@/types/mail";
import SelectWithLabel from "../atoms/SelectWithLabel";
import type { RoutingArea } from "@/types/routing-areas";
import { getSearchRoutingAreas } from "@/api/routing-areas";
import { Input } from "../ui/input";
import { assignMialToDelivery, deleteMail, updateStatus } from "@/api/mail";

const MailPreview = ({ mail }: { mail: Mail }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [mailId, setMailId] = useState("");

  const [type, setType] = useState("");
  const [direction, setDirection] = useState("");
  const [status, setStatus] = useState("");

  const [routerId, setRouterId] = useState("");
  const [deliverFirstName, setDeliverFirstName] = useState("");
  const [deliverLastName, setDeliverLastName] = useState("");
  const [deliverEmail, setDeliverEmail] = useState("");
  const [deliverPhoneNum, setDeliverPhoneNum] = useState("");
  const [deliverArea, setDeliverArea] = useState("");

  const [receiverFirstName, setReceiverFirstName] = useState("");
  const [receiverLastName, setReceiverLastName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverPhoneNum, setReceiverPhoneNum] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");

  const [senderFirstName, setSenderFirstName] = useState("");
  const [senderLastName, setSenderLastName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhoneNum, setSenderPhoneNum] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  const [statusError, setStatusError] = useState("");
  const [asignedError, setAssignedError] = useState("");

  const [routerSearch, setRouterSearch] = useState("");

  const [routerResults, setRouterResults] = useState<RoutingArea[]>([]);

  useEffect(() => {
    if (mail) {
      setMailId(mail.id.toString());
      setType(mail.type);
      setDirection(mail.direction);
      setStatus(mail.status);

      setRouterId(mail.routingArea?.id.toString());
      setDeliverFirstName(mail.routingArea?.deliver?.fName);
      setDeliverLastName(mail.routingArea?.deliver?.lName);
      setDeliverEmail(mail.routingArea?.deliver.email);
      setDeliverPhoneNum(mail.routingArea?.deliver.phoneNum);
      setDeliverArea(mail.routingArea?.area);

      setReceiverFirstName(mail.receiver.fName);
      setReceiverLastName(mail.receiver.lName);
      setReceiverEmail(mail.receiver.email);
      setReceiverPhoneNum(mail.receiver.contactNum);
      setReceiverAddress(mail.receiver.address);

      setSenderFirstName(mail.sender.fName);
      setSenderLastName(mail.sender.lName);
      setSenderEmail(mail.sender.email);
      setSenderPhoneNum(mail.sender.contactNum);
      setSenderAddress(mail.sender.address);
    }
  }, [mail]);

  const handleAssign = async () => {
    setLoading(true);
    setAssignedError("");

    if (!routerId) {
      setAssignedError("Routing area is required");
      setLoading(false);
      return;
    }

    try {
      await assignMialToDelivery(mail.id, routerId);
      toast.success("Mail assigned successfully");
    } catch (error) {
      console.error("Failed to assign mail:", error);
      toast.error("Failed to assign mail");
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  const handleStatus = async () => {
    setLoading(true);
    setStatusError("");

    if (!status) {
      setStatusError("Status is required");
      setLoading(false);
      return;
    }

    try {
      await updateStatus(mail.id, status);
      toast.success("Mail status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update mail status:", error);
      toast.error("Failed to update mail status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await deleteMail(mail.id);

    toast.success("Mail deleted successfully");
    setDeleteLoading(false);
    window.location.reload();
  };

  const handleSearchRoutingArea = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const delayDebounce = setTimeout(async () => {
      if (routerSearch.trim() === "") {
        setRouterResults([]);
        return;
      }

      try {
        const results = await getSearchRoutingAreas({
          query: routerSearch,
        });
        const routingAreas = Array.isArray(results)
          ? results
          : results?.routingAreas || [];

        console.log("Routing Areas:", routingAreas);
        setRouterResults(routingAreas); // ✅ Update results here
      } catch (error) {
        console.error("Failed to fetch deliver:", error);
      }
    }, 300);
  };

  return (
    <>
      <div className="overflow-y-auto max-h-[calc(100vh-8rem)] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Mail Details</h1>
          <p className="text-base text-muted-foreground font-bold">
            ID: {mailId}
          </p>
        </div>

        <Separator className="mb-2" />

        <div className="space-y-2 mt-4">
          <div className="px-2 space-y-4 mb-8">
            <div className="flex gap-2">
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Type: <span className="text-foreground">{type}</span>
              </p>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Direction: <span className="text-foreground">{direction}</span>
              </p>
            </div>
            <div className="flex items-end gap-2">
              <SelectWithLabel
                label="Status:"
                id={"status"}
                placeholder="Select a Status..."
                items={[
                  { id: 1, item: "Pending", value: "PENDING" },
                  { id: 2, item: "In Transit", value: "IN_TRANSIT" },
                  {
                    id: 3,
                    item: "Out for Delivery",
                    value: "OUT_FOR_DELIVERY",
                  },
                  { id: 4, item: "Delivered", value: "DELIVERED" },
                  {
                    id: 5,
                    item: "Attempted Delivery",
                    value: "ATTEMPTED_DELIVERY",
                  },
                  {
                    id: 6,
                    item: "Returned to Sender",
                    value: "RETURNED_TO_SENDER",
                  },
                  { id: 7, item: "Cancelled", value: "CANCELLED" },
                  { id: 8, item: "Lost", value: "LOST" },
                  { id: 9, item: "Held at Customs", value: "HELD_AT_CUSTOMS" },
                ]}
                onChange={(value) => setStatus(value)}
                selectedValue={status}
                required
                disabled={loading}
                error={statusError}
              />
              <Button className="w-25 mt-4" onClick={handleStatus} disabled={loading}>
                Save
              </Button>
            </div>
            <Separator className="my-2 px-4" />
            <Input
              placeholder="Search routing area..."
              value={routerSearch}
              onChange={(e) => setRouterSearch(e.target.value)}
              onKeyUp={handleSearchRoutingArea}
              disabled={loading || deleteLoading || mail.status === "CANCELLED" || mail.status === "LOST"}
            />
            {routerResults.length > 0 && (
              <div className="bg-white border rounded mt-1 p-2">
                {routerResults.map((routingAreas: any) => (
                  <div
                    key={routingAreas.id}
                    className="cursor-pointer hover:bg-gray-100 p-1 flex justify-center gap-4"
                    onClick={() => {
                      setRouterId(routingAreas.id.toString());
                      setDeliverArea(routingAreas.area);
                      setDeliverFirstName(routingAreas.deliver.fName);
                      setDeliverLastName(routingAreas.deliver.lName);
                      setDeliverEmail(routingAreas.deliver.email);
                      setDeliverPhoneNum(routingAreas.deliver.phoneNum);
                      setRouterSearch(""); // clear input
                      setRouterResults([]); // hide suggestions
                    }}
                  >
                    <span>
                      {routingAreas.deliver.fName} {routingAreas.deliver.lName}
                    </span>
                    <span>-</span>
                    <span>{routingAreas.area}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <p className="w-full text-sm text-muted-foreground font-semibold">
                ID: <span className="text-foreground">{routerId || "-"}</span>
              </p>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Deliver First Name:{" "}
                <span className="text-foreground">
                  {deliverFirstName || "-"}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Deliver Last Name:{" "}
                <span className="text-foreground">
                  {deliverLastName || "-"}
                </span>
              </p>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Deliver Email:{" "}
                <span className="text-foreground">{deliverEmail || "-"}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Deliver Phone Number:{" "}
                <span className="text-foreground">
                  {deliverPhoneNum || "-"}
                </span>
              </p>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Deliver Area:{" "}
                <span className="text-foreground">{deliverArea || "-"}</span>
              </p>
            </div>
            <div className="flex items-center justify-between">
              {asignedError && (
                <p className="text-red-500 text-sm px-2">{asignedError}</p>
              )}
              <Button className="w-25" onClick={handleAssign} disabled={loading || deleteLoading || mail.status === "CANCELLED" || mail.status === "LOST"}>
                Save
              </Button>
            </div>
            <Separator className="my-2 px-4" />

            <div className="flex gap-2">
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Receiver First Name:{" "}
                <span className="text-foreground">{receiverFirstName}</span>
              </p>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Receiver Last Name:{" "}
                <span className="text-foreground">{receiverLastName}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Receiver Email:{" "}
                <span className="text-foreground">{receiverEmail}</span>
              </p>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Receiver Contact Number:{" "}
                <span className="text-foreground">{receiverPhoneNum}</span>
              </p>
            </div>
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Address:{" "}
              <span className="text-foreground">{receiverAddress}</span>
            </p>

            <Separator className="my-2 px-4" />

            <div className="flex gap-2">
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Sender First Name:{" "}
                <span className="text-foreground">{senderFirstName}</span>
              </p>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Sender Last Name:{" "}
                <span className="text-foreground">{senderLastName}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Sender Email:{" "}
                <span className="text-foreground">{senderEmail}</span>
              </p>
              <p className="w-full text-sm text-muted-foreground font-semibold">
                Sender Contact Number:{" "}
                <span className="text-foreground">{senderPhoneNum}</span>
              </p>
            </div>
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Address: <span className="text-foreground">{senderAddress}</span>
            </p>

            <div className="flex justify-end">
              <Button
                variant="destructive"
                className="w-25 mt-4"
                onClick={handleDelete}
                disabled={
                  deleteLoading || loading ||
                  mail.status === "CANCELLED" ||
                  mail.status === "LOST"
                }
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MailPreview;
