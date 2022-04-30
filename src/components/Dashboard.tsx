import { Wrap, WrapItem } from '@chakra-ui/react'
import { MyClientsProvider } from '../Context/MyClients'
import { MyCompaniesProvider } from '../Context/MyCompanies'
import MyClients from './Clients/MyClients'
import MyCompanies from './Companies/MyCompanies'
import Invoices from './Invoices'

const Dashboard = () => {

  return (
    <MyCompaniesProvider>
      <MyClientsProvider>
        <Wrap spacing={12}>
          <WrapItem
            flex="1"
            minWidth={'300px'}
            border={'1px solid gray'}
            m="2"
            borderRadius="10px"
            justifyContent="center"
            p="1rem"
          >
            <MyCompanies />
          </WrapItem>
          <WrapItem
            flex="1"
            minWidth={'300px'}
            border={'1px solid gray'}
            m="2"
            borderRadius="10px"
            justifyContent="center"
            p="1rem"
          >
            <MyClients />
          </WrapItem>
          <WrapItem
            minWidth={'600px'}
            flex="1"
            border={'1px solid gray'}
            m="2"
            borderRadius="10px"
            justifyContent="center"
            p="1rem"
          >
            <Invoices />
          </WrapItem>
        </Wrap>
      </MyClientsProvider>
    </MyCompaniesProvider>
  )
}

export default Dashboard
