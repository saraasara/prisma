// This is copied from photon/runtime/utils. It needs to be moved into a separate package
import indent from 'indent-string'

export type ConnectorType = 'mysql' | 'mongo' | 'sqlite' | 'postgresql'

export interface GeneratorConfig {
  name: string
  output: string | null
  provider: string
  config: Record<string, string>
}

export type Datasource =
  | string
  | {
      url: string
      [key: string]: any | undefined
    }

export interface InternalDatasource {
  name: string
  connectorType: ConnectorType
  url: string
  config: any
}

// We could do import { EnvValue } from '../../isdlToDatamodel2'
// but we don't want to pull that into the runtime build
export interface EnvValue {
  fromEnvVar: null | string
  value: string
}

export function printDatasources(internalDatasources: InternalDatasource[]): string {
  return internalDatasources.map(d => String(new InternalDataSourceClass(d))).join('\n\n')
}

const tab = 2

class InternalDataSourceClass {
  constructor(private readonly dataSource: InternalDatasource) {}

  public toString() {
    const { dataSource } = this
    const obj = {
      provider: dataSource.connectorType,
      url: dataSource.url,
    }
    if (dataSource.config && typeof dataSource.config === 'object') {
      Object.assign(obj, dataSource.config)
    }
    return `datasource ${dataSource.name} {
${indent(printDatamodelObject(obj), tab)}
}`
  }
}

export function printDatamodelObject(obj) {
  const maxLength = Object.keys(obj).reduce((max, curr) => Math.max(max, curr.length), 0)
  return Object.entries(obj)
    .map(([key, value]) => `${key.padEnd(maxLength)} = ${JSON.stringify(value)}`)
    .join('\n')
}
