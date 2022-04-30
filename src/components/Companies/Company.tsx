import { AccordionButton, AccordionItem, AccordionPanel, Box, Flex, IconButton, Stack, Text } from '@chakra-ui/react'
import { t } from 'i18next'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdEdit } from 'react-icons/md'
import { useAppToast, useUpdateDoc } from '../../Hooks'
import { CompanyType } from '../../types'
import CompanyForm from '../forms/Company'
import DeleteClientModal from '../modals/DeleteClient'
import DeleteCompanyModal from '../modals/DeleteCompany'

const Company = ({ data: company, dbRef }: { data: CompanyType; dbRef: 'Company' | 'Client' }) => {
  const { name } = company
  return (
    <AccordionItem border={'1px solid gray'} m="2" borderRadius="10px">
      <AccordionButton>
        <Text>{name}</Text>
      </AccordionButton>
      <AccordionPanel pb="4">
        <CompanyPanel company={company} dbRef={dbRef} />
      </AccordionPanel>
    </AccordionItem>
  )
}

const CompanyPanel = ({ company, dbRef }: { company: CompanyType; dbRef: 'Company' | 'Client' }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  return showUpdateForm ? (
    <UpdatePanel company={company} onClose={() => setShowUpdateForm(false)} dbRef={dbRef} />
  ) : (
    <DisplayPanel company={company} onClose={() => setShowUpdateForm(true)} dbRef={dbRef} />
  )
}

const UpdatePanel = ({
  company,
  dbRef,
  onClose,
}: {
  company: CompanyType
  onClose: () => void
  dbRef: 'Company' | 'Client'
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const updateCompanyDoc = useUpdateDoc(dbRef)
  const toast = useAppToast()

  const handleCompanyUpdate = async (form: CompanyType) => {
    setIsLoading(true)
    try {
      updateCompanyDoc(company.id!, form)
      toast({
        title: t('Company saved!'),
        status: 'success',
      })

      onClose()
    } catch (error) {
      toast({
        title: t('There was an unexpected error. Please try again.'),
        status: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CompanyForm
      isLoading={isLoading}
      actionText={t('Update')}
      {...company}
      model={dbRef}
      onSubmit={handleCompanyUpdate}
    />
  )
}

const DisplayPanel = ({
  company,
  onClose,
  dbRef,
}: {
  company: CompanyType
  onClose: () => void
  dbRef: 'Company' | 'Client'
}) => {
  const { name, id, cui, line1, line2, line3, line4, line5 } = company
  const { t } = useTranslation()
  return (
    <Stack alignItems="flex-start" spacing={2}>
      <Box>
        <Text>
          <b>{t('Name')}</b>: {name}
        </Text>
      </Box>
      <Box>
        <Text>
          <b>{t('Reg No')}</b>: {cui}
        </Text>
      </Box>
      <Stack alignItems="flex-start" alignContent="flex-start" spacing={1}>
        <Text fontWeight="bold">{t('Invoice data: ')}</Text>
        <Text fontSize="14px" textAlign="start">
          {line1}
        </Text>
        <Text fontSize="14px" textAlign="start">
          {line2}
        </Text>
        <Text fontSize="14px" textAlign="start">
          {line3}
        </Text>
        <Text fontSize="14px" textAlign="start">
          {line4}
        </Text>
        <Text fontSize="14px" textAlign="start">
          {line5}
        </Text>
      </Stack>
      <Flex direction="row-reverse" gap="2">
        {id && (dbRef === 'Company' ? <DeleteCompanyModal docId={id} /> : <DeleteClientModal docId={id} />)}
        <IconButton
          size="sm"
          onClick={() => onClose()}
          data-testid="modal-btn"
          aria-label="delete contact"
          icon={<MdEdit />}
        />
      </Flex>
    </Stack>
  )
}

export default Company
