import { BookOpen, Shield } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/useAuth.js'
import styles from './AuthPage.module.css'

function ProfileSetupPage() {
  const { completeProfile, logout, user } = useAuth()
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    username: '',
    preferredMode: 'player',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrorMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)

    try {
      await completeProfile(form)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className={styles.authShell}>
      <section className={styles.authPanel}>
        <div className={styles.brandMark} aria-hidden="true" />
        <div className={styles.authHeader}>
          <span>Chronicle</span>
          <h1>Seu perfil</h1>
          <p>Escolha como outras pessoas encontrarão você nas crônicas.</p>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <label>
            Seu nome na mesa
            <input
              maxLength={80}
              value={form.displayName}
              onChange={(event) => updateField('displayName', event.target.value)}
              placeholder="Ex.: Renan Rezende"
              required
            />
            <small>É o nome que jogadores e narradores verão nas crônicas.</small>
          </label>
          <label>
            @usuário único
            <input
              autoCapitalize="none"
              maxLength={32}
              pattern="[a-z0-9_]{3,32}"
              value={form.username}
              onChange={(event) =>
                updateField(
                  'username',
                  event.target.value.toLowerCase().replaceAll(/[^a-z0-9_]/g, ''),
                )
              }
              placeholder="Ex.: renan_rezende"
              required
            />
            <small>Seu identificador público: letras minúsculas, números e _; sem espaços.</small>
          </label>

          <fieldset className={styles.experiencePicker}>
            <legend>Quero começar como</legend>
            <button
              type="button"
              className={
                form.preferredMode === 'player' ? styles.experienceActive : ''
              }
              onClick={() => updateField('preferredMode', 'player')}
            >
              <BookOpen size={18} />
              <span>
                <strong>Jogador</strong>
                <small>Biblioteca de personagens</small>
              </span>
            </button>
            <button
              type="button"
              className={
                form.preferredMode === 'gm' ? styles.experienceActive : ''
              }
              onClick={() => updateField('preferredMode', 'gm')}
            >
              <Shield size={18} />
              <span>
                <strong>Narrador</strong>
                <small>Escudo e crônicas</small>
              </span>
            </button>
          </fieldset>

          {errorMessage ? <p className={styles.authError}>{errorMessage}</p> : null}

          <button className={styles.submitButton} type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Concluir perfil'}
          </button>
          <button type="button" onClick={logout}>
            Sair e usar outra conta
          </button>
        </form>
      </section>
    </main>
  )
}

export default ProfileSetupPage
