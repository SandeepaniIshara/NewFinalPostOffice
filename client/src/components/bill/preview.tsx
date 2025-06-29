import type { Bill } from "@/types/bill";
import { Separator } from "../ui/separator";

const BillPreview = ({ bill }: { bill: Bill }) => {
  console.log(bill);
  {
    JSON.stringify(bill);
  }
  return (
    <div className=" overflow-y-auto max-h-[calc(100vh-8rem)] p-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-bold">Bill No: {bill.id}</h1>
        <h1 className="text-sm font-bold text-muted-foreground">
          Date:{" "}
          {new Date(bill.createdAt).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </h1>
      </div>
      <Separator className="mb-2" />

      <div className="space-y-2">
        <div className="px-2 space-y-2 mb-8">
          <h1 className="text-base">Customer Details</h1>
          <Separator className="px-8" />

          <div className="flex gap-2">
            <p className="w-full text-sm text-muted-foreground font-semibold">
              First Name:{" "}
              <span className="text-foreground">{bill.client?.fName}</span>
            </p>
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Last Name:{" "}
              <span className="text-foreground">{bill.client?.lName}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Email:{" "}
              <span className="text-foreground">{bill.client?.email}</span>
            </p>
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Contact Number:{" "}
              <span className="text-foreground">{bill.client?.contactNum}</span>
            </p>
          </div>
          <p className="w-full text-sm text-muted-foreground font-semibold">
            Address:{" "}
            <span className="text-foreground">{bill.client?.address}</span>
          </p>
        </div>

        <div className="px-2 space-y-2">
          <h1 className="text-base">Bill Details</h1>
          <Separator className="px-8" />
          <div className="flex gap-2">
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Bill Type:{" "}
              <span className="text-foreground">{bill.billType}</span>
            </p>
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Payment Method:{" "}
              <span className="text-foreground">{bill.paymentMethod}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Account Number:{" "}
              <span className="text-foreground">{bill.accountNumber}</span>
            </p>
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Amount(LKR): <span className="text-foreground">{bill.amount}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Amount Paid(LKR):{" "}
              <span className="text-foreground">{bill.amountPaid}</span>
            </p>
            <p className="w-full text-sm text-muted-foreground font-semibold">
              Status:{" "}
              <span className="text-foreground">
                {bill.amountPaid >= bill.amount ? "Paid" : "Unpaid"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;
