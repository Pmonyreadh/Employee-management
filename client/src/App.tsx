import { Stack, Container } from '@chakra-ui/react'
import Navbar from './components/ui/navbar';
// import Empty from './components/ui/empty';
import EmployeeList from './components/ui/employeeList';
// import { Provider } from './components/ui/provider';

function App() {
  return (
    <Stack h="100vh">
      <Navbar />
      <Container>
        <EmployeeList />
        {/* <Empty /> */}
      </Container>
    </Stack>
  );
}

export default App
