import { Input, Stack, Button } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState, useEffect } from "react";
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { Employee } from "./employeeList";

interface EmployeeFormProps {
  onCreate: (employee: Employee) => void; 
  onUpdate: (employee: Employee) => void;
  employee: Employee | null; 
}

const EmployeeForm = ({ onCreate, onUpdate, employee }: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    _id: "",
    first_name: "",
    last_name: "",
    gender: "Male",
    email: "",
    phone_number: "",
    job_title: "",
    department: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {

      setFormData({
        _id: "",
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        phone_number: '',
        job_title: '',
        department: ''
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Some quick validation
    if (!formData.first_name || !formData.last_name || !formData.email) {
      alert("Please fill out all required fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (employee) {
      onUpdate(formData); 
    } else {
      onCreate(formData); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="4">

        <Field label="First Name">
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter first name"
            required
          />
        </Field>

        <Field label="Last Name">
          <Input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter Last name"
            required
          />
        </Field>

        <Field label="Gender">
          <NativeSelectRoot>
            <NativeSelectField
              name="gender"
              items={["Select a gender", "Male", "Female", "Other"]}
              value={formData.gender || ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                console.log("Gender selected:", e.target.value); // Debugging
                setFormData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }));
              }}
              aria-label="Gender"
            />
          </NativeSelectRoot>
        </Field>

        <Field label="Email">
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </Field>

        <Field label="Phone">
          <Input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </Field>

        <Field label="Job Title">
          <Input
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            placeholder="Enter job title"
            required
          />
        </Field>

        <Field label="Department">
          <Input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter department"
            required
          />
        </Field>

        <Button type="submit" mt="4">
          {employee ? "Update Employee" : "Create Employee"}
        </Button>
      </Stack>
    </form>
  );
};

export default EmployeeForm;
