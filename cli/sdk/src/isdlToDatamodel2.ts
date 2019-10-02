import { ISDL } from 'prisma-datamodel'
import { dmmfToDml } from './engineCommands'
import { isdlToDmmfDatamodel } from './isdlToDmmf'

export type ConnectorType = 'mysql' | 'mongo' | 'sqlite' | 'postgresql'

export interface ConfigMetaFormat {
  datasources: DataSource[]
  generators: GeneratorConfig[]
}

export type Dictionary<T> = {
  [key: string]: T
}

export interface GeneratorConfig {
  name: string
  output: string | null
  provider: string
  config: Dictionary<string>
  pinnedPlatform: null | EnvValue
  platforms: string[] // check if new commit is there
}

export interface EnvValue {
  fromEnvVar: null | string
  value: string
}

export interface DataSource {
  name: string
  connectorType: ConnectorType
  url: EnvValue
  config: { [key: string]: string }
}

export async function isdlToDatamodel2(
  isdl: ISDL,
  datasources: DataSource[],
  generators: GeneratorConfig[] = [],
) {
  const { dmmf } = await isdlToDmmfDatamodel(isdl)

  const result = await dmmfToDml({
    dmmf,
    config: { datasources, generators: generators.map(ensureNewFields) },
  })

  return result
}

function ensureNewFields(generator) {
  return {
    platforms: [],
    pinnedPlatform: null,
    ...generator,
  }
}
