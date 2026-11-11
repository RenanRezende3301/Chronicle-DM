import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bold, Italic, List, Plus, Save, Search, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useToast } from '../../hooks/useToast.js'
import { useUserData } from '../../context/useUserData.js'
import styles from './Notes.module.css'

function createNote(overrides = {}) {
  const now = new Date().toISOString()

  return {
    id: nanoid(),
    title: 'Nova nota',
    content: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

function Notes() {
  const { appState, updateAppState } = useUserData()
  const notes = appState.notes
  const toast = useToast()
  const [activeNoteId, setActiveNoteId] = useState(() => notes[0]?.id ?? null)
  const [searchTerm, setSearchTerm] = useState('')
  const currentActiveNoteId =
    activeNoteId && notes.some((note) => note.id === activeNoteId)
      ? activeNoteId
      : notes[0]?.id ?? null

  const activeNote = useMemo(
    () => notes.find((note) => note.id === currentActiveNoteId) ?? null,
    [currentActiveNoteId, notes],
  )

  const filteredNotes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return normalizedSearch
      ? notes.filter((note) => note.title.toLowerCase().includes(normalizedSearch))
      : notes
  }, [notes, searchTerm])

  function handleCreateNote() {
    const note = createNote()
    updateAppState((currentState) => ({
      ...currentState,
      notes: [note, ...currentState.notes],
    }))
    setActiveNoteId(note.id)
    toast.success('Nota criada.', 'Registro atualizado')
  }

  function handleDeleteNote(noteId) {
    if (!window.confirm('Deletar esta nota?')) {
      return
    }

    updateAppState((currentState) => {
      const remainingNotes = currentState.notes.filter((note) => note.id !== noteId)

      if (activeNoteId === noteId) {
        setActiveNoteId(remainingNotes[0]?.id ?? null)
      }

      toast.info('Nota removida.', 'Registro atualizado')
      return {
        ...currentState,
        notes: remainingNotes,
      }
    })
  }

  const handlePersistNote = useCallback((noteId, updates) => {
    updateAppState((currentState) => ({
      ...currentState,
      notes: currentState.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              title: updates.title.trim() || 'Nota sem titulo',
              content: updates.content,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    }))
  }, [updateAppState])
  const handleNoteSaved = useCallback(() => {
    toast.success('Nota salva automaticamente.', 'Autosave')
  }, [toast])

  return (
    <section className={styles.module}>
      <aside className={styles.noteList}>
        <div className={styles.sidebarHeader}>
          <span>Sessao</span>
          <button type="button" onClick={handleCreateNote}>
            <Plus size={16} />
            Nova nota
          </button>
        </div>

        <label className={styles.searchBox}>
          <Search size={16} />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por titulo"
          />
        </label>

        <div className={styles.notes}>
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              type="button"
            className={note.id === currentActiveNoteId ? styles.noteActive : ''}
              onClick={() => setActiveNoteId(note.id)}
            >
              <strong>{note.title}</strong>
              <small>{new Date(note.updatedAt).toLocaleString('pt-BR')}</small>
            </button>
          ))}

          {!filteredNotes.length && (
            <div className={styles.emptyList}>Nenhuma nota encontrada.</div>
          )}
        </div>
      </aside>

      <article className={styles.editor}>
        <header className={styles.editorHeader}>
          <div>
            <span className={styles.eyebrow}>Notas do Narrador</span>
            <h1>Registro de Sessao</h1>
          </div>
        </header>

        {activeNote ? (
          <NoteEditor
            key={activeNote.id}
            note={activeNote}
            onDelete={handleDeleteNote}
            onPersist={handlePersistNote}
            onSaved={handleNoteSaved}
          />
        ) : (
          <div className={styles.emptyEditor}>
            <h2>Nenhuma nota selecionada</h2>
            <button type="button" onClick={handleCreateNote}>
              <Plus size={16} />
              Criar primeira nota
            </button>
          </div>
        )}
      </article>
    </section>
  )
}

function NoteEditor({ note, onDelete, onPersist, onSaved }) {
  const editorRef = useRef(null)
  const [draftTitle, setDraftTitle] = useState(note.title)
  const [draftContent, setDraftContent] = useState(note.content)
  const [saveState, setSaveState] = useState('salvo')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onPersist(note.id, {
        title: draftTitle,
        content: draftContent,
      })
      setSaveState('salvo')
      if (draftTitle !== note.title || draftContent !== note.content) {
        onSaved()
      }
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [draftContent, draftTitle, note.content, note.id, note.title, onPersist, onSaved])

  function updateTitle(value) {
    setDraftTitle(value)
    setSaveState('salvando')
  }

  function updateContent(value) {
    setDraftContent(value)
    setSaveState('salvando')
  }

  function applyFormatting(type) {
    const textarea = editorRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = draftContent.slice(start, end)
    let nextText = selected
    let cursorOffset = 0

    if (type === 'bold') {
      nextText = `**${selected || 'texto'}**`
      cursorOffset = 2
    }

    if (type === 'italic') {
      nextText = `*${selected || 'texto'}*`
      cursorOffset = 1
    }

    if (type === 'list') {
      const source = selected || 'item'
      nextText = source
        .split('\n')
        .map((line) => `- ${line}`)
        .join('\n')
      cursorOffset = 2
    }

    const nextContent =
      draftContent.slice(0, start) + nextText + draftContent.slice(end)
    updateContent(nextContent)

    window.requestAnimationFrame(() => {
      textarea.focus()
      const cursor = start + (selected ? nextText.length : cursorOffset)
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  function handleEditorKeyDown(event) {
    if (!event.ctrlKey && !event.metaKey) {
      return
    }

    if (event.key.toLowerCase() === 'b') {
      event.preventDefault()
      applyFormatting('bold')
    }

    if (event.key.toLowerCase() === 'i') {
      event.preventDefault()
      applyFormatting('italic')
    }

    if (event.key.toLowerCase() === 'l') {
      event.preventDefault()
      applyFormatting('list')
    }
  }

  return (
    <div className={styles.editorSurface}>
      <div className={styles.titleRow}>
        <input
          className={styles.titleInput}
          value={draftTitle}
          onChange={(event) => updateTitle(event.target.value)}
          placeholder="Titulo da nota"
        />
        <span className={styles.saveState}>
          <Save size={15} />
          {saveState}
        </span>
      </div>

      <div className={styles.formatToolbar} aria-label="Formatacao">
        <button type="button" onClick={() => applyFormatting('bold')} title="Negrito">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => applyFormatting('italic')} title="Italico">
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => applyFormatting('list')} title="Lista">
          <List size={16} />
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDelete(note.id)}
          title="Deletar nota"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <textarea
        ref={editorRef}
        value={draftContent}
        onChange={(event) => updateContent(event.target.value)}
        onKeyDown={handleEditorKeyDown}
        placeholder="Anote pistas, nomes, consequencias e decisoes da sessao..."
      />
    </div>
  )
}

export default Notes
