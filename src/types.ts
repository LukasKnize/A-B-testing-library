export interface ActionType {
  experimentId: string
  variant: boolean | undefined
  timeOfAction: number
  message: object
}

export interface ExperimentContextType {
  experimentId: string
  variant: boolean | undefined
  timeOfRender: number
  actions?: ActionType[]
}

export interface ExperimentRegistrationType {
  experimentId: string
  variant: boolean | undefined
  timeOfRender: number
}

export interface LogExperiment {
  experimentId: string
  variant: boolean | undefined
}

export interface ErrorLogType {
  error: Error
  experiments: LogExperiment[]
}
