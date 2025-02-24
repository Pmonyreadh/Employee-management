import { Table, Icon, IconButton } from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Employee } from './employeeList'; 

interface EmployeeItemProps {
    employee: Employee;
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: string) => void;
  }
  
const EmployeeItem = ({ employee, onEdit, onDelete }: { employee: any; onEdit: (employee: any) => void; onDelete: (employeeId: string) => void }) => {
  return (
    <Table.Row data-id={employee._id}>
      <Table.Cell>{employee.first_name} {employee.last_name}</Table.Cell>
      <Table.Cell>{employee.email}</Table.Cell>
      <Table.Cell>{employee.phone_number}</Table.Cell>
      <Table.Cell>{employee.job_title}</Table.Cell>
      <Table.Cell>{employee.department}</Table.Cell>
      <Table.Cell>
        <IconButton color="blue.500" variant="ghost" aria-label="Edit" mr={2} onClick={() => onEdit(employee)}>
          <Icon as={MdEdit} />
        </IconButton>
        <IconButton color="red.500" variant="ghost" aria-label="Delete" onClick={() => onDelete(employee._id)}>
          <Icon as={MdDelete} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
};

export default EmployeeItem;
