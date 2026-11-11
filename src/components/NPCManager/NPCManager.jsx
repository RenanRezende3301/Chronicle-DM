import { useMemo, useState } from 'react'
import { Download, FileArchive, FileUp, Plus, Search, Dices, Trash2 } from 'lucide-react'
import { useNPCs } from '../../hooks/useNPCs.js'
import { useTurnTracker } from '../../hooks/useTurnTracker.js'
import { useToast } from '../../hooks/useToast.js'
import { normalizeNPC } from '../../utils/npcUtils.js'
import {
  exportNpcBackupZip,
  exportNPC,
  importNpcBackupZip,
  importNPCFromJSON,
  importNPCsFromJSON,
} from '../../utils/exportImport.js'
import { deleteImage } from '../../utils/imageStorage.js'
import { api } from '../../services/api.js'
import CategoryManager from './CategoryManager.jsx'
import CategoryTabs from './CategoryTabs.jsx'
import NPCGrid from './NPCGrid.jsx'
import NPCForm from './NPCForm.jsx'
import NPCDetail from './NPCDetail.jsx'
import NPCImportDialog from './NPCImportDialog.jsx'
import NPCBulkImportDialog from './NPCBulkImportDialog.jsx'
import MassRollerModal from './MassRollerModal.jsx'
import Modal from '../common/Modal.jsx'
import styles from './NPCManager.module.css'

