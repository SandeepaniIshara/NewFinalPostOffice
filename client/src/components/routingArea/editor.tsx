/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputWithLabel } from "../atoms/InputWithLabel";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SelectWithLabel from "../atoms/SelectWithLabel";
import type { RoutingArea } from "@/types/routing-areas";
import { Input } from "../ui/input";
import type { Employee } from "@/types/employee";
import { getSearchEmployee } from "@/api/employee";
import { createRoutingArea, updateRoutingArea } from "@/api/routing-areas";

const RoutingAreaEditor = ({ routingArea }: { routingArea?: RoutingArea }) => {
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  const [deliverId, setDeliverId] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactNumError, setContactNumError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [statusError, setStatusError] = useState("");

  const [deliverSearch, setDeliverSearch] = useState("");

  const [deliverResults, setdeliverResults] = useState<Employee[]>([]);

  useEffect(() => {
    if (routingArea) {
      setId(routingArea.id.toString());
      setFirstName(routingArea.deliver.fName);
      setLastName(routingArea.deliver.lName);
      setEmail(routingArea.deliver.email);
      setContactNum(routingArea.deliver.phoneNum);
      setArea(routingArea.area);
      setStatus(routingArea.status);

      setDeliverId(routingArea.deliver.id.toString());
    }
  }, [routingArea]);

  const handleSubmit = async () => {
    setLoading(true);
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setContactNumError("");
    setAreaError("");
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
    if (!area) {
      setAreaError("Address is required");
      isHasError = true;
    }

    if (routingArea && !status) {
      setStatusError("Status is required");
      isHasError = true;
    }

    if (isHasError) {
      setLoading(false);
      return;
    }

    try {
      let isSuccess: boolean = false;
      if (!routingArea) {
        isSuccess = await handleCreateRoutingArea();
      }
      if (routingArea) {
        isSuccess = await handleUpdateRoutingArea();
      }

      if (isSuccess) {
        toast.success(
          `Routing Area ${routingArea ? "updated" : "created"} successfully`
        );
        window.location.reload();
        return null;
      }
      toast.error(
        `Failed to ${routingArea ? "update" : "create"} Routing Area`
      );
    } catch (error) {
      console.error("Error creating routingArea:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoutingArea = async (): Promise<boolean> => {
    try {
      await createRoutingArea({
        deliverId,
        area,
      });
      return true;
    } catch (error) {
      console.error("Error creating routingArea:", error);
      return false;
    }
  };

  const handleUpdateRoutingArea = async (): Promise<boolean> => {
    try {
      await updateRoutingArea({
        id: Number(id),
        deliverId,
        area,
        status,
      });
      return true;
    } catch (error) {
      console.error("Error updating routingArea:", error);
      return false;
    }
  };

  const handleSearchDeliver = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const delayDebounce = setTimeout(async () => {
      if (deliverSearch.trim() === "") {
        setdeliverResults([]);
        return;
      }

      try {
        const results = await getSearchEmployee({
          query: deliverSearch,
          role: "MAIL_DELIVERER",
        });
        const employees = Array.isArray(results)
          ? results
          : results?.employees || [];
        setdeliverResults(employees); // ✅ Update results here
      } catch (error) {
        console.error("Failed to fetch deliver:", error);
      }
    }, 300);
  };

  return (
    <div className="">
      <h1 className="text-base font-bold">
        {routingArea ? "Update" : "Create"} Routing Area
      </h1>
      <Separator className="mb-5" />
      <div className="space-y-2">
        <Input
          placeholder="Search deliver"
          value={deliverSearch}
          onChange={(e) => setDeliverSearch(e.target.value)}
          onKeyUp={handleSearchDeliver}
          disabled={loading}
        />
        {deliverResults.length > 0 && (
          <div className="bg-white border rounded mt-1 p-2">
            {deliverResults.map((employee: any) => (
              <div
                key={employee.id}
                className="cursor-pointer hover:bg-gray-100 p-1 flex justify-center gap-4"
                onClick={() => {
                  setDeliverId(employee.id.toString());
                  setFirstName(employee.fName);
                  setLastName(employee.lName);
                  setEmail(employee.email);
                  setContactNum(employee.phoneNum);
                  setDeliverSearch(""); // clear input
                  setdeliverResults([]); // hide suggestions
                }}
              >
                <span>
                  {employee.fName} {employee.lName}
                </span>
                <span>-</span>
                <span>{employee.username}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <InputWithLabel
            label="First Name:"
            id="firstName"
            placeholder=""
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled
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
            disabled
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
            disabled
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
            disabled
            error={contactNumError}
            required
          />
        </div>

        <div className="flex gap-2">
          <InputWithLabel
            label="Area:"
            id="area"
            placeholder=""
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            disabled={loading}
            error={areaError}
            required
          />
          {routingArea && (
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
        </div>

        <div className="flex gap-2 items-center justify-end">
          <Button
            variant="default"
            className="w-40 mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {routingArea ? "Update" : "Create"} Routing Area
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoutingAreaEditor;
