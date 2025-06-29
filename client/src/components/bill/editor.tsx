/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCustomer, getSearchCustomers } from "@/api/customer";
import { InputWithLabel } from "../atoms/InputWithLabel";
import { TextareaWithLabel } from "../atoms/TextareaWithLabel";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { toast } from "react-toastify";
import SelectWithLabel from "../atoms/SelectWithLabel";
import { Input } from "../ui/input";
import type { Customer } from "@/types/customer";
import { createBill } from "@/api/bill";

const BillEditor = () => {
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState<number>();
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientContactNum, setClientContactNum] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const [amount, setAmount] = useState<string>("");
  const [billType, setBillType] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const [clientFirstNameError, setClientFirstNameError] = useState("");
  const [clientLastNameError, setClientLastNameError] = useState("");
  const [clientEmailError, setClientEmailError] = useState("");
  const [clientContactNumError, setClientContactNumError] = useState("");
  const [clientAddressError, setClientAddressError] = useState("");

  const [amountError, setAmountError] = useState("");
  const [billTypeError, setBillTypeError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [amountPaidError, setAmountPaidError] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState("");

  const [clientSearch, setClientSearch] = useState("");

  const [clientResults, setClientResults] = useState<Customer[]>([]);

  const handleSearchSender = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const delayDebounce = setTimeout(async () => {
      if (clientSearch.trim() === "") {
        setClientResults([]);
        return;
      }

      try {
        const results = await getSearchCustomers({
          query: clientSearch,
        });
        console.log("Client results:", results);
        const customers = Array.isArray(results)
          ? results
          : results?.customers || [];
        setClientResults(customers); // ✅ Update results here
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    }, 300);
  };

  const handleCreateBill = async () => {
    setLoading(true);
    setClientFirstNameError("");
    setClientLastNameError("");
    setClientEmailError("");
    setClientContactNumError("");
    setClientAddressError("");

    setAmountError("");
    setBillTypeError("");
    setAccountNumberError("");
    setAmountPaidError("");
    setPaymentMethodError("");

    // Validate inputs
    let isHasError = false;

    if (!clientFirstName) {
      setClientFirstNameError("Customer's first name is required");
      isHasError = true;
    }
    if (!clientLastName) {
      setClientLastNameError("Customer's last name is required");
      isHasError = true;
    }
    if (!clientEmail) {
      setClientEmailError("Customer's email is required");
      isHasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientEmail)) {
        setClientEmailError("Invalid Customer email format");
        isHasError = true;
      }
    }

    if (!clientContactNum) {
      setClientContactNumError("Customer's contact number is required");
      isHasError = true;
    } else {
      const contactNumRegex = /^\d{10,15}$/;
      if (!contactNumRegex.test(clientContactNum)) {
        setClientContactNumError(
          "Customer's contact number must be 10-15 digits"
        );
        isHasError = true;
      } else {
        setClientContactNumError(""); // Clear error if validation passes
      }
    }
    if (!clientAddress) {
      setClientAddressError("Customer's address is required");
      isHasError = true;
    }

    if (!billType) {
      setBillTypeError("Bill type is required");
      isHasError = true;
    }
    if (!paymentMethod) {
      setPaymentMethodError("Payment method is required");
      isHasError = true;
    }
    if (!amount) {
      setAmountError("Amount is required");
      isHasError = true;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError("Amount must be a positive number");
      isHasError = true;
    }
    if (!amountPaid) {
      setAmountPaidError("Paid amount is required");
      isHasError = true;
    } else if (isNaN(Number(amountPaid)) || Number(amountPaid) < 0) {
      setAmountPaidError("Paid amount must be a non-negative number");
      isHasError = true;
    }
    if (!accountNumber) {
      setAccountNumberError("Account number is required");
      isHasError = true;
    }

    if (isHasError) {
      setLoading(false);
      return;
    }

    try {
      let cid: number = clientId || 0;
      if (!clientId) {
        const res = await createCustomer({
          firstName: clientFirstName,
          lastName: clientLastName,
          email: clientEmail,
          contactNum: clientContactNum,
          address: clientAddress,
        });

        const { customer } = res;
        cid = customer.id;
        setClientId(cid);

        toast.success("Customer created successfully");
      }

      if (!cid || cid === 0) {
        toast.error("Customer ID is missing after creation");
        setLoading(false);
        return;
      }

      await createBill({
        billType,
        accountNumber,
        amount: Number(amount),
        amountPaid: Number(amountPaid),
        paymentMethod,
        clientId: cid,
      });

      toast.success("Bill created successfully");

      // Clear sender and receiver details
      setClientId(undefined);
      setClientFirstName("");
      setClientLastName("");
      setClientEmail("");
      setClientContactNum("");
      setClientAddress("");

      window.location.reload();
    } catch (error) {
      console.error("Error creating mail:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" overflow-y-auto max-h-[calc(100vh-8rem)] p-4">
      <h1 className="text-xl font-bold">Create Bill</h1>
      <Separator className="mb-2" />

      <div className="space-y-2">
        <div className="px-2 space-y-1 mb-8">
          <h1 className="text-base">Customer Details</h1>
          <Separator className="px-8" />

          <Input
            placeholder="Search Client"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            onKeyUp={handleSearchSender}
            disabled={loading}
          />
          {clientResults.length > 0 && (
            <div className="bg-white border rounded mt-1 p-2">
              {clientResults.map((customer: any) => (
                <div
                  key={customer.id}
                  className="cursor-pointer hover:bg-gray-100 p-1"
                  onClick={() => {
                    setClientId(customer.id);
                    setClientFirstName(customer.fName);
                    setClientLastName(customer.lName);
                    setClientEmail(customer.email);
                    setClientContactNum(customer.contactNum);
                    setClientAddress(customer.address);
                    setClientSearch(""); // clear input
                    setClientResults([]); // hide suggestions
                  }}
                >
                  {customer.fName} {customer.lName} - {customer.email}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <InputWithLabel
              label="First Name:"
              id="clientFirstName"
              placeholder=""
              type="text"
              value={clientFirstName}
              onChange={(e) => setClientFirstName(e.target.value)}
              disabled={loading}
              error={clientFirstNameError}
              required
            />
            <InputWithLabel
              label="Last Name:"
              id="clientLastName"
              placeholder=""
              type="text"
              value={clientLastName}
              onChange={(e) => setClientLastName(e.target.value)}
              disabled={loading}
              error={clientLastNameError}
              required
            />
          </div>
          <div className="flex gap-2">
            <InputWithLabel
              label="Email:"
              id="clientEmail"
              placeholder=""
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              disabled={loading}
              error={clientEmailError}
              required
            />
            <InputWithLabel
              label="Contact Number:"
              id="clientContactNum"
              placeholder=""
              type="text"
              value={clientContactNum}
              onChange={(e) => setClientContactNum(e.target.value)}
              disabled={loading}
              error={clientContactNumError}
              required
            />
          </div>
          <TextareaWithLabel
            label="Address:"
            id="clientAddress"
            placeholder=""
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            disabled={loading}
            error={clientAddressError}
            required
          />
        </div>

        <div className="px-2 space-y-1">
          <h1 className="text-base">Bill Details</h1>
          <Separator className="px-8" />
          <div className="flex gap-2">
            <SelectWithLabel
              label="Bill Type:"
              id={"billType"}
              placeholder="Select a Bill Type"
              items={[
                { id: 1, item: "Electricity", value: "ELECTRICITY" },
                { id: 2, item: "Water", value: "WATER" },
                { id: 3, item: "Gas", value: "GAS" },
                { id: 4, item: "Internet", value: "INTERNET" },
                { id: 5, item: "Phone", value: "PHONE" },
                { id: 6, item: "Rent", value: "RENT" },
                { id: 7, item: "Insurance", value: "INSURANCE" },
                { id: 8, item: "Other", value: "OTHER" },
              ]}
              onChange={(value) => setBillType(value)}
              required
              disabled={loading}
              error={billTypeError}
            />
            <SelectWithLabel
              label="Payment Method:"
              id={"paymentMethod"}
              placeholder="Select a Payment Method"
              items={[
                { id: 1, item: "Cash", value: "CASH" },
                { id: 2, item: "Credit Card", value: "CREDIT_CARD" },
                { id: 3, item: "Debit Card", value: "DEBIT_CARD" },
                { id: 4, item: "Bank Transfer", value: "BANK_TRANSFER" },
                { id: 5, item: "Other", value: "OTHER" },
              ]}
              onChange={(value) => setPaymentMethod(value)}
              required
              disabled={loading}
              error={paymentMethodError}
            />
          </div>
          <div className="flex gap-2">
            <InputWithLabel
              label="Account Number:"
              id="accountNumber"
              placeholder=""
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={loading}
              error={accountNumberError}
              required
            />
          </div>
          <div className="flex gap-2">
            <InputWithLabel
              label="Amount(LKR):"
              id="amount"
              placeholder=""
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              error={amountError}
              required
            />
            <InputWithLabel
              label="Paid Amount(LKR):"
              id="amountPaid"
              placeholder=""
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              disabled={loading}
              error={amountPaidError}
              required
            />
          </div>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <Button
            variant="default"
            className="w-40 mt-4"
            onClick={handleCreateBill}
            disabled={loading}
          >
            Create Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillEditor;
