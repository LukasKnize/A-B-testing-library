import { PropsWithChildren } from 'react'
import { ErrorLogType } from './types'
import { useGetExperiments } from './ContextProvider'

export type ErrorLoggerProviderProps = {
  callback: (ErrorLogs: ErrorLogType) => void
}

export const ErrorLoggerProvider = ({
  children,
  callback
}: ErrorLoggerProviderProps & PropsWithChildren) => {
  const experiments = useGetExperiments()
  window.addEventListener('error', (event: ErrorEvent) => {
    const errorLog: ErrorLogType = {
      error: event.error,
      experiments: experiments.map(({ experimentId, variant }) => ({
        experimentId: experimentId,
        variant: variant
      }))
    }
    callback(errorLog)
  })
  return children
}
