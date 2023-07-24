import { useEffect, useRef } from 'react'

const usePrevious = <T>(value: T) => {
  const previousValueRef = useRef<T>()

  useEffect(() => {
    previousValueRef.current = value
  }, [value])

  return previousValueRef.current
}

export default usePrevious
