import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccountName, getFullAccountDetails } from '../services/common';

type SlimAccount = { AccountId: number; AccountCode: number; AccountName: string };
type FullAccount  = any;         // shape returned by getFullAccountDetails()

type Ctx = {
  accounts: SlimAccount[];
  activeId?: number;
  full: FullAccount | any;
  loadingFull: boolean;
  selectAccount: (id: number) => void;
  getAccountId: () => Promise<void>;
};

const AccountCtx = createContext<Ctx | undefined>(undefined);
export const useAccount = () => {
  const ctx = useContext(AccountCtx);
  if (!ctx) throw new Error('useAccount must be used inside AccountProvider');
  return ctx;
};

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<SlimAccount[]>([]);
  const [activeId, setActiveId]  = useState<number | undefined>(undefined);
  const [full, setFull]          = useState<FullAccount>();
  const [loadingFull, setLoadingFull] = useState(false);
  console.log('account provider')

  useEffect(() => { getAccountId(); }, []);
  useEffect(() => { if (activeId)
     loadFull(activeId); 
    console.log('[AccountProvider] activeId changed:', activeId);
    }, [activeId]);

  /* 1️ fetch slim list once (or when forced) */
const getAccountId = async () => {
  try {
    console.log('[AccountProvider] Starting refresh...');
    const res = await getAccountName();
    console.log('[AccountProvider] Accounts:', res);

    setAccounts(res);
    const saved = +(await AsyncStorage.getItem('activeAccountId') || '') || res?.[0]?.AccountId;
    console.log('[AccountProvider] Resolved activeId:', saved);
    setActiveId(saved);
  } catch (err) {
    console.error('[AccountProvider] refresh() failed:', err);
  }
};


  /* 2️ full details whenever activeId changes */
const loadFull = async (id: number) => {
  try {
    setLoadingFull(true); 
    const details = await getFullAccountDetails(id);
    setFull(details);
    await AsyncStorage.setItem('activeAccountId', String(id));
  } catch (e) {
    console.error(' Failed to load full account:', e);
  } finally {
    setLoadingFull(false); 
  }
};

  /* run once at mount */


  const ctx: Ctx = {
    accounts,
    activeId,
    full,
    loadingFull,
    selectAccount: setActiveId,
    getAccountId,
  };

  return <AccountCtx.Provider value={ctx}>{children}</AccountCtx.Provider>;
};
