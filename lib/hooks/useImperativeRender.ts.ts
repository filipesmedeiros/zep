import { useState } from 'react'

const useImperativeRender = () => {
  const [, setValue] = useState(0)
  return () => setValue(value => value + 1)
}

export default useImperativeRender
