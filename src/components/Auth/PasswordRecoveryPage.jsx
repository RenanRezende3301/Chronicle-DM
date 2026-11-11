import { CheckCircle2, LogOut, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/useAuth.js'
import styles from './AuthPage.module.css'

function PasswordRecoveryPage() {
  const {
    completePasswordRecovery,
    finishPasswordRecovery,
    logout,
  } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [otherSessionsClosed, setOtherSessionsClosed] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (newPassword.length < 8) {
      setErrorMessage('A nova senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (newPassword !== confirmation) {
      setErrorMessage('A confirmação da nova senha não coincide.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await completePasswordRecovery(newPassword)
      setNewPassword('')
      setConfirmation('')
      setOtherSessionsClosed(result.otherSessionsClosed)
      setIsComplete(true)
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível redefinir a senha.')
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
          <h1>Nova senha</h1>
          <p>Este link é temporário e só pode ser usado para redefinir sua senha.</p>
        </div>

        {isComplete ? (
          <div className={styles.recoverySuccess}>
            <CheckCircle2 size={26} aria-hidden="true" />
            <div>
              <strong>Senha redefinida com sucesso.</strong>
              <p>
                {otherSessionsClosed
                  ? 'As outras sessões da conta foram encerradas por segurança.'
                  : 'A nova senha já está ativa. Revise as outras sessões da conta quando puder.'}
              </p>
            </div>
            <button className={styles.submitButton} type="button" onClick={finishPasswordRecovery}>
              Abrir Chronicle
            </button>
          </div>
        ) : (
          <form className={styles.authForm} onSubmit={handleSubmit}>
            <label>
              Nova senha
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                placeholder="Mínimo de 8 caracteres"
                required
              />
            </label>
            <label>
              Confirmar nova senha
              <input
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            {errorMessage ? <p className={styles.authError}>{errorMessage}</p> : null}
            <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Redefinindo...' : 'Salvar nova senha'}
            </button>
          </form>
        )}

        <aside className={styles.recoveryHint}>
          <ShieldCheck size={17} aria-hidden="true" />
          <span>Se você não solicitou esta alteração, feche esta página e ignore o e-mail.</span>
        </aside>

        {!isComplete ? (
          <button className={styles.textButton} type="button" onClick={logout}>
            <LogOut size={15} />
            Cancelar e voltar ao login
          </button>
        ) : null}
      </section>
    </main>
  )
}

export default PasswordRecoveryPage
