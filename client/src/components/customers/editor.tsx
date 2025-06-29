import { createCustomer, updateCustomer } from "@/api/customer";
import { InputWithLabel } from "../atoms/InputWithLabel";
import { TextareaWithLabel } from "../atoms/TextareaWithLabel";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Customer } from "@/types/customer";
import SelectWithLabel from "../atoms/SelectWithLabel";

const CustomerEditor = ({ customer }: { customer?: Customer }) => {
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactNumError, setContactNumError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (customer) {
      setId(customer.id.toString());
      setFirstName(customer.fName);
      setLastName(customer.lName);
      setEmail(customer.email);
      setContactNum(customer.contactNum);
      setAddress(customer.address);
      setStatus(customer.status);
    }
  }, [customer]);

  const handleSubmit = async () => {
    setLoading(true);
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setContactNumError("");
    setAddressError("");
    setStatusError("");

    // Validate inputs
    let isHasError = false;

    if (!firstName) {
      setFirstNameError("First name is required");
      isHasError = true;
    }
    if (!lastName) {
      setLastNameError("Last name is required");
      isHasError = true;
    }
    if (!email) {
      setEmailError("Email is required");
      isHasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email format");
        isHasError = true;
      }
    }

    if (!contactNum) {
      setContactNumError("Contact number is required");
      isHasError = true;
    } else {
      const contactNumRegex = /^\d{10,15}$/;
      if (!contactNumRegex.test(contactNum)) {
        setContactNumError("Contact number must be 10-15 digits");
        isHasError = true;
      } else {
        setContactNumError(""); // Clear error if validation passes
      }
    }
    if (!address) {
      setAddressError("Address is required");
      isHasError = true;
    }

    if (customer && !status) {
      setStatusError("Status is required");
      isHasError = true;
    }

    if (isHasError) {
      setLoading(false);
      return;
    }

    try {
      let isSuccess: boolean = false;
      if (!customer) {
        isSuccess = await handleCreateCustomer();
      }
      if (customer) {
        isSuccess = await handleUpdateCustomer();
      }

      if (isSuccess) {
        toast.success(
          `Customer ${customer ? "updated" : "created"} successfully`
        );
        window.location.reload();
        return null;
      }
      toast.error(`Failed to ${customer ? "update" : "create"} customer`);
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (): Promise<boolean> => {
    try {
      await createCustomer({
        firstName,
        lastName,
        email,
        contactNum,
        address,
      });
      return true;
    } catch (error) {
      console.error("Error creating customer:", error);
      return false;
    }
  };

  const handleUpdateCustomer = async (): Promise<boolean> => {
    try {
      await updateCustomer({
        id,
        firstName,
        lastName,
        email,
        contactNum,
        address,
        status,
      });
      return true;
    } catch (error) {
      console.error("Error creating customer:", error);
      return false;
    }
  };

  return (
    <div className="">
      <h1 className="text-base font-bold">
        {customer ? "Update" : "Create"} Customer
      </h1>
      <Separator className="mb-5" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <InputWithLabel
            label="First Name:"
            id="firstName"
            placeholder=""
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            error={firstNameError}
            required
          />
          <InputWithLabel
            label="Last Name:"
            id="lastName"
            placeholder=""
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            error={lastNameError}
            required
          />
        </div>
        <div className="flex gap-2">
          <InputWithLabel
            label="Email:"
            id="email"
            placeholder=""
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            error={emailError}
            required
          />
          <InputWithLabel
            label="Contact Number:"
            id="contactNum"
            placeholder=""
            type="text"
            value={contactNum}
            onChange={(e) => setContactNum(e.target.value)}
            disabled={loading}
            error={contactNumError}
            required
          />
        </div>
        <TextareaWithLabel
          label="Address:"
          id="address"
          placeholder=""
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
          error={addressError}
          required
        />
        <div className="flex gap-2">
          {customer && (
            <SelectWithLabel
              label="Status"
              id="status"
              placeholder={""}
              items={[
                {
                  item: "Active",
                  value: "ACTIVE",
                  id: 0,
                },
                {
                  item: "Inactive",
                  value: "INACTIVE",
                  id: 1,
                },
              ]}
              onChange={(value) => setStatus(value)}
              disabled={loading}
              error={statusError}
              selectedValue={status}
            />
          )}
          <div className="w-full"></div>
        </div>

        <div className="flex gap-2 items-center justify-end">
          <Button
            variant="default"
            className="w-40 mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {customer ? "Update" : "Create"} Customer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerEditor;
