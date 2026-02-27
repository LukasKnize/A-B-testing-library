import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useCallback
} from 'react'
import {
  ActionType,
  ExperimentContextType,
  ExperimentRegistrationType
} from './types'

interface ExperimentContextValue {
  experiments: ExperimentContextType[]
  registerExperiment: (data: ExperimentRegistrationType) => void
  registerAction: (experimentId: string, message: object) => ActionType
}

const ExperimentContext = createContext<ExperimentContextValue | undefined>(
  undefined
)

export const ExperimentProvider = ({ children }: PropsWithChildren) => {
  const [experiments, setExperiments] = useState<ExperimentContextType[]>([])

  const registerExperiment = useCallback(
    (data: ExperimentRegistrationType) => {
      if (
        !experiments.some(
          (experiment) => experiment.experimentId === data.experimentId
        )
      ) {
        const experiment = { ...data }

        setExperiments((prev) => [...prev, experiment])
      }
    },
    [experiments]
  )

  const registerAction = useCallback(
    (experimentId: string, message: object) => {
      const index = experiments.findIndex(
        (experiment) => experiment.experimentId === experimentId
      )
      if (index === -1) {
        throw new Error(
          `Action could not be registered. No experiment with ID: ${experimentId}.`
        )
      }

      const experiment = experiments[index]
      const newAction: ActionType = {
        experimentId: experiment.experimentId,
        variant: experiment.variant,
        timeOfAction: Date.now(),
        message
      }

      const updatedExperiment = {
        ...experiment,
        actions: experiment.actions
          ? [...experiment.actions, newAction]
          : [newAction]
      }

      const newExperiments = [
        ...experiments.slice(0, index),
        updatedExperiment,
        ...experiments.slice(index + 1)
      ]

      setExperiments(newExperiments)
      return newAction
    },
    [experiments]
  )

  const value = {
    experiments,
    registerExperiment,
    registerAction
  }

  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  )
}

export const useExperiment = () => {
  const context = useContext(ExperimentContext)
  if (!context) {
    throw new Error('useExperiment must be used within an ExperimentProvider')
  }
  return {
    experiments: context.experiments,
    registerAction: context.registerAction
  }
}

export const useInternalExperiment = () => {
  const context = useContext(ExperimentContext)
  if (!context) {
    throw new Error('useExperiment must be used within an ExperimentProvider')
  }
  return context.registerExperiment
}

export const useGetExperiments = () => {
  const context = useContext(ExperimentContext)
  if (!context) return []
  return context.experiments
}
