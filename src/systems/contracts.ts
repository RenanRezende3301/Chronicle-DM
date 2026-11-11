import type { ZodType } from 'zod'

export type GameSystemKey = string

export type ActorSummary = {
  name: string
  subtitle: string
  portraitUrl?: string
}

export type CharacterRepositoryData<TCharacter> = {
  systemKey: GameSystemKey
  schemaVersion: number
  character: TCharacter
}

export type CharacterDomain<TCharacter> = {
  schema: ZodType<TCharacter>
  currentSchemaVersion: number
  createEmpty: () => TCharacter
  parse: (input: unknown) => TCharacter
  summarize: (character: TCharacter) => ActorSummary
}

export type GameSystemModule<
  TCharacter,
  TCatalogs extends Record<string, unknown>,
  TRules extends Record<string, unknown>,
> = {
  key: GameSystemKey
  label: string
  character: CharacterDomain<TCharacter>
  catalogs: TCatalogs
  rules: TRules
}
