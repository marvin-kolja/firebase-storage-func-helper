type NonNegativeInteger<T extends number> = `${T}` extends
  | `-${string}`
  | `${string}.${string}`
  ? never
  : T

type SizeMatcherConfig<
  Min extends number | undefined,
  Max extends number | undefined,
> = {
  min?: Min extends number ? NonNegativeInteger<Min> : undefined
  max?: Max extends number ? NonNegativeInteger<Max> : undefined
}

type SizeMatchResult = number

const createSizeMatcher = <
  Min extends number | undefined,
  Max extends number | undefined,
>(
  config: SizeMatcherConfig<Min, Max>,
) => {
  if (config.max !== undefined && config.max <= 0) {
    throw new Error('max should be greater than 0')
  }

  if (config.min !== undefined && config.min <= 0) {
    throw new Error('min should be greater than 0')
  }

  if (config.max && config.min) {
    if (config.max < config.min) {
      throw new Error('max should be greater or equal than min')
    }
  }

  return (size: number | undefined) => {
    if (!size) {
      return false
    }

    if (config.min && size <= config.min) {
      return false
    }
    if (config.max && size >= config.max) {
      return false
    }
    return size
  }
}

export { createSizeMatcher }
export type { SizeMatcherConfig, SizeMatchResult }
