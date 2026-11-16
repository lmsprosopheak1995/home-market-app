import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { listVerifiedOwners } from '../lib/verification'

const VerifiedContext = createContext({ isVerified: () => false, reload: () => {} })

export function VerifiedProvider({ children }) {
  const [owners, setOwners] = useState([])

  const reload = useCallback(() => {
    listVerifiedOwners().then(setOwners).catch(() => {})
  }, [])
  useEffect(() => { reload() }, [reload])

  const value = useMemo(() => {
    const set = new Set(owners)
    return { isVerified: (owner) => Boolean(owner) && set.has(owner), reload }
  }, [owners, reload])

  return <VerifiedContext.Provider value={value}>{children}</VerifiedContext.Provider>
}

export const useVerified = () => useContext(VerifiedContext)
