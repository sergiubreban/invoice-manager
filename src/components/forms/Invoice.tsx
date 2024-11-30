import { Box, Button, Checkbox, FormControl, FormLabel, Input, Wrap, WrapItem } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { usePdf, useSeriesColRef, useUpdateDoc } from '../../Hooks'
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete'
import { useEffect, useMemo, useState } from 'react'
import { CompanyType } from '../../types'
import { useMyClients } from '../../Context/MyClients'
import { useMyCompanies } from '../../Context/MyCompanies'
import { useCollection } from 'react-firebase-hooks/firestore'
import ReactDatePicker from 'react-datepicker'
import { addDoc } from 'firebase/firestore'
import { defaultPDFProps } from '../../Hooks/usePdf'

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

  const [invoiceNumber, setInvoiceNumber] = useState(21)
  const [dueDate, setDueDate] = useState<Date | null>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date
  })
  const [invoiceLines, setInvoiceLines] = useState<any[]>([{}])
  const { createPdf } = usePdf()
  const clientRef = useSeriesColRef()
  const [value] = useCollection(clientRef)
  const updateSeriesDoc = useUpdateDoc('Series')
  const seriesModelRef = useSeriesColRef()
  const series: any = useMemo(() => value?.docs?.map((doc) => ({ id: doc.id as string, ...doc.data() })), [value])
  const [includeTva, setIncludeTva] = useState(false)
  const [currency, setCurrency] = useState('GBP')
  const lastNum = useMemo(() => {
    const asd = series?.find((s: any) => s.name === selectedSeries)?.num ?? 0
    return asd
  }, [series, selectedSeries])

  useEffect(() => setInvoiceNumber(lastNum + 1), [lastNum])

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
        num: invoiceNumber,
        invDate: `Issue Date: ${issueDate?.toLocaleDateString()}`,
        invGenDate: `Due Date: ${dueDate?.toLocaleDateString()}`,
        header: includeTva ? [
          ...defaultPDFProps.invoice.header.slice(0, -1),
          { title: 'VAT' },
          defaultPDFProps.invoice.header[defaultPDFProps.invoice.header.length - 1]
        ] : defaultPDFProps.invoice.header,
        table: [
          ...invoiceLines.map((item, index) => {
            const row = [index + 1, item.service, item.price, item.quantity, item.unit]
            if (includeTva) {
              row.push(`${item.tva}%`)
            }
            const addedTva = (1 + Number(item.tva) / 100)

            row.push((item.price * item.quantity * (includeTva ? addedTva : 1)).toFixed(2))

            return row
          })
          // [1, service, price, quantity, unit, price * quantity],
          // [2, service, price, quantity, unit, price * quantity]
        ],
        invCurrency: currency,
        invTotal: `${invoiceLines.reduce((acc, curr) => {
          const addedTva = (1 + Number(curr.tva) / 100)
          const priceItem = ((curr.price * curr.quantity) * (includeTva ? addedTva : 1))
          // console.log(priceItem, typeof priceItem)
          return (acc + priceItem)
        }, 0).toFixed(2)}`
        // invTotal: `${price * quantity}`,
      },
    })
    const seriesDoc = series?.find((s: any) => s.name === selectedSeries)

    if (seriesDoc) {
      updateSeriesDoc(seriesDoc.id, {
        num: invoiceNumber,
      })
    } else {
      addDoc(seriesModelRef, { name: selectedSeries, num: invoiceNumber })
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
                setMyCompany(myCompanies.find((company) => `${company.name}-${company.id}` === val)!)
                return val
              }}
              openOnFocus
            >
              <AutoCompleteInput variant="filled" id="myCompany" name="myCompany" />
              <AutoCompleteList>
                {myCompanies.map((company, cid) => (
                  <AutoCompleteItem
                    key={`option-${cid}`}
                    value={`${company.name}-${company.id}`}
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

        <WrapItem>
          <FormControl>
            <FormLabel htmlFor="number">{'No'}</FormLabel>
            <Input
              id="number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(parseInt(e.target.value))}
              type="number"
            />
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
              <FormLabel htmlFor="currency">{'Currency'}</FormLabel>
              <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} type="string" />
            </FormControl>
          </WrapItem>

          <WrapItem>
            <FormControl>
              <FormLabel htmlFor="checkbox">{'Include TVA'}</FormLabel>
              <Checkbox id="checkbox" isChecked={includeTva} onChange={(e) => setIncludeTva(e.target.checked)}>
                {'Include TVA'}
              </Checkbox>
            </FormControl>
          </WrapItem>
        </Wrap>

        <ServicesForm includeTva={includeTva} invoiceLines={invoiceLines} setInvoiceLines={setInvoiceLines} />
        <WrapItem>
          <Button onClick={handleinvoiceGen}>{t('Generate Invoice')}</Button>
        </WrapItem>
      </Wrap>
    </form>
  )
}

const ServicesForm = (props: { invoiceLines: any[], setInvoiceLines: any, includeTva: boolean }) => {
  const { invoiceLines, setInvoiceLines, includeTva } = props
  return <Box >
    <Box >
      {invoiceLines.map((line: any, i: number) => <Box key={`${i}:${line.service}:${line.price}:${line.quantity}:${line.currency}:${line.unit}`}>
        <ServiceForm includeTva={includeTva} line={line} setInvoiceLine={(e) => setInvoiceLines((lines: any[]) => {
          lines.splice(i, 1, e)
          return lines
        })} />
        <Button mb='10' onClick={() => setInvoiceLines((l: any) => {
          l.splice(i, 1)
          return [...l]
        })}>Delete row</Button>
      </Box>)}
    </Box>
    <Button marginBottom='5' onClick={() => setInvoiceLines(((l: any) => [...l, {}]))}>Add more</Button>
  </Box>
}

const ServiceForm = (props: { includeTva: boolean, line: any, setInvoiceLine: (p: any) => void }) => {
  const { setInvoiceLine, line, includeTva } = props
  const [service, setService] = useState(line.service ?? '')
  const [price, setPrice] = useState(line.price ?? 500)
  const [quantity, setQuantity] = useState(line.quantity ?? 21)
  const [unit, setUnit] = useState(line.unit ?? 'days')
  const [tva, setTva] = useState(line.tva ?? 0)

  useEffect(() => {
    setInvoiceLine({ service, price, quantity, unit, tva })
  }, [service, price, quantity, unit, setInvoiceLine, tva])

  return <Wrap mb={10}>
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
        <FormLabel htmlFor="unit">{'Unit'}</FormLabel>
        <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} type="string" />
      </FormControl>
    </WrapItem>

    {includeTva && <WrapItem>
      <FormControl>
        <FormLabel htmlFor="tva">{'Tva'}</FormLabel>
        <Input id="tva" value={tva} onChange={(e) => setTva(e.target.value)} type="string" />
      </FormControl>
    </WrapItem>
    }
  </Wrap>
}

export default InvoiceForm
