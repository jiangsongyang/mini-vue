import { camelize, toHandlerKey } from '../../shared'

export const emit = (instance, event: string, ...arg: unknown[]) => {
  const { props } = instance
  const handleName = toHandlerKey(camelize(event))
  const handler = props[handleName]
  handler && handler(...arg)
}
