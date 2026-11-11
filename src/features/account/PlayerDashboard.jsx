import {
  Archive,
  BookOpen,
  LogOut,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  UserRound,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth.js'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import {
  createCharacter,
  listMyCharacters,
  setCharacterArchived,
} from '../../services/supabaseChronicle2.js'
import { vtmV5System } from '../../systems/vtm-v5'
import CharacterCreator from './CharacterCreator.jsx'
import CharacterEditor from './CharacterEditor.jsx'
import styles from './PlayerDashboard.module.css'

function summarizeStoredCharacter(character) {
  try {
    return vtmV5System.character.summarize(
      vtmV5System.character.parse(character.character_data),
    )
  } catch {
    return {
      name: character.name || 'Ficha sem nome',
      subtitle: 'Ficha precisa ser revisada',
    }
  }
}

function getCharacterPortraitSource(character) {
  const data = character?.character_data && typeof character.character_data === 'object'
    ? character.character_data
    : {}
  const portraitPath = String(
    character?.portrait_path || data.portraitPath || data.portrait_path || '',
  ).trim()
  const externalUrl = String(
    data.portraitUrl || data.imageUrl || data.image_url || '',
  ).trim()

  return { portraitPath, externalUrl }
}

function CharacterPortrait({ character, name }) {
  const { portraitPath, externalUrl } = getCharacterPortraitSource(character)
  const libraryImageUrl = useLibraryPortraitUrl(portraitPath)
  const imageUrl = externalUrl || libraryImageUrl

  return (
    <div className={styles.portrait} aria-hidden="true">
      {imageUrl ? (
        <img src={imageUrl} alt="" />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

function PlayerDashboard() {
  const { user, logout, openAccountSettings, setActiveExperience } = useAuth()
  const [characters, setCharacters] = useState([])
  const [newCharacterName, setNewCharacterName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeCharacter, setActiveCharacter] = useState(null)
  const [activeCharacterView, setActiveCharacterView] = useState('editor')

  const loadCharacters = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      setCharacters(await listMyCharacters())
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    listMyCharacters()
      .then((nextCharacters) => {
        if (isActive) setCharacters(nextCharacters)
      })
      .catch((error) => {
        if (isActive) setErrorMessage(error.message)
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  async function handleCreateCharacter(event) {
    event.preventDefault()
    const name = newCharacterName.trim()

    if (!name) return

    setIsCreating(true)
    setErrorMessage('')

    try {
      const characterData = vtmV5System.character.createEmpty()
      characterData.name = name
      const character = await createCharacter({
        name,
        systemKey: vtmV5System.key,
        schemaVersion: vtmV5System.character.currentSchemaVersion,
        characterData,
        creationStatus: 'draft',
        creationStep: 0,
      })

      setCharacters((current) => [character, ...current])
      setNewCharacterName('')
      setActiveCharacter(character)
      setActiveCharacterView('creator')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  async function handleArchive(character) {
    if (!window.confirm(`Arquivar a ficha de ${character.name}?`)) return

    try {
      await setCharacterArchived(character.id, true)
      setCharacters((current) =>
        current.filter((candidate) => candidate.id !== character.id),
      )
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function handleCharacterSaved(savedCharacter) {
    setCharacters((current) =>
      current.map((character) =>
        character.id === savedCharacter.id ? savedCharacter : character,
      ),
    )
    setActiveCharacter(savedCharacter)
  }

  if (activeCharacter) {
    if (activeCharacterView === 'creator') {
      return (
        <CharacterCreator
          storedCharacter={activeCharacter}
          onExit={() => setActiveCharacter(null)}
          onSaved={handleCharacterSaved}
          onComplete={(savedCharacter) => {
            setActiveCharacter(savedCharacter)
            setActiveCharacterView('editor')
          }}
        />
      )
    }

    return (
      <CharacterEditor
        storedCharacter={activeCharacter}
        onBack={() => setActiveCharacter(null)}
        onSaved={handleCharacterSaved}
      />
    )
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span>Chronicle</span>
          <strong>Personagens</strong>
        </div>
        <div className={styles.account}>
          <UserRound size={17} />
          <span>
            <strong>{user?.displayName}</strong>
            <small>@{user?.username}</small>
          </span>
        </div>
        <button type="button" onClick={() => setActiveExperience('gm')}>
          <Shield size={17} />
          Abrir Escudo
        </button>
        <button
          type="button"
          aria-label="Configurações da conta"
          title="Configurações da conta"
          onClick={openAccountSettings}
        >
          <Settings size={17} />
          Conta
        </button>
        <button type="button" aria-label="Sair da conta" onClick={logout}>
          <LogOut size={17} />
          Sair
        </button>
      </header>

      <section className={styles.hero}>
        <div>
          <span>Biblioteca pessoal</span>
          <h1>Seus personagens</h1>
          <p>
            Crie fichas completas, compartilhe com suas crônicas e mantenha a
            progressão em um único lugar.
          </p>
        </div>
        <form className={styles.createForm} onSubmit={handleCreateCharacter}>
          <label htmlFor="new-character-name">Começar uma nova ficha VTM V5</label>
          <div>
            <input
              id="new-character-name"
              maxLength={120}
              placeholder="Nome do personagem"
              value={newCharacterName}
              onChange={(event) => setNewCharacterName(event.target.value)}
              required
            />
            <button type="submit" disabled={isCreating}>
              <Plus size={17} />
              {isCreating ? 'Criando...' : 'Criar ficha'}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.library}>
        <header>
          <div>
            <BookOpen size={19} />
            <h2>Fichas ativas</h2>
            <span>{characters.length}</span>
          </div>
          <button
            type="button"
            title="Atualizar fichas"
            aria-label="Atualizar fichas"
            onClick={loadCharacters}
            disabled={isLoading}
          >
            <RefreshCw size={16} />
          </button>
        </header>

        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

        {isLoading ? (
          <p className={styles.empty}>Carregando sua biblioteca...</p>
        ) : characters.length ? (
          <div className={styles.grid}>
            {characters.map((character) => {
              const summary = summarizeStoredCharacter(character)

              return (
                <article className={styles.card} key={character.id}>
                  <CharacterPortrait character={character} name={summary.name} />
                  <div className={styles.cardBody}>
                    <small>{vtmV5System.label}</small>
                    <h3>{summary.name}</h3>
                    <p>{summary.subtitle || 'Criação ainda não iniciada'}</p>
                    <span>Ficha v{character.schema_version}</span>
                    <button
                      className={styles.openButton}
                      type="button"
                      onClick={() => {
                        setActiveCharacter(character)
                        setActiveCharacterView(
                          character.creation_status === 'draft' ? 'creator' : 'editor',
                        )
                      }}
                    >
                      {character.creation_status === 'draft'
                        ? 'Continuar criação'
                        : 'Abrir ficha'}
                    </button>
                  </div>
                  <button
                    className={styles.archiveButton}
                    type="button"
                    title="Arquivar ficha"
                    aria-label={`Arquivar ${summary.name}`}
                    onClick={() => handleArchive(character)}
                  >
                    <Archive size={16} />
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen size={30} />
            <strong>Nenhuma ficha criada</strong>
            <p>Use o campo acima para iniciar seu primeiro personagem.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default PlayerDashboard
