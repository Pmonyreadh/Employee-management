// import { Button, ButtonGroup, EmptyState, VStack, Box } from "@chakra-ui/react";
// import { HiColorSwatch } from "react-icons/hi";
// import EmployeeForm from "./employeeForm";
// import { toaster } from "@/components/ui/toaster";
// import {
//   DialogActionTrigger,
//   DialogBody,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogRoot,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// const Empty = () => {
//   const handleCreate = (employee: {
//     firstName: string;
//     lastName: string;
//     gender: string;
//     email: string;
//     phone: string;
//     jobTitle: string;
//     department: string;
//   }) => {
//     console.log("New Employee:", employee);


//     toaster.create({
//       description: `${employee.firstName} ${employee.lastName} has been added.`,
//       type: "success", 
//     });
//   };

//   return (
//     <Box>
//       <EmptyState.Root>
//         <EmptyState.Content>
//           <EmptyState.Indicator>
//             <HiColorSwatch />
//           </EmptyState.Indicator>
//           <VStack textAlign="center">
//             <EmptyState.Title>No employees found!</EmptyState.Title>
//             <EmptyState.Description>
//               Start adding employees to get started
//             </EmptyState.Description>
//           </VStack>
//           <ButtonGroup>
//             <DialogRoot>
//               <DialogTrigger asChild>
//                 <Button>Add employee</Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Add Employee</DialogTitle>
//                 </DialogHeader>
//                 <DialogBody pb="4">
//                   <EmployeeForm onCreate={handleCreate} />
//                 </DialogBody>
//                 <DialogFooter>
//                   <DialogActionTrigger asChild>
//                     <Button variant="outline">Cancel</Button>
//                   </DialogActionTrigger>
//                   <Button type="submit">Save</Button>
//                 </DialogFooter>
//               </DialogContent>
//             </DialogRoot>
//           </ButtonGroup>
//         </EmptyState.Content>
//       </EmptyState.Root>
//     </Box>
//   );
// };

// export default Empty;