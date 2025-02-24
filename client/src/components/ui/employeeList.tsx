import { Flex, Text, Container, Box, Button, Icon, Spinner, Table } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import EmployeeItem from "./employeeItem";
import { useColorMode } from "@/components/ui/color-mode";
import EmployeeForm from "./employeeForm";
import { toaster } from "@/components/ui/toaster";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogRoot
} from "@/components/ui/dialog";
import { MdAdd } from "react-icons/md";

export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  phone_number: string;
  job_title: string;
  department: string;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);  
  const [error, setError] = useState(""); 
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null); 

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");

      const data: Employee[] = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error("Fetch Employees Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async (employee: Employee) => {
    try {
      console.log("Sending payload:", JSON.stringify(employee));

      const response = await fetch("http://localhost:3000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Error:", errorResponse);
        throw new Error(errorResponse.message || "Failed to create employee");
      }

      const newEmployee = await response.json();
      console.log("New Employee Response:", newEmployee);

      if (!newEmployee._id) {
        throw new Error("New employee does not have an ID.");
      }

    setEmployees([...employees, newEmployee]);

      toaster.create({
        description: `${employee.first_name} ${employee.last_name} has been added.`,
        type: "success",
      });
      setIsDialogOpen(false); 
    } catch (error) {
      console.error("Create Employee Error:", error);
      toaster.create({ description: "Error adding employee.", type: "error" });
    }
  };

  const handleUpdate = async (employee: Employee) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Error:", errorResponse);
        throw new Error(errorResponse.message || "Failed to update employee");
      }

      const updatedEmployee = await response.json();
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp._id === updatedEmployee._id ? updatedEmployee : emp
        )
      );

      toaster.create({
        description: `${employee.first_name} ${employee.last_name} has been updated.`,
        type: "success",
      });
      setIsDialogOpen(false); 
      setEmployeeToEdit(null);  
    } catch (error) {
      console.error("Edit Employee Error:", error);
      toaster.create({ description: "Error updating employee.", type: "error" });
    }
  };

  const handleDelete = async (employeeId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Error:", errorResponse);
        throw new Error(errorResponse.message || "Failed to delete employee");
      }

      setEmployees((prev) => prev.filter((employee) => employee._id !== employeeId)); // Remove deleted employee from the list

      toaster.create({
        description: "Employee deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Delete Employee Error:", error);
      toaster.create({ description: "Error deleting employee.", type: "error" });
    }
  };

  const { colorMode } = useColorMode();

  return (
    <Container maxW={"80vw"} maxH={"90vh"} py={4}>
      {/* HEADER */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Employees</Text>
        <DialogRoot 
            open={isDialogOpen} 
            onOpenChange={(details) => {
                setIsDialogOpen(details.open);
                if (!details.open) {
                setEmployeeToEdit(null);
                }
            }}
        >
        <DialogTrigger asChild>
          <Button colorScheme="blue">
            <Icon as={MdAdd} mr={2} />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{employeeToEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <EmployeeForm
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              employee={employeeToEdit} 
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      </Flex>

      {/* TABLE */}
      <Box border="1px solid" borderColor="gray.300" borderRadius="lg" overflow="hidden">
        {isLoading ? (
          <Spinner size="lg" />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          <Table.Root>
            <Table.Header>
                <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Phone</Table.ColumnHeader>
                <Table.ColumnHeader>Job Title</Table.ColumnHeader>
                <Table.ColumnHeader>Department</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
        {employees && employees.length > 0 ? (
          employees.map((employee) => (
            <EmployeeItem
              key={employee._id}
              employee={employee}
              onEdit={(emp) => {
                setEmployeeToEdit(emp);
                setIsDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={6}>
              <Flex justify="center" py={4}>
                <Text>No employees found</Text>
              </Flex>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Container>
  );
};

export default EmployeeList;