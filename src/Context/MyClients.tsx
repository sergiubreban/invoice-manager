import { createContext, FC, useContext, useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useClientColRef } from '../Hooks';
import { CompanyType } from '../types';

interface MyClientsContextType {
  myClients: CompanyType[],
  registeredAccounts: string[],
  loading?: boolean,
  error?: any,
}

export const MyClientsContext = createContext<MyClientsContextType>({
  registeredAccounts: [],
  myClients: [],
});

export const MyClientsProvider: FC = ({ children }) => {
  const clientRef = useClientColRef();
  const [value, loading, error] = useCollection(clientRef);

  const { myClients = [], registeredAccounts = [] } = useMemo(() => value?.docs?.reduce((acc, doc) => {
    const data = doc.data();
    acc.myClients.push({ id: doc.id as string, ...data })
    acc.registeredAccounts.push(data.cui);

    return acc;
  }, { myClients: [], registeredAccounts: [] } as any) ?? {}, [value]);

  const contextValue = {
    myClients,
    loading,
    error,
    registeredAccounts
  }

  return <MyClientsContext.Provider value={contextValue} > {children}</MyClientsContext.Provider >;
};

export const useMyClients = () => useContext(MyClientsContext);