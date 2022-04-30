import { createContext, FC, useContext, useMemo } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useCompanyColRef } from '../Hooks'
import { CompanyType } from '../types'

interface MyCompaniesContextType {
  myCompanies: CompanyType[]
  registeredAccounts: string[]
  loading?: boolean
  error?: any
}
export const MyCompaniesContext = createContext<MyCompaniesContextType>({
  registeredAccounts: [],
  myCompanies: [],
})

export const MyCompaniesProvider: FC = ({ children }) => {
  const companyRef = useCompanyColRef()
  const [value, loading, error] = useCollection(companyRef)

  const { myCompanies = [], registeredAccounts = [] } = useMemo(
    () =>
      value?.docs?.reduce(
        (acc, doc) => {
          const data = doc.data()
          acc.myCompanies.push({ id: doc.id as string, ...data })
          acc.registeredAccounts.push(data.cui)

          return acc
        },
        { myCompanies: [], registeredAccounts: [] } as any
      ) ?? {},
    [value]
  )

  const contextValue = {
    myCompanies,
    loading,
    error,
    registeredAccounts,
  }

  return <MyCompaniesContext.Provider value={contextValue}>{children}</MyCompaniesContext.Provider>
}

export const useMyCompanies = () => useContext(MyCompaniesContext)