function NPCManager() {
  const {
    npcs,
    categories,
    addNPC,
    updateNPC,
    deleteNPCs,
    importNPCs,
    refreshNPCs,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useNPCs()
  const { addParticipant, participants, updateParticipant } = useTurnTracker()
  const toast = useToast()
  const [activeCategoryId, setActiveCategoryId] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [editingNPC, setEditingNPC] = useState(null)
  const [detailNPC, setDetailNPC] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [isMassRollerOpen, setIsMassRollerOpen] = useState(false)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [bulkDeleteAcknowledged, setBulkDeleteAcknowledged] = useState(false)
  const [bulkDeletePhrase, setBulkDeletePhrase] = useState('')
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isBackupImportOpen, setIsBackupImportOpen] = useState(false)
  const [backupZipFile, setBackupZipFile] = useState(null)
  const [isBackupBusy, setIsBackupBusy] = useState(false)
  const [backupProgress, setBackupProgress] = useState('')
  const [backupReport, setBackupReport] = useState(null)

  const filteredNPCs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return npcs.filter((npc) => {
      const matchesCategory =
        activeCategoryId === 'all'
          ? true
          : activeCategoryId === 'uncategorized'
            ? !npc.categoryId
            : npc.categoryId === activeCategoryId
      const matchesSearch = normalizedSearch
        ? [npc.name, npc.clan, npc.concept].some((value) =>
            String(value ?? '').toLowerCase().includes(normalizedSearch),
          )
        : true

      return matchesCategory && matchesSearch
    })
  }, [activeCategoryId, npcs, searchTerm])

  const bulkDeleteTargets = useMemo(() => npcs.filter((npc) => {
    if (activeCategoryId === 'all') return true
    if (activeCategoryId === 'uncategorized') return !npc.categoryId
    return npc.categoryId === activeCategoryId
  }), [activeCategoryId, npcs])
  const activeCategoryName = activeCategoryId === 'all'
    ? 'toda a biblioteca'
    : activeCategoryId === 'uncategorized'
      ? 'os NPCs sem categoria'
      : categories.find((category) => category.id === activeCategoryId)?.name || 'esta categoria'

  function openBulkDeleteDialog() {
    if (!bulkDeleteTargets.length) return
    setBulkDeleteAcknowledged(false)
    setBulkDeletePhrase('')
    setIsBulkDeleteOpen(true)
  }

  async function handleBulkDelete() {
    if (
      isBulkDeleting ||
      !bulkDeleteAcknowledged ||
      bulkDeletePhrase.trim().toUpperCase() !== 'EXCLUIR' ||
      !bulkDeleteTargets.length
    ) {
      return
    }

    setIsBulkDeleting(true)
    try {
      const deletedCount = await deleteNPCs(bulkDeleteTargets.map((npc) => npc.id))
      toast.info(`${deletedCount} NPCs removidos de ${activeCategoryName}.`, 'Exclusão concluída')
      setDetailNPC(null)
      setEditingNPC(null)
      setIsFormOpen(false)
      setIsBulkDeleteOpen(false)
    } catch (error) {
      toast.error(error.message || 'Não foi possível concluir a exclusão.', 'Exclusão incompleta')
    } finally {
      setIsBulkDeleting(false)
    }
  }

  function openCreateForm() {
    setEditingNPC(null)
    setIsFormOpen(true)
  }

  function openEditForm(npc) {
    setEditingNPC(npc)
    setIsFormOpen(true)
  }

  function handleSaveNPC(npc) {
    if (editingNPC) {
      updateNPC(npc.id, npc)
      toast.success(`${npc.name} atualizado.`, 'NPC salvo')
    } else {
      addNPC(npc)
      toast.success(`${npc.name} entrou no dossie.`, 'NPC criado')
    }

    setIsFormOpen(false)
    setEditingNPC(null)
  }

  async function handleDeleteNPC(npcId) {
    if (!window.confirm('Deletar este NPC?')) return

    try {
      await deleteNPCs([npcId])
      await Promise.allSettled([
        api.deleteImage(npcId),
        deleteImage(npcId),
      ])
      toast.info('NPC removido da biblioteca.', 'Dossie atualizado')
      setDetailNPC(null)
      setIsFormOpen(false)
    } catch (error) {
      toast.error(error.message || 'Não foi possível excluir o NPC.', 'Exclusão interrompida')
    }
  }

  function handleDuplicateNPC(npc) {
    const { id, createdAt, updatedAt, ...copySource } = npc
    void id
    void createdAt
    void updatedAt
    const copy = normalizeNPC({
      ...copySource,
      name: `${npc.name} (copia)`,
    })
    addNPC(copy)
    toast.success(`${copy.name} criado.`, 'NPC duplicado')
  }

  function handleMoveNPC(npcId, categoryId) {
    updateNPC(npcId, { categoryId })
    toast.info('Categoria do NPC atualizada.', 'NPC movido')
  }

  function handleExportNPC(npc) {
    exportNPC(npc)
    toast.success(`${npc.name} exportado em JSON.`, 'Exportacao iniciada')
  }

  async function handleExportNPCsWithPhotos() {
    const exportTargets = activeCategoryId === 'all'
      ? npcs
      : bulkDeleteTargets
    const scopeName = activeCategoryId === 'all'
      ? 'todos-os-npcs'
      : activeCategoryId === 'uncategorized'
        ? 'sem-categoria'
        : categories.find((category) => category.id === activeCategoryId)?.name || 'categoria'

    setIsBackupBusy(true)
    setBackupProgress('Preparando backup...')
    try {
      const result = await exportNpcBackupZip({
        npcs: exportTargets,
        categories,
        label: scopeName,
        onProgress: ({ name, completed, total }) => {
          setBackupProgress(name ? `Incluindo retrato de ${name} (${completed + 1}/${total})...` : 'Compactando backup...')
        },
      })
      toast.success(`${result.exported} NPCs exportados em ZIP${result.portraitErrors.length ? `; ${result.portraitErrors.length} retratos não puderam ser incluídos` : ''}.`, 'Backup concluído')
    } catch (error) {
      toast.error(error.message || 'Não foi possível exportar o backup.', 'Exportação interrompida')
    } finally {
      setBackupProgress('')
      setIsBackupBusy(false)
    }
  }

  function openBackupImport() {
    setBackupZipFile(null)
    setBackupProgress('')
    setBackupReport(null)
    setIsBackupImportOpen(true)
  }

  async function handleBackupImport() {
    if (!backupZipFile || isBackupBusy) return

    setIsBackupBusy(true)
    setBackupProgress('Lendo o backup ZIP...')
    setBackupReport(null)

    try {
      const report = await importNpcBackupZip({
        file: backupZipFile,
        targetNpcs: npcs,
        categories,
        onProgress: ({ name, completed, total }) => {
          setBackupProgress(`Importando ${name} (${completed + 1}/${total})...`)
        },
      })
      await refreshNPCs()
      setBackupReport(report)
      setBackupProgress('')
      toast.success(`${report.created} criados e ${report.replaced} substituídos.`, 'Importação concluída')
    } catch (error) {
      setBackupProgress('')
      toast.error(error.message || 'Não foi possível importar o backup.', 'Importação interrompida')
    } finally {
      setIsBackupBusy(false)
    }
  }

  async function importJSONPayload(json) {
    if (Array.isArray(json.npcs)) {
      const imported = await importNPCs(
        json.npcs.map((npc) => importNPCFromJSON(npc, { createAsNew: true })),
      )
      toast.success(`${imported.length} NPCs importados.`, 'Importacao concluida')
      return
    }

    const importedNPC = importNPCFromJSON(json)
    const existingNPC = npcs.find((npc) => npc.id === importedNPC.id)

    if (!existingNPC) {
      await importNPCs([importedNPC])
      toast.success(`${importedNPC.name} importado.`, 'Importacao concluida')
      return
    }

    if (window.confirm('NPC ja existe. Substituir o registro atual?')) {
      updateNPC(importedNPC.id, importedNPC)
      toast.success(`${importedNPC.name} substituido.`, 'NPC atualizado')
      return
    }

    const [createdNPC] = await importNPCs([importNPCFromJSON(json, { createAsNew: true })])
    toast.success(`${createdNPC.name} importado como novo.`, 'Importacao concluida')
  }

  async function handleImportText(jsonText) {
    if (!jsonText.trim()) {
      throw new Error('Cole um JSON antes de importar.')
    }

    await importJSONPayload(JSON.parse(jsonText))
  }

  async function handleImportFile(file) {
    await importJSONPayload(JSON.parse(await file.text()))
  }

  async function handleBulkImportFiles(files) {
    let importedCount = 0
    let failedCount = 0

    for (const file of files) {
      try {
        const text = await file.text()
        const json = JSON.parse(text)

        const importedNPCs = importNPCsFromJSON(json, { createAsNew: true })
        for (const imported of importedNPCs) {
          if (activeCategoryId !== 'all' && activeCategoryId !== 'uncategorized') {
            imported.categoryId = activeCategoryId
          } else if (activeCategoryId === 'uncategorized') {
            imported.categoryId = null
          }

          try {
            await importNPCs([imported])
            importedCount++
          } catch {
            failedCount++
          }
        }
      } catch {
        failedCount += 1
      }
    }

    toast.success(
      `${importedCount} NPCs importados.` + (failedCount > 0 ? ` ${failedCount} falharam.` : ''),
      'Importação em Massa'
    )
  }

  return (
    <section className={styles.module}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>Modulo de NPCs</span>
          <h1>Biblioteca do Narrador</h1>
          <p>
            Catalogue aliados, antagonistas e figurantes da cronica em dossies
            persistentes, prontos para entrar em cena.
          </p>
        </div>

        <CategoryTabs
          categories={categories}
          npcs={npcs}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          onManageCategories={() => setIsCategoryManagerOpen(true)}
        />

        <div className={styles.toolbar} aria-label="Ferramentas de NPC">
          <label className={styles.searchBox}>
            <Search size={17} />
            <input
              type="search"
              placeholder="Buscar NPC"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <div className={styles.toolbarActions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => setIsImportOpen(true)}
            >
              <FileUp size={17} />
              Importar
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => setIsMassRollerOpen(true)}
            >
              <Dices size={17} />
              Rolar em Massa
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={handleExportNPCsWithPhotos}
              disabled={isBackupBusy || !bulkDeleteTargets.length}
            >
              <Download size={17} />
              {activeCategoryId === 'all' ? 'Exportar todos com fotos' : 'Exportar categoria com fotos'}
            </button>
            <button
              className={styles.deleteManyButton}
              type="button"
              onClick={openBulkDeleteDialog}
              disabled={!bulkDeleteTargets.length}
            >
              <Trash2 size={17} />
              {activeCategoryId === 'all' ? 'Excluir todos' : 'Excluir categoria'}
            </button>
            <button className={styles.primaryButton} type="button" onClick={openCreateForm}>
              <Plus size={17} />
              Criar NPC
            </button>
          </div>
        </div>
        {backupProgress && !isBackupImportOpen ? (
          <p className={styles.backupProgress} role="status">{backupProgress}</p>
        ) : null}

        <NPCGrid
          npcs={filteredNPCs}
          categories={categories}
          onViewNPC={setDetailNPC}
          onEditNPC={openEditForm}
          onDeleteNPC={handleDeleteNPC}
          onDuplicateNPC={handleDuplicateNPC}
          onMoveNPC={handleMoveNPC}
          onExportNPC={handleExportNPC}
        />

        <CategoryManager
          isOpen={isCategoryManagerOpen}
          categories={categories}
          onClose={() => setIsCategoryManagerOpen(false)}
          onAddCategory={(category) => {
            addCategory(category)
            toast.success(`${category.name} criada.`, 'Categoria adicionada')
          }}
          onUpdateCategory={(categoryId, updates) => {
            updateCategory(categoryId, updates)
            toast.success('Categoria salva.', 'Dossie atualizado')
          }}
          onDeleteCategory={(categoryId) => {
            deleteCategory(categoryId)
            toast.info('Categoria removida. NPCs ficaram sem categoria.', 'Dossie atualizado')
          }}
        />

        {isFormOpen && (
          <NPCForm
            key={editingNPC?.id ?? `new-${activeCategoryId}`}
            isOpen={isFormOpen}
            npc={editingNPC}
            categories={categories}
            defaultCategoryId={activeCategoryId}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSaveNPC}
            onDelete={handleDeleteNPC}
          />
        )}

        <NPCImportDialog
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImportText={handleImportText}
          onImportFile={handleImportFile}
          onOpenBulkImport={() => setIsBulkImportOpen(true)}
          onOpenBackupImport={openBackupImport}
        />

        {isBulkImportOpen && (
          <NPCBulkImportDialog
            isOpen={isBulkImportOpen}
            onClose={() => setIsBulkImportOpen(false)}
            onImportFiles={handleBulkImportFiles}
          />
        )}


        <MassRollerModal
          isOpen={isMassRollerOpen}
          onClose={() => setIsMassRollerOpen(false)}
          npcs={filteredNPCs}
        />

        <NPCDetail
          npc={detailNPC ? (npcs.find(n => n.id === detailNPC.id) || detailNPC) : null}
          participant={detailNPC ? participants.find(p => p.npcId === detailNPC.id) : null}
          isOpen={Boolean(detailNPC)}
          onClose={() => setDetailNPC(null)}
          onUpdateNPC={updateNPC}
          onUpdateParticipant={updateParticipant}
          onEdit={(npc) => {
            setDetailNPC(null)
            openEditForm(npc)
          }}
          onAddToTracker={(npc) => {
            addParticipant(npc)
            toast.success(`${npc.name} entrou na cena.`, 'Rastreador atualizado')
          }}
          onExport={handleExportNPC}
        />
        <Modal
          isOpen={isBackupImportOpen}
          title="Importar backup com fotos"
          description="O ZIP restaura fichas, categorias e retratos. Um NPC de nome único já existente será substituído pela versão do backup."
          size="medium"
          closeOnOverlay={!isBackupBusy}
          onClose={() => {
            if (!isBackupBusy) setIsBackupImportOpen(false)
          }}
          footer={(
            <>
              <button
                className={styles.bulkDeleteCancel}
                type="button"
                disabled={isBackupBusy}
                onClick={() => setIsBackupImportOpen(false)}
              >
                {backupReport ? 'Fechar' : 'Cancelar'}
              </button>
              {!backupReport ? (
                <button
                  className={styles.primaryButton}
                  type="button"
                  disabled={!backupZipFile || isBackupBusy}
                  onClick={handleBackupImport}
                >
                  <FileArchive size={16} />
                  {isBackupBusy ? 'Importando...' : 'Importar backup'}
                </button>
              ) : null}
            </>
          )}
        >
          <div className={styles.backupImportDialog}>
            <p>
              Não é preciso descompactar o arquivo. Imagens enviadas ao Chronicle serão reenviadas automaticamente à conta atual; links externos continuam como links.
            </p>
            <label className={styles.backupImportFile}>
              <span>Backup ZIP do Chronicle</span>
              <input
                type="file"
                accept="application/zip,.zip"
                disabled={isBackupBusy}
                onChange={(event) => setBackupZipFile(event.target.files?.[0] || null)}
              />
              <small>{backupZipFile?.name || 'Selecione um arquivo .zip exportado pelo Chronicle.'}</small>
            </label>
            {backupProgress ? <p className={styles.backupProgress}>{backupProgress}</p> : null}
            {backupReport ? (
              <div className={styles.backupImportReport}>
                <strong>{backupReport.created} criados · {backupReport.replaced} substituídos · {backupReport.portraits} retratos enviados</strong>
                {backupReport.ambiguous.length ? <span>{backupReport.ambiguous.length} nomes ambíguos foram ignorados.</span> : null}
                {backupReport.failed.length ? <span>{backupReport.failed.length} NPCs falharam; consulte nomes e tente novamente.</span> : null}
              </div>
            ) : null}
          </div>
        </Modal>

        <Modal
          isOpen={isBulkDeleteOpen}
          title="Excluir NPCs em massa"
          description={`Você está prestes a excluir ${bulkDeleteTargets.length} NPC${bulkDeleteTargets.length === 1 ? '' : 's'} de ${activeCategoryName}. Esta ação não pode ser desfeita.`}
          size="small"
          closeOnOverlay={!isBulkDeleting}
          onClose={() => {
            if (!isBulkDeleting) setIsBulkDeleteOpen(false)
          }}
          footer={(
            <>
              <button
                className={styles.bulkDeleteCancel}
                type="button"
                disabled={isBulkDeleting}
                onClick={() => setIsBulkDeleteOpen(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.bulkDeleteConfirm}
                type="button"
                disabled={
                  isBulkDeleting ||
                  !bulkDeleteAcknowledged ||
                  bulkDeletePhrase.trim().toUpperCase() !== 'EXCLUIR'
                }
                onClick={handleBulkDelete}
              >
                <Trash2 size={16} />
                {isBulkDeleting ? 'Excluindo...' : `Excluir ${bulkDeleteTargets.length} NPCs`}
              </button>
            </>
          )}
        >
          <div className={styles.bulkDeleteDialog}>
            <p>
              As fichas de personagens de jogador e as crônicas não serão alteradas. Os NPCs selecionados e seus retratos serão excluídos.
            </p>
            <label className={styles.bulkDeleteAcknowledgement}>
              <input
                type="checkbox"
                checked={bulkDeleteAcknowledged}
                disabled={isBulkDeleting}
                onChange={(event) => setBulkDeleteAcknowledged(event.target.checked)}
              />
              <span>Entendo que esta exclusão é permanente.</span>
            </label>
            <label className={styles.bulkDeletePhrase}>
              Para confirmar, digite <strong>EXCLUIR</strong>
              <input
                value={bulkDeletePhrase}
                disabled={isBulkDeleting}
                onChange={(event) => setBulkDeletePhrase(event.target.value)}
                placeholder="EXCLUIR"
                autoComplete="off"
              />
            </label>
          </div>
        </Modal>
    </section>
  )
}

export default NPCManager
