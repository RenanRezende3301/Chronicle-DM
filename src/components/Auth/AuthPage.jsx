import { useState } from 'react'
import { ArrowLeft, BookOpen, KeyRound, LogIn, Shield, UserPlus } from 'lucide-react'
import { useAuth } from '../../context/useAuth.js'
import styles from './AuthPage.module.css'

function AuthPage() {
  const {
    login,
    register,
    requestPasswordRecovery,
    authError,
    setAuthError,
  } = useAuth()
  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    preferredMode: 'player',
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authNotice, setAuthNotice] = useState('')

  const isRegistering = mode === 'register'
  const isRecovering = mode === 'recovery'

  function updateField(field, value) {
    setAuthError('')
    setAuthNotice('')
    setFormData((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setAuthError('')

    try {
      if (isRecovering) {
        await requestPasswordRecovery(formData.email)
        setAuthNotice(
          'Se existir uma conta para este e-mail, enviaremos um link seguro para redefinir a senha. Verifique também a caixa de spam.',
        )
      } else if (isRegistering) {
        const result = await register(formData)

        if (result?.needsEmailConfirmation) {
          setAuthNotice(
            'Conta criada. Confirme o email e depois entre com sua senha.',
          )
          setMode('login')
        }
      } else {
        await login(formData)
      }
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.authShell}>
      <section className={styles.authPanel}>
        <div className={styles.brandMark} aria-hidden="true" />
        <div className={styles.authHeader}>
          <span>Chronicle</span>
          <h1>{isRecovering ? 'Recuperar acesso' : 'V5'}</h1>
          <p>
            {isRecovering
              ? 'Informe seu e-mail para receber um link único de redefinição de senha.'
              : 'Uma conta para suas fichas, crônicas, cenas e anotações.'}
          </p>
        </div>

        {!isRecovering ? (
          <div className={styles.modeSwitch} aria-label="Modo de acesso">
            <button
              type="button"
              className={!isRegistering ? styles.modeActive : ''}
              onClick={() => setMode('login')}
            >
              <LogIn size={16} />
              Entrar
            </button>
            <button
              type="button"
              className={isRegistering ? styles.modeActive : ''}
              onClick={() => setMode('register')}
            >
              <UserPlus size={16} />
              Criar conta
            </button>
          </div>
        ) : null}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <label>
                Seu nome na mesa
                <input
                  value={formData.displayName}
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
                  value={formData.username}
                  onChange={(event) =>
                    updateField(
                      'username',
                      event.target.value.toLowerCase().replaceAll(/[^a-z0-9_]/g, ''),
                    )
                  }
                  placeholder="Ex.: renan_rezende"
                  required
                />
                <small>Seu identificador público. Use letras minúsculas, números ou _; sem espaços.</small>
              </label>

              <fieldset className={styles.experiencePicker}>
                <legend>Quero começar como</legend>
                <button
                  type="button"
                  className={
                    formData.preferredMode === 'player'
                      ? styles.experienceActive
                      : ''
                  }
                  onClick={() => updateField('preferredMode', 'player')}
                >
                  <BookOpen size={18} />
                  <span>
                    <strong>Jogador</strong>
                    <small>Criar e gerenciar personagens</small>
                  </span>
                </button>
                <button
                  type="button"
                  className={
                    formData.preferredMode === 'gm'
                      ? styles.experienceActive
                      : ''
                  }
                  onClick={() => updateField('preferredMode', 'gm')}
                >
                  <Shield size={18} />
                  <span>
                    <strong>Narrador</strong>
                    <small>Abrir o Escudo e criar crônicas</small>
                  </span>
                </button>
              </fieldset>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="voce@email.com"
              required
            />
          </label>

          {!isRecovering ? (
            <label>
              Senha
              <input
                type="password"
                value={formData.password}
                onChange={(event) => updateField('password', event.target.value)}
                minLength={8}
                placeholder="Minimo de 8 caracteres"
                required
              />
            </label>
          ) : null}

          {authError && <p className={styles.authError}>{authError}</p>}
          {authNotice && <p className={styles.authNotice}>{authNotice}</p>}

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isRecovering
                ? 'Enviando...'
                : 'Acessando...'
              : isRecovering
                ? 'Enviar link de recuperação'
              : isRegistering
                ? 'Criar conta'
                : 'Entrar no Chronicle'}
          </button>

          {isRecovering ? (
            <button
              className={styles.textButton}
              type="button"
              onClick={() => {
                setAuthError('')
                setAuthNotice('')
                setMode('login')
              }}
            >
              <ArrowLeft size={15} />
              Voltar para entrar
            </button>
          ) : !isRegistering ? (
            <button
              className={styles.textButton}
              type="button"
              onClick={() => {
                setAuthError('')
                setAuthNotice('')
                setMode('recovery')
              }}
            >
              <KeyRound size={15} />
              Esqueceu a senha?
            </button>
          ) : null}
        </form>
      </section>
    </main>
  )
}

export default AuthPage
