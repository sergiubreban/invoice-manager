import { Button, Center, Flex, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import InvoiceForm from '../forms/Invoice'

const Invoices = () => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const { t } = useTranslation()

  return (
    <Stack w="100%">
      <Center>
        <Text>{t('Invoices')}</Text>
      </Center>
      <Flex>
        {showInvoiceForm ? (
          <InvoiceForm />
        ) : (
          <Button onClick={() => setShowInvoiceForm(true)}> {t('New Invoice')}</Button>
        )}
      </Flex>
    </Stack>
  )
}

export default Invoices
