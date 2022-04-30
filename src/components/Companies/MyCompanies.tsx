
import { Accordion, Center, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Company from './Company';
import CreateCompanyModal from '../modals/CreateCompany';
import { useMyCompanies } from '../../Context/MyCompanies';


const MyCompanies = () => {
  const {myCompanies, loading, error} = useMyCompanies();
  const { t } = useTranslation();


  return <Stack w='100%'>
    <Center>
      <Stack direction='row' spacing={2} alignContent='center'>
        <Text>{t('My Companies')}</Text>
        <CreateCompanyModal />
      </Stack>
    </Center>
    {myCompanies?.length && (
      <Accordion allowMultiple data-testid="contacts--fetched">
        {myCompanies.map((doc, i) => (
          <Company key={doc.id! + i} data={doc} dbRef='Company' />
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
export default MyCompanies