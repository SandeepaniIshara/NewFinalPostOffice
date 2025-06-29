import { InputWithLabel } from "../atoms/InputWithLabel";
import { TextareaWithLabel } from "../atoms/TextareaWithLabel";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Employee } from "@/types/employee";
import SelectWithLabel from "../atoms/SelectWithLabel";
import { updateEmployee } from "@/api/employee";

const EmployeeEditor = ({ employee }: { employee: Employee }) => {
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumError, setPhoneNumError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (employee) {
      setId(employee.id.toString());
      setFirstName(employee.fName);
      setLastName(employee.lName);
      setEmail(employee.email);
      setPhoneNum(employee.phoneNum);
      setAddress(employee.address);
      setUsername(employee.username);
      setRole(employee.role);
      setStatus(employee.status);
    }
  }, [employee]);

  const handleSubmit = async () => {
    setLoading(true);
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneNumError("");
    setAddressError("");
    setUsernameError("");
    setRoleError("");
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

    if (!phoneNum) {
      setPhoneNumError("Phone number is required");
      isHasError = true;
    } else {
      const phoneNumRegex = /^\d{10,15}$/;
      if (!phoneNumRegex.test(phoneNum)) {
        setPhoneNumError("Phone number must be 10-15 digits");
        isHasError = true;
      } else {
        setPhoneNumError(""); // Clear error if validation passes
      }
    }
    if (!address) {
      setAddressError("Address is required");
      isHasError = true;
    }
    if (!username) {
      setUsernameError("Username is required");
      isHasError = true;
    }
    if (!role) {
      setRoleError("Role is required");
      isHasError = true;
    }
    if (!status) {
      setStatusError("Status is required");
      isHasError = true;
    }

    if (isHasError) {
      setLoading(false);
      return;
    }

    try {
      if (employee) {
        await updateEmployee({
          id,
          firstName,
          lastName,
          email,
          phoneNum,
          address,
          username,
          role,
          status,
        });
      }
      toast.success(
        `Employee ${employee ? "updated" : "created"} successfully`
      );

      window.location.reload();
    } catch (error) {
      console.error("Error creating or updating Employee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" overflow-y-auto max-h-[calc(100vh-8rem)] p-4">
      <h1 className="text-xl font-bold">
        {employee ? "Update Employee" : "Create Employee"}
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
            label="Username:"
            id="username"
            placeholder=""
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            error={usernameError}
            required
          />
        </div>
        <div className="flex gap-2">
          <InputWithLabel
            label="Phone Number:"
            id="phoneNum"
            placeholder=""
            type="text"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
            disabled={loading}
            error={phoneNumError}
            required
          />
          <InputWithLabel
            label="Password:"
            id="password"
            placeholder=""
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled
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
          <SelectWithLabel
            label="User Role"
            id="role"
            placeholder={""}
            items={[
              {
                item: "Mail Deliverer",
                value: "MAIL_DELIVERER",
                id: 0,
              },
              {
                item: "Postal Clerk",
                value: "POSTALCLERK",
                id: 1,
              },
            ]}
            onChange={(value) => setRole(value)}
            disabled={loading}
            error={roleError}
            selectedValue={role}
          />

          <SelectWithLabel
            label="Status"
            id="status"
            placeholder={""}
            items={[
              {
                item: "Pending",
                value: "PENDING",
                id: 0,
              },
              {
                item: "Active",
                value: "ACTIVE",
                id: 1,
              },
              {
                item: "Inactive",
                value: "INACTIVE",
                id: 2,
              },
            ]}
            onChange={(value) => setStatus(value)}
            disabled={loading}
            error={statusError}
            selectedValue={status}
          />
        </div>

        <div className="flex gap-2 items-center justify-end">
          <Button
            variant="default"
            className="w-40 mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {employee ? "Update Employee" : "Create Employee"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEditor;
