import { signoutApi } from "@/api/auth";
import { getMails, updateStatus } from "@/api/mail";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ConfirmDialog } from "@/components/atoms/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { signout } from "@/features/user/userSlice";
import useFetch from "@/hooks/useFetch";
import type { Mail } from "@/types/mail";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SelectWithLabel from "@/components/atoms/SelectWithLabel";
import { useState } from "react";

interface UserData {
  id: string;
  username: string;
  role: string;
}

const DeliverPage = () => {
  const dispatch = useAppDispatch();

  const userData = useAppSelector(
    (state) => state.user.data
  ) as UserData | null;
  const { data, loading, refetch } = useFetch<{ mails: Mail[] }>(getMails);

  const mails = Array.isArray(data) ? data : data?.mails || [];
  const userId = userData?.id;

  const filteredMails = mails.filter(
    (mail) =>
      mail.routingArea?.deliver?.id === userId &&
      mail.status !== "PENDING" &&
      mail.status !== "CANCELLED" &&
      mail.status !== "RETURNED_TO_SENDER" &&
      mail.status !== "LOST" &&
      mail.status !== "HELD_AT_CUSTOMS"
  );

  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});

  const handleSignOut = async () => {
    try {
      await signoutApi();
      dispatch(signout());
      toast.success("Successfully signed out");
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleStatusUpdate = async (mailId: number) => {
    const selectedStatus = statuses[mailId];

    if (!selectedStatus) {
      setErrors((prev) => ({ ...prev, [mailId]: "Status is required" }));
      return;
    }

    setSaving((prev) => ({ ...prev, [mailId]: true }));
    setErrors((prev) => ({ ...prev, [mailId]: "" }));

    try {
      await updateStatus(mailId, selectedStatus);
      toast.success("Mail status updated successfully");
      refetch?.();
    } catch (error) {
      console.error("Failed to update mail status:", error);
      toast.error("Failed to update mail status");
    } finally {
      setSaving((prev) => ({ ...prev, [mailId]: false }));
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto mt-4 p-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <h2 className="text-center text-lg font-medium mb-4">
          Loading Mails...
        </h2>
      </main>
    );
  }

  return (
    <main className="container mx-auto mt-4 p-4 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">PostaFlow</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full">
              {userData?.username?.charAt(0).toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <ConfirmDialog
                title="Are you sure you want to sign out?"
                description="You will be signed out of your account and redirected to the login page."
                onConfirm={handleSignOut}
                trigger={
                  <div className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </div>
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredMails.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          No mails assigned to you.
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredMails.map((mail) => (
              <Card key={mail.id} className="w-[350px]">
                <CardHeader>
                  <CardTitle className="truncate">
                    {mail.receiver.fName} {mail.receiver.lName}
                  </CardTitle>
                  <CardDescription>
                    <div className="w-full max-w-xs truncate">
                      {mail.receiver.email}
                    </div>
                    <div className="w-full max-w-xs truncate">
                      {mail.receiver.contactNum}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Receiver Address:{" "}
                    <span className="text-foreground w-full max-w-xs">
                      {mail.receiver.address}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mail Type:{" "}
                    <span className="text-foreground">
                      {mail.type
                        .split("-")
                        .map(
                          (word: string) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>
                  </p>
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
                      {
                        id: 9,
                        item: "Held at Customs",
                        value: "HELD_AT_CUSTOMS",
                      },
                    ]}
                    onChange={(value) =>
                      setStatuses((prev) => ({ ...prev, [mail.id]: value }))
                    }
                    selectedValue={statuses[mail.id] || mail.status}
                    required
                    disabled={saving[mail.id]}
                    error={errors[mail.id]}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    className="w-25"
                    onClick={() => handleStatusUpdate(mail.id)}
                    disabled={saving[mail.id]}
                  >
                    Save
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default DeliverPage;
