
import { Accordion, Center, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMyClients } from '../../Context/MyClients';
import Company from '../Companies/Company';
import CreateClientModal from '../modals/CreateClient';


const MyClients = () => {
  const { t } = useTranslation();
  const { myClients, loading, error } = useMyClients();

  return <Stack w='100%'>
    <Center>
      <Stack direction='row' spacing={2} alignContent='center'>
        <Text>{t('My Clients')}</Text>
        <CreateClientModal />
      </Stack>
    </Center>
    {myClients.length && (
      <Accordion allowMultiple data-testid="contacts--fetched">
        {myClients.map((doc, i) => (
          <Company key={doc.id! + i} data={doc} dbRef='Client' />
        ))}
      </Accordion>
    )}
    {loading && <Stack>
      <Skeleton height='20px' />
      <Skeleton height='20px' />
      <Skeleton height='20px' />
    </Stack>}
    {error && <Text fontSize='12px' color='red'>{t('There was an unexpected error. Please try again.')}</Text>}
  </Stack>
}
export default MyClients