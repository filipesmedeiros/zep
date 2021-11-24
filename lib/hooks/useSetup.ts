import { useEffect, useState } from 'react'

/**
 * *please* remeber to memoize the setup function :)
 * @param setup the setup function to run
 * @param skip make this `true` if you want to skip this setup
 * @returns true if still setting this up
 */
const useSetup = (setup: () => Promise<void> | void, skip?: boolean) => {
  const [settingUp, setSettingUp] = useState(true)
  useEffect(() => {
    if (skip) return
    const doSetup = async () => {
      await setup()
      setSettingUp(false)
    }
    doSetup()
  }, [setup, skip])
  return settingUp
}

export default useSetup
