import { Box, Button, FormControl, FormLabel, Input, Wrap, WrapItem } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { usePdf, useSeriesColRef, useUpdateDoc } from '../../Hooks'
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete'
import { useMemo, useState } from 'react'
import { CompanyType } from '../../types'
import { useMyClients } from '../../Context/MyClients'
import { useMyCompanies } from '../../Context/MyCompanies'
import { useCollection } from 'react-firebase-hooks/firestore'
import ReactDatePicker from 'react-datepicker'
import { addDoc } from 'firebase/firestore'

const InvoiceForm = () => {
  // const toast = useAppToast()
  const { t } = useTranslation()
  const {
    // register,
    handleSubmit,
    // formState: { errors },
  } = useForm()
  const { myClients } = useMyClients()
  const { myCompanies } = useMyCompanies()
  const [myCompany, setMyCompany] = useState<CompanyType | null>(null)
  const [clientCompany, setClientCompany] = useState<CompanyType | null>(null)
  const [selectedSeries, setSelectedSeries] = useState('')
  const [issueDate, setIssueDate] = useState<Date | null>(new Date())
  const [service, setService] = useState('')
  const [price, setPrice] = useState(500)
  const [unit, setUnit] = useState('days')
  const [currency, setCurrency] = useState('GBP')
  const [quantity, setQuantity] = useState(21)
  const [dueDate, setDueDate] = useState<Date | null>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date
  })
  const { createPdf } = usePdf()
  const clientRef = useSeriesColRef()
  const [value] = useCollection(clientRef)
  const updateSeriesDoc = useUpdateDoc('Series')
  const seriesModelRef = useSeriesColRef()
  const series: any = useMemo(() => value?.docs?.map((doc) => ({ id: doc.id as string, ...doc.data() })), [value])

  const submitForm = async ({ name, cui }: CompanyType) => {
    // todo: add storage feature
  }

  const handleinvoiceGen = () => {
    createPdf({
      business: {
        name: myCompany?.name,
        address: myCompany?.line1,
        phone: myCompany?.line2,
        email: myCompany?.line3,
        email_1: myCompany?.line4,
        website: myCompany?.line5,
      },
      contact: {
        label: 'Invoice issued for:',
        name: clientCompany?.name,
        address: clientCompany?.line1,
        phone: clientCompany?.line2,
        email: clientCompany?.line3,
        otherInfo: clientCompany?.line4 ?? '' + clientCompany?.line5 ?? '',
      },
      invoice: {
        label: `Invoice ${selectedSeries} #: `,
        num: series?.find((s: any) => s.name === selectedSeries)?.num ?? 0 + 1,
        invDate: `Issue Date: ${issueDate?.toLocaleDateString()}`,
        invGenDate: `Due Date: ${dueDate?.toLocaleDateString()}`,
        table: [[1, service, price, quantity, unit, price * quantity]],
        invTotal: `${price * quantity}`,
      },
    })
    const seriesDoc = series?.find((s: any) => s.name === selectedSeries)

    if (seriesDoc) {
      updateSeriesDoc(seriesDoc.id, {
        num: seriesDoc.num + 1,
      })
    } else {
      addDoc(seriesModelRef, { name: selectedSeries, num: 1 })
    }
  }
  return (
    <form onSubmit={handleSubmit((data: any) => submitForm(data))} data-testid="form">
      <Wrap spacing={2}>
        <WrapItem>
          <FormControl>
            <FormLabel htmlFor="myCompany">{'MyCompany'}</FormLabel>
            <AutoComplete
              onChange={(val) => {
                setMyCompany(myCompanies.find((company) => company.name === val)!)
                return val
              }}
              openOnFocus
            >
              <AutoCompleteInput variant="filled" id="myCompany" name="myCompany" />
              <AutoCompleteList>
                {myCompanies.map((company, cid) => (
                  <AutoCompleteItem
                    key={`option-${cid}`}
                    value={company.name}
                    textTransform="capitalize"
                    _selected={{ bg: 'whiteAlpha.50' }}
                    _focus={{ bg: 'whiteAlpha.100' }}
                  >
                    {company.name}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
          </FormControl>
        </WrapItem>

        <WrapItem>
          <FormControl>
            <FormLabel htmlFor="myClient">{'MyClient'}</FormLabel>
            <AutoComplete
              onChange={(val) => {
                setClientCompany(myClients.find((company) => company.name === val)!)
                return val
              }}
              openOnFocus
            >
              <AutoCompleteInput variant="filled" id="myClient" name="myClient" />
              <AutoCompleteList>
                {myClients.map((company, cid) => (
                  <AutoCompleteItem
                    key={`option-${cid}`}
                    value={company.name}
                    textTransform="capitalize"
                    _selected={{ bg: 'whiteAlpha.50' }}
                    _focus={{ bg: 'whiteAlpha.100' }}
                  >
                    {company.name}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
          </FormControl>
        </WrapItem>

        <WrapItem>
          <FormControl>
            <FormLabel htmlFor="series">{'series'}</FormLabel>
            <AutoComplete onChange={(val) => setSelectedSeries(val)} openOnFocus creatable>
              <AutoCompleteInput variant="filled" id="series" name="series" />
              <AutoCompleteList>
                {series?.map((series: any, cid: number) => (
                  <AutoCompleteItem
                    key={`option-${cid}`}
                    value={series.name}
                    textTransform="capitalize"
                    _selected={{ bg: 'whiteAlpha.50' }}
                    _focus={{ bg: 'whiteAlpha.100' }}
                  >
                    {series.name}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
          </FormControl>
        </WrapItem>
        <Wrap>
          <WrapItem>
            <FormControl>
              <FormLabel>{'Issue Date'}</FormLabel>
              <Box color="#000">
                <ReactDatePicker selected={issueDate} onChange={(date) => setIssueDate(date)} />
              </Box>
            </FormControl>
          </WrapItem>
          <WrapItem>
            <FormControl>
              <FormLabel>{'Due Date'}</FormLabel>
              <Box color="#000">
                <ReactDatePicker selected={dueDate} onChange={(date) => setDueDate(date)} />
              </Box>
            </FormControl>
          </WrapItem>
        </Wrap>
        <Wrap>
          <WrapItem>
            <FormControl>
              <FormLabel htmlFor="service">{'Service'}</FormLabel>
              <Input id="service" value={service} onChange={(e) => setService(e.target.value)} type="text" />
            </FormControl>
          </WrapItem>
          <WrapItem>
            <FormControl>
              <FormLabel htmlFor="price">{'Price'}</FormLabel>
              <Input id="price" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} type="number" />
            </FormControl>
          </WrapItem>

          <WrapItem>
            <FormControl>
              <FormLabel htmlFor="quantity">{'Quantity'}</FormLabel>
              <Input
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                type="number"
              />
            </FormControl>
          </WrapItem>

          <WrapItem>
            <FormControl>
              <FormLabel htmlFor="currency">{'Currency'}</FormLabel>
              <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} type="string" />
            </FormControl>
          </WrapItem>

          <WrapItem>
            <FormControl>
              <FormLabel htmlFor="unit">{'Unit'}</FormLabel>
              <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} type="string" />
            </FormControl>
          </WrapItem>
        </Wrap>
        <WrapItem>
          <Button onClick={handleinvoiceGen}>{t('Generate Invoice')}</Button>
        </WrapItem>
      </Wrap>
    </form>
  )
}

export default InvoiceForm
