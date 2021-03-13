import { Serializer } from '@app/utils/serizalizer';

export const isDeepEquality = (first: Record<string, any>, second: Record<string, any>): boolean => {
  return Serializer.serialize(first) === Serializer.serialize(second)
}