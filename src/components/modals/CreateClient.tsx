import { useState } from 'react'
import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { addDoc } from 'firebase/firestore'
import { useTranslation } from 'react-i18next'
import { useAppToast, useClientColRef } from '../../Hooks'
import { IoIosAddCircle } from 'react-icons/io'
import CompanyForm from '../forms/Company'
import { CompanyType } from '../../types'

const CreateClientModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const clientModelRef = useClientColRef()
  const toast = useAppToast()
  const { t } = useTranslation()

  const submitNewClient = async (form: CompanyType) => {
    setIsLoading(true)

    try {
      addDoc(clientModelRef, form)

      toast({
        title: t('Contact saved!'),
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
    <>
      <IconButton
        size="sm"
        mt="2"
        onClick={onOpen}
        data-testid="modal-btn"
        aria-label="add contact"
        icon={<IoIosAddCircle size="1.2rem" />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('New Contact')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CompanyForm model="Client" actionText={t('Add')} onSubmit={submitNewClient} isLoading={isLoading} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateClientModal
