import { Eye, EyeOff, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import Modal from '../../components/common/Modal.jsx'
import { useAuth } from '../../context/useAuth.js'
import {
  changeSupabasePassword,
  requestSupabaseEmailChange,
} from '../../services/supabaseAuth.js'
import styles from './AccountSettingsDialog.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function maskEmail(email) {
  const [localPart, domain] = String(email || '').split('@')
  if (!localPart || !domain) return 'e-mail indisponível'
  const visible = localPart.length < 3 ? localPart.slice(0, 1) : localPart.slice(0, 2)
  return `${visible}${'•'.repeat(Math.max(2, localPart.length - visible.length))}@${domain}`
}

function PasswordField({ id, label, value, onChange, autoComplete, placeholder }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      <div className={styles.passwordInput}>
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          className={styles.visibilityButton}
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? 'Ocultar senha' : 'Exibir senha'}
          title={isVisible ? 'Ocultar senha' : 'Exibir senha'}
        >
          {isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  )
}

function AccountSettingsDialog() {
  const {
    user,
    closeAccountSettings,
    updateDisplayName,
  } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmation: '',
  })
  const [emailForm, setEmailForm] = useState({
    currentPassword: '',
    newEmail: '',
    confirmation: '',
  })
  const [busySection, setBusySection] = useState('')
  const [notice, setNotice] = useState(null)

  function updatePasswordForm(field, value) {
    setPasswordForm((current) => ({ ...current, [field]: value }))
  }

  function updateEmailForm(field, value) {
    setEmailForm((current) => ({ ...current, [field]: value }))
  }

  function report(type, message) {
    setNotice({ type, message })
  }

  async function handleDisplayNameSubmit(event) {
    event.preventDefault()
    const normalizedName = displayName.trim()

    if (!normalizedName) {
      report('error', 'Informe o nome que será exibido no Chronicle.')
      return
    }
    if (normalizedName.length > 80) {
      report('error', 'O nome exibido pode ter no máximo 80 caracteres.')
      return
    }
    if (normalizedName === String(user?.displayName || '').trim()) {
      report('info', 'Esse já é o nome exibido na sua conta.')
      return
    }

    setBusySection('name')
    setNotice(null)
    try {
      await updateDisplayName(normalizedName)
      report('success', 'Nome atualizado em sua conta e nas suas crônicas.')
    } catch (error) {
      report('error', error.message || 'Não foi possível atualizar o nome.')
    } finally {
      setBusySection('')
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    const { currentPassword, newPassword, confirmation } = passwordForm

    if (newPassword.length < 8) {
      report('error', 'A nova senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (newPassword !== confirmation) {
      report('error', 'A confirmação da nova senha não coincide.')
      return
    }
    if (newPassword === currentPassword) {
      report('error', 'Escolha uma nova senha diferente da atual.')
      return
    }

    setBusySection('password')
    setNotice(null)
    try {
      const result = await changeSupabasePassword({ currentPassword, newPassword })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmation: '' })
      report(
        'success',
        result.otherSessionsClosed
          ? 'Senha alterada. As outras sessões da conta foram encerradas.'
          : 'Senha alterada. Revise as outras sessões da conta quando puder.',
      )
    } catch (error) {
      report('error', error.message || 'Não foi possível alterar a senha.')
    } finally {
      setBusySection('')
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault()
    const newEmail = emailForm.newEmail.trim().toLowerCase()

    if (!EMAIL_PATTERN.test(newEmail)) {
      report('error', 'Informe um novo e-mail válido.')
      return
    }
    if (newEmail !== emailForm.confirmation.trim().toLowerCase()) {
      report('error', 'A confirmação do novo e-mail não coincide.')
      return
    }

    setBusySection('email')
    setNotice(null)
    try {
      const result = await requestSupabaseEmailChange({
        currentPassword: emailForm.currentPassword,
        newEmail,
        emailRedirectTo: `${window.location.origin}/?account=settings`,
      })
      setEmailForm({ currentPassword: '', newEmail: '', confirmation: '' })
      report(
        'success',
        `Confirmações enviadas para ${maskEmail(user?.email)} e ${maskEmail(result.pendingEmail)}. O e-mail só muda após confirmar os dois links.`,
      )
    } catch (error) {
      report('error', error.message || 'Não foi possível iniciar a alteração de e-mail.')
    } finally {
      setBusySection('')
    }
  }

  return (
    <Modal
      isOpen
      title="Configurações da conta"
      description="Gerencie suas informações pessoais com confirmação de segurança."
      size="large"
      className={styles.modal}
      bodyClassName={styles.modalBody}
      onClose={closeAccountSettings}
    >
      <section className={styles.identity} aria-label="Identidade da conta">
        <UserRound size={20} aria-hidden="true" />
        <div>
          <strong>{user?.displayName}</strong>
          <span>{user?.email}</span>
        </div>
        <small>@{user?.username || 'usuário'}</small>
      </section>

      {notice ? (
        <p className={`${styles.notice} ${styles[`notice${notice.type}`]}`} role="status">
          {notice.message}
        </p>
      ) : null}

      <div className={styles.sections}>
        <form className={styles.section} onSubmit={handleDisplayNameSubmit}>
          <div className={styles.sectionHeading}>
            <UserRound size={18} aria-hidden="true" />
            <div>
              <h3>Nome exibido</h3>
              <p>É o nome visível nas crônicas. Seu usuário não será alterado.</p>
            </div>
          </div>
          <label className={styles.field} htmlFor="account-display-name">
            <span>Nome</span>
            <input
              id="account-display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="name"
              maxLength={80}
              required
            />
          </label>
          <button className={styles.secondaryAction} type="submit" disabled={busySection !== ''}>
            {busySection === 'name' ? 'Salvando...' : 'Salvar nome'}
          </button>
        </form>

        <form className={styles.section} onSubmit={handlePasswordSubmit}>
          <div className={styles.sectionHeading}>
            <KeyRound size={18} aria-hidden="true" />
            <div>
              <h3>Senha</h3>
              <p>Confirme a senha atual antes de definir uma nova.</p>
            </div>
          </div>
          <div className={styles.fields}>
            <PasswordField
              id="account-current-password"
              label="Senha atual"
              value={passwordForm.currentPassword}
              onChange={(value) => updatePasswordForm('currentPassword', value)}
              autoComplete="current-password"
            />
            <PasswordField
              id="account-new-password"
              label="Nova senha"
              value={passwordForm.newPassword}
              onChange={(value) => updatePasswordForm('newPassword', value)}
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres"
            />
            <PasswordField
              id="account-password-confirmation"
              label="Confirmar nova senha"
              value={passwordForm.confirmation}
              onChange={(value) => updatePasswordForm('confirmation', value)}
              autoComplete="new-password"
            />
          </div>
          <button className={styles.primaryAction} type="submit" disabled={busySection !== ''}>
            {busySection === 'password' ? 'Alterando...' : 'Alterar senha'}
          </button>
        </form>

        <form className={styles.section} onSubmit={handleEmailSubmit}>
          <div className={styles.sectionHeading}>
            <Mail size={18} aria-hidden="true" />
            <div>
              <h3>E-mail da conta</h3>
              <p>Por segurança, confirme a mudança pelo e-mail atual e pelo novo.</p>
            </div>
          </div>
          <div className={styles.fields}>
            <PasswordField
              id="account-email-current-password"
              label="Senha atual"
              value={emailForm.currentPassword}
              onChange={(value) => updateEmailForm('currentPassword', value)}
              autoComplete="current-password"
            />
            <label className={styles.field} htmlFor="account-new-email">
              <span>Novo e-mail</span>
              <input
                id="account-new-email"
                type="email"
                value={emailForm.newEmail}
                onChange={(event) => updateEmailForm('newEmail', event.target.value)}
                autoComplete="email"
                placeholder="voce@exemplo.com"
                required
              />
            </label>
            <label className={styles.field} htmlFor="account-email-confirmation">
              <span>Confirmar novo e-mail</span>
              <input
                id="account-email-confirmation"
                type="email"
                value={emailForm.confirmation}
                onChange={(event) => updateEmailForm('confirmation', event.target.value)}
                autoComplete="email"
                required
              />
            </label>
          </div>
          <button className={styles.primaryAction} type="submit" disabled={busySection !== ''}>
            {busySection === 'email' ? 'Enviando confirmações...' : 'Solicitar alteração de e-mail'}
          </button>
        </form>
      </div>

      <aside className={styles.securityNote}>
        <ShieldCheck size={18} aria-hidden="true" />
        <p>O Chronicle nunca armazena sua senha. Alterações de credenciais são processadas diretamente pelo Supabase.</p>
      </aside>
    </Modal>
  )
}

export default AccountSettingsDialog
