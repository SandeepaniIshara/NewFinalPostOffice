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
import { createMail } from "@/api/mail";

const MailEditor = () => {
  const [loading, setLoading] = useState(false);

  const [senderId, setSenderId] = useState<number>();
  const [senderFirstName, setSenderFirstName] = useState("");
  const [senderLastName, setSenderLastName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderContactNum, setSenderContactNum] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  const [receiverId, setReceiverId] = useState<number>();
  const [receiverFirstName, setReceiverFirstName] = useState("");
  const [receiverLastName, setReceiverLastName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverContactNum, setReceiverContactNum] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");

  const [type, setType] = useState("");
  const [direction, setDirection] = useState("");

  const [senderFirstNameError, setSenderFirstNameError] = useState("");
  const [senderLastNameError, setSenderLastNameError] = useState("");
  const [senderEmailError, setSenderEmailError] = useState("");
  const [senderContactNumError, setSenderContactNumError] = useState("");
  const [senderAddressError, setSenderAddressError] = useState("");

  const [receiverFirstNameError, setReceiverFirstNameError] = useState("");
  const [receiverLastNameError, setReceiverLastNameError] = useState("");
  const [receiverEmailError, setReceiverEmailError] = useState("");
  const [receiverContactNumError, setReceiverContactNumError] = useState("");
  const [receiverAddressError, setReceiverAddressError] = useState("");

  const [typeError, setTypeError] = useState("");
  const [directionError, setDirectionError] = useState("");

  const [senderSearch, setSenderSearch] = useState("");
  const [receiverSearch, setReceiverSearch] = useState("");

  const [senderResults, setSenderResults] = useState<Customer[]>([]);
  const [receiverResults, setReceiverResults] = useState<Customer[]>([]);

  const handleSearchSender = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const delayDebounce = setTimeout(async () => {
      if (senderSearch.trim() === "") {
        setSenderResults([]);
        return;
      }

      try {
        const results = await getSearchCustomers({
          query: senderSearch,
        });
        console.log("Sender results:", results);
        const customers = Array.isArray(results)
          ? results
          : results?.customers || [];
        setSenderResults(customers); // ✅ Update results here
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    }, 300);
  };

  const handleSearchReceiver = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const delayDebounce = setTimeout(async () => {
      if (receiverSearch.trim() === "") {
        setReceiverResults([]);
        return;
      }

      try {
        const results = await getSearchCustomers({
          query: receiverSearch,
        });
        console.log("Recever results:", results);
        const customers = Array.isArray(results)
          ? results
          : results?.customers || [];
        setReceiverResults(customers); // ✅ Update results here
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    }, 300);
  };

  const handleCreateMail = async () => {
    setLoading(true);
    setSenderFirstNameError("");
    setSenderLastNameError("");
    setSenderEmailError("");
    setSenderContactNumError("");
    setSenderAddressError("");

    setReceiverFirstNameError("");
    setReceiverLastNameError("");
    setReceiverEmailError("");
    setReceiverContactNumError("");
    setReceiverAddressError("");

    setTypeError("");
    setDirectionError("");

    // Validate inputs
    let isHasError = false;

    if (!senderFirstName) {
      setSenderFirstNameError("Sender's first name is required");
      isHasError = true;
    }
    if (!senderLastName) {
      setSenderLastNameError("Sender's last name is required");
      isHasError = true;
    }
    if (!senderEmail) {
      setSenderEmailError("Sender's email is required");
      isHasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(senderEmail)) {
        setSenderEmailError("Invalid sender email format");
        isHasError = true;
      }
    }

    if (!senderContactNum) {
      setSenderContactNumError("Sender's contact number is required");
      isHasError = true;
    } else {
      const contactNumRegex = /^\d{10,15}$/;
      if (!contactNumRegex.test(senderContactNum)) {
        setSenderContactNumError(
          "Sender's contact number must be 10-15 digits"
        );
        isHasError = true;
      } else {
        setSenderContactNumError(""); // Clear error if validation passes
      }
    }
    if (!senderAddress) {
      setSenderAddressError("Sender's address is required");
      isHasError = true;
    }

    if (!receiverFirstName) {
      setReceiverFirstNameError("Receiver's first name is required");
      isHasError = true;
    }
    if (!receiverLastName) {
      setReceiverLastNameError("Receiver's last name is required");
      isHasError = true;
    }
    if (!receiverEmail) {
      setReceiverEmailError("Receiver's email is required");
      isHasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(receiverEmail)) {
        setReceiverEmailError("Invalid receiver email format");
        isHasError = true;
      }
    }

    if (!receiverContactNum) {
      setReceiverContactNumError("Receiver's contact number is required");
      isHasError = true;
    } else {
      const contactNumRegex = /^\d{10,15}$/;
      if (!contactNumRegex.test(receiverContactNum)) {
        setReceiverContactNumError(
          "Receiver's contact number must be 10-15 digits"
        );
        isHasError = true;
      } else {
        setReceiverContactNumError(""); // Clear error if validation passes
      }
    }
    if (!receiverAddress) {
      setReceiverAddressError("Receiver's address is required");
      isHasError = true;
    }

    if (!type) {
      setTypeError("Type is required");
      isHasError = true;
    }
    if (!direction) {
      setDirectionError("Direction is required");
      isHasError = true;
    }

    if (isHasError) {
      setLoading(false);
      return;
    }

    try {
      let sid: number = senderId || 0;
      if (!senderId) {
        const res = await createCustomer({
          firstName: senderFirstName,
          lastName: senderLastName,
          email: senderEmail,
          contactNum: senderContactNum,
          address: senderAddress,
        });

        const { customer } = res;
        sid = customer.id;
        setSenderId(sid);

        toast.success("Sender created successfully");
      }

      let rid: number = receiverId || 0;
      if (!receiverId) {
        const res = await createCustomer({
          firstName: receiverFirstName,
          lastName: receiverLastName,
          email: receiverEmail,
          contactNum: receiverContactNum,
          address: receiverAddress,
        });

        const { customer } = res;
        rid = customer.id;

        setReceiverId(rid);

        toast.success("Receiver created successfully");
      }

      if (!sid || sid === 0) {
        toast.error("Sender ID is missing after creation");
        setLoading(false);
        return;
      }
      if (!rid || rid === 0) {
        toast.error("Receiver ID is missing after creation");
        setLoading(false);
        return;
      }

      await createMail({
        senderId: sid,
        receiverId: rid,
        type,
        direction,
      });

      toast.success("Mail created successfully");


      // Clear sender and receiver details
      setSenderId(undefined);
      setSenderFirstName("");
      setSenderLastName("");
      setSenderEmail("");
      setSenderContactNum("");
      setSenderAddress("");

      setReceiverId(undefined);
      setReceiverFirstName("");
      setReceiverLastName("");
      setReceiverEmail("");
      setReceiverContactNum("");
      setReceiverAddress("");

      window.location.reload();
    } catch (error) {
      console.error("Error creating mail:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" overflow-y-auto max-h-[calc(100vh-8rem)] p-4">
      <h1 className="text-xl font-bold">Create Mail</h1>
      <Separator className="mb-2" />

      <div className="space-y-2">
        <div className="px-2 space-y-1 mb-8">
          <h1 className="text-base">Sender Details</h1>
          <Separator className="px-8" />

          <Input
            placeholder="Search Sender"
            value={senderSearch}
            onChange={(e) => setSenderSearch(e.target.value)}
            onKeyUp={handleSearchSender}
            disabled={loading}
          />
          {senderResults.length > 0 && (
            <div className="bg-white border rounded mt-1 p-2">
              {senderResults.map((customer: any) => (
                <div
                  key={customer.id}
                  className="cursor-pointer hover:bg-gray-100 p-1"
                  onClick={() => {
                    setSenderId(customer.id);
                    setSenderFirstName(customer.fName);
                    setSenderLastName(customer.lName);
                    setSenderEmail(customer.email);
                    setSenderContactNum(customer.contactNum);
                    setSenderAddress(customer.address);
                    setSenderSearch(""); // clear input
                    setSenderResults([]); // hide suggestions
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
              id="senderFirstName"
              placeholder=""
              type="text"
              value={senderFirstName}
              onChange={(e) => setSenderFirstName(e.target.value)}
              disabled={loading}
              error={senderFirstNameError}
              required
            />
            <InputWithLabel
              label="Last Name:"
              id="senderLastName"
              placeholder=""
              type="text"
              value={senderLastName}
              onChange={(e) => setSenderLastName(e.target.value)}
              disabled={loading}
              error={senderLastNameError}
              required
            />
          </div>
          <div className="flex gap-2">
            <InputWithLabel
              label="Email:"
              id="senderEmail"
              placeholder=""
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              disabled={loading}
              error={senderEmailError}
              required
            />
            <InputWithLabel
              label="Contact Number:"
              id="senderContactNum"
              placeholder=""
              type="text"
              value={senderContactNum}
              onChange={(e) => setSenderContactNum(e.target.value)}
              disabled={loading}
              error={senderContactNumError}
              required
            />
          </div>
          <TextareaWithLabel
            label="Address:"
            id="senderAddress"
            placeholder=""
            value={senderAddress}
            onChange={(e) => setSenderAddress(e.target.value)}
            disabled={loading}
            error={senderAddressError}
            required
          />
        </div>

        <div className="px-2 space-y-1 mb-8">
          <h1 className="text-base">Receiver Details</h1>
          <Separator className="px-8" />

          <Input
            placeholder="Search Receiver"
            value={receiverSearch}
            onChange={(e) => setReceiverSearch(e.target.value)}
            onKeyUp={handleSearchReceiver}
            disabled={loading}
          />

          {receiverResults.length > 0 && (
            <div className="bg-white border rounded mt-1 p-2">
              {receiverResults.map((customer: any) => (
                <div
                  key={customer.id}
                  className="cursor-pointer hover:bg-gray-100 p-1"
                  onClick={() => {
                    setReceiverId(customer.id);
                    setReceiverFirstName(customer.fName);
                    setReceiverLastName(customer.lName);
                    setReceiverEmail(customer.email);
                    setReceiverContactNum(customer.contactNum);
                    setReceiverAddress(customer.address);
                    setReceiverSearch(""); // clear input
                    setReceiverResults([]); // hide suggestions
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
              id="receiverFirstName"
              placeholder=""
              type="text"
              value={receiverFirstName}
              onChange={(e) => setReceiverFirstName(e.target.value)}
              disabled={loading}
              error={receiverFirstNameError}
              required
            />
            <InputWithLabel
              label="Last Name:"
              id="receiverLastName"
              placeholder=""
              type="text"
              value={receiverLastName}
              onChange={(e) => setReceiverLastName(e.target.value)}
              disabled={loading}
              error={receiverLastNameError}
              required
            />
          </div>
          <div className="flex gap-2">
            <InputWithLabel
              label="Email:"
              id="receiverEmail"
              placeholder=""
              type="email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              disabled={loading}
              error={receiverEmailError}
              required
            />
            <InputWithLabel
              label="Contact Number:"
              id="receiverContactNum"
              placeholder=""
              type="text"
              value={receiverContactNum}
              onChange={(e) => setReceiverContactNum(e.target.value)}
              disabled={loading}
              error={receiverContactNumError}
              required
            />
          </div>
          <TextareaWithLabel
            label="Address:"
            id="receiverAddress"
            placeholder=""
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            disabled={loading}
            error={receiverAddressError}
            required
          />
        </div>

        <div className="px-2 space-y-1">
          <h1 className="text-base">Mail Details</h1>
          <Separator className="px-8" />
          <div className="flex gap-2">
            <SelectWithLabel
              label="Type"
              id={"type"}
              placeholder="Select a Type"
              items={[
                { id: 1, item: "Letter", value: "LETTER" },
                { id: 2, item: "Parcel", value: "PARCEL" },
                { id: 3, item: "Document", value: "DOCUMENT" },
              ]}
              onChange={(value) => setType(value)}
              required
              disabled={loading}
              error={typeError}
            />
            <SelectWithLabel
              label="Direction"
              id={"direction"}
              placeholder="Select a Direction"
              items={[
                { id: 1, item: "Incoming", value: "INCOMING" },
                { id: 2, item: "Outgoing", value: "OUTGOING" },
              ]}
              onChange={(value) => setDirection(value)}
              required
              disabled={loading}
              error={directionError}
            />
          </div>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <Button
            variant="default"
            className="w-40 mt-4"
            onClick={handleCreateMail}
            disabled={loading}
          >
            Create Mail
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MailEditor;
