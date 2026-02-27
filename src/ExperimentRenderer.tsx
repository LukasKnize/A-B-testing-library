import { ReactElement, useEffect } from 'react'
import { useInternalExperiment } from './ContextProvider'

export type ExperimentRendererProps = {
  control?: ReactElement
  experiment: ReactElement
  variant: boolean | undefined
  experimentId: string
}

export const ExperimentRenderer = ({
  experiment,
  variant,
  control,
  experimentId
}: ExperimentRendererProps) => {
  const registerExperiment = useInternalExperiment()

  useEffect(() => {
    registerExperiment({
      experimentId: experimentId,
      variant: variant,
      timeOfRender: Date.now()
    })
  }, [experimentId, variant, registerExperiment])

  if (variant === true) {
    return experiment
  } else {
    return control ?? null
  }
}
