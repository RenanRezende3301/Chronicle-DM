import { useState } from 'react'
import Modal from '../common/Modal.jsx'
import commonStyles from '../common/common.module.css'
import { createDefaultNPC, normalizeNPC } from '../../utils/npcUtils.js'
import { useIndexedDB } from '../../hooks/useIndexedDB.js'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import { useAuth } from '../../context/useAuth.js'
import { isSupabaseConfigured } from '../../services/supabase.js'
import {
  removeLibraryPortrait,
  removeLibraryPortraitIfUnused,
  saveNpcSheet,
  uploadNpcPortrait,
} from '../../services/supabaseChronicle2.js'
import IdentitySection from './NPCFormSections/IdentitySection.jsx'
import AttributesSection from './NPCFormSections/AttributesSection.jsx'
import SkillsSection from './NPCFormSections/SkillsSection.jsx'
import DisciplinesSection from './NPCFormSections/DisciplinesSection.jsx'
import EquipmentSection from './NPCFormSections/EquipmentSection.jsx'
import styles from './NPCManager.module.css'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024

function createInitialFormData(npc, defaultCategoryId) {
  if (npc) {
    return normalizeNPC(npc)
  }

  return createDefaultNPC({
    categoryId: defaultCategoryId === 'all' ? null : defaultCategoryId,
  })
}

function NPCForm({
  isOpen,
  npc,
  categories,
  defaultCategoryId,
  onClose,
  onSave,
  onDelete,
}) {
  const { user } = useAuth()
  const [formData, setFormData] = useState(() =>
    createInitialFormData(npc, defaultCategoryId),
  )
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')
  const usesRemotePortraits = Boolean(
    isSupabaseConfigured && user?.authBackend === 'supabase' && user?.id,
  )
  const isEditing = Boolean(npc)
  const {
    imageUrl: storedImageUrl,
    saveImage: saveStoredImage,
    deleteImage: deleteStoredImage,
  } = useIndexedDB(formData.id)
  const canonicalImageUrl = useLibraryPortraitUrl(formData.portraitPath)

  function updateFormData(updates) {
    setFormData((current) => ({
      ...current,
      ...updates,
    }))
  }

  function handleImageFile(event) {
    const [file] = event.target.files

    if (!file) {
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Imagem acima de 10MB.')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    updateFormData({ imageUrl: '' })
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      setError('Nome obrigatorio.')
      return
    }

    const normalized = normalizeNPC({
      ...formData,
      name: formData.name.trim(),
    })

    const externalImageUrl = String(normalized.imageUrl || '').trim()
    if (externalImageUrl) {
      normalized.imageUrl = externalImageUrl
      normalized.portraitPath = ''
    } else if (
      usesRemotePortraits &&
      normalized.portraitPath &&
      !String(normalized.portraitPath).startsWith(`${user?.id || '__invalid__'}/`)
    ) {
      // Repair legacy/imported records that accidentally stored a URL or a
      // portrait path belonging to another account in this private field.
      normalized.portraitPath = ''
    }

    let uploadedPortraitPath = ''
    const previousPortraitPath = String(npc?.portraitPath || '').trim()

    if (imageFile) {
      try {
        if (usesRemotePortraits) {
          uploadedPortraitPath = await uploadNpcPortrait({
            npcId: normalized.id,
            file: imageFile,
          })
          normalized.portraitPath = uploadedPortraitPath
        } else {
          await saveStoredImage(imageFile)
        }
        normalized.imageUrl = ''
      } catch (imageError) {
        setError(imageError.message || 'Nao foi possivel salvar a imagem do NPC.')
        return
      }
    }

    try {
      if (usesRemotePortraits) {
        await saveNpcSheet({
          id: normalized.id,
          categoryId: normalized.categoryId,
          npcData: normalized,
          portraitPath: normalized.portraitPath || null,
        })
      }
      onSave(normalized)
      if (
        usesRemotePortraits &&
        previousPortraitPath &&
        previousPortraitPath !== normalized.portraitPath
      ) {
        void removeLibraryPortraitIfUnused(previousPortraitPath).catch(() => {})
      }
    } catch (saveError) {
      if (uploadedPortraitPath) {
        void removeLibraryPortrait(uploadedPortraitPath).catch(() => {})
      }
      setError(saveError.message || 'Nao foi possivel salvar o retrato do NPC.')
    }
  }

  async function handleRemoveImage() {
    setImageFile(null)
    setImagePreview('')
    updateFormData({ imageUrl: '', portraitPath: '' })

    if (isEditing) {
      await deleteStoredImage()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'Editar NPC' : 'Criar NPC'}
      size="large"
      onClose={onClose}
      footer={
        <>
          {isEditing && (
            <button
              className={commonStyles.destructiveButton}
              type="button"
              onClick={() => onDelete(formData.id)}
            >
              Deletar NPC
            </button>
          )}
          <button className={commonStyles.secondaryButton} type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className={commonStyles.primaryButton} type="button" onClick={handleSave}>
            Salvar
          </button>
        </>
      }
    >
      <div className={styles.npcForm}>
        <IdentitySection
          formData={formData}
          categories={categories}
          imagePreview={imagePreview || canonicalImageUrl || storedImageUrl}
          error={error}
          onChange={updateFormData}
          onImageFile={handleImageFile}
          onRemoveImage={handleRemoveImage}
        />
        <AttributesSection formData={formData} onChange={updateFormData} />
        <SkillsSection formData={formData} onChange={updateFormData} />
        <DisciplinesSection formData={formData} onChange={updateFormData} />
        <EquipmentSection formData={formData} onChange={updateFormData} />
      </div>
    </Modal>
  )
}

export default NPCForm
