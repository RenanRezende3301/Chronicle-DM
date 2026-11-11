import { nanoid } from 'nanoid'
import { useCallback, useMemo } from 'react'
import { TurnTrackerContext } from './TurnTrackerContextObject.js'
import { defaultScene, normalizeScene } from '../utils/appState.js'
import { createParticipantFromNPC, createTrack } from '../utils/npcUtils.js'
import { useUserData } from './useUserData.js'
import { useNPCs } from '../hooks/useNPCs.js'

export function TurnTrackerProvider({ children }) {
  const { appState, updateAppState } = useUserData()
  const { updateNPC } = useNPCs()
  const scene = normalizeScene(appState.sceneCurrent)
  const savedScenes = appState.sceneSaved

  const updateScene = useCallback((updates) => {
    updateAppState((currentState) => ({
      ...currentState,
      sceneCurrent: {
        ...normalizeScene(currentState.sceneCurrent),
        ...updates,
      },
    }))
  }, [updateAppState])

  const addParticipant = useCallback((participantOrNPC) => {
    let newParticipant = participantOrNPC

    if (participantOrNPC.type !== 'npc' && participantOrNPC.type !== 'pc') {
      newParticipant = createParticipantFromNPC(participantOrNPC)
    }

    updateAppState((currentState) => {
      const currentScene = normalizeScene(currentState.sceneCurrent)
      const participant = {
        ...newParticipant,
        id: newParticipant.id ?? nanoid(),
        sortOrder: currentScene.participants.length,
      }

      return {
        ...currentState,
        sceneCurrent: {
          ...currentScene,
          participants: [...currentScene.participants, participant],
          currentTurnIndex:
            currentScene.participants.length === 0 ? 0 : currentScene.currentTurnIndex,
        },
      }
    })

    return newParticipant
  }, [updateAppState])

  const addPC = useCallback((pc) => {
    const healthMax = Number(pc.healthMax) || 1
    const willpowerMax = Number(pc.willpowerMax) || 1
    const participant = {
      id: nanoid(),
      npcId: null,
      type: 'pc',
      isVampire: Boolean(pc.isVampire),
      name: pc.name,
      clan: '',
      imageStorageKey: '',
      imageUrl: '',
      healthMax,
      healthBoxes: createTrack(healthMax),
      willpowerMax,
      willpowerBoxes: createTrack(willpowerMax),
      hunger: pc.isVampire ? Number(pc.hunger ?? 1) : 0,
      sortOrder: 0,
      isCurrentTurn: false,
      notes: '',
    }

    return addParticipant(participant)
  }, [addParticipant])

  const removeParticipant = useCallback((participantId) => {
    updateAppState((currentState) => {
      const currentScene = normalizeScene(currentState.sceneCurrent)
      const removedIndex = currentScene.participants.findIndex(
        (participant) => participant.id === participantId,
      )
      if (removedIndex < 0) return currentState
      const participants = currentScene.participants.filter(
        (participant) => participant.id !== participantId,
      )
      const currentTurnIndex = Math.min(
        currentScene.currentTurnIndex - (removedIndex < currentScene.currentTurnIndex ? 1 : 0),
        Math.max(participants.length - 1, 0),
      )

      return {
        ...currentState,
        sceneCurrent: {
          ...currentScene,
          participants,
          currentTurnIndex,
        },
      }
    })
  }, [updateAppState])

  const updateParticipant = useCallback((participantId, updates) => {
    const participant = scene.participants.find((item) => item.id === participantId)
    if (participant?.npcId && (
      updates.healthBoxes || updates.willpowerBoxes || updates.hunger !== undefined
    )) {
      updateNPC(participant.npcId, updates)
    }
    updateAppState((currentState) => {
      const currentScene = normalizeScene(currentState.sceneCurrent)
      return {
        ...currentState,
        sceneCurrent: {
          ...currentScene,
          participants: currentScene.participants.map((p) =>
            p.id === participantId ? { ...p, ...updates } : p,
          ),
        },
      }
    })
  }, [scene.participants, updateAppState, updateNPC])

  const reorderParticipants = useCallback((orderedParticipantIds) => {
    updateAppState((currentState) => {
      const currentScene = normalizeScene(currentState.sceneCurrent)
      const currentParticipantId =
        currentScene.participants[currentScene.currentTurnIndex]?.id ?? null
      const participantById = new Map(
        currentScene.participants.map((participant) => [participant.id, participant]),
      )
      const participants = orderedParticipantIds
        .filter((id, index, ids) => ids.indexOf(id) === index)
        .map((id) => participantById.get(id))
        .filter(Boolean)
        .concat(currentScene.participants.filter(
          (participant) => !orderedParticipantIds.includes(participant.id),
        ))
        .map((participant, index) => {
          return { ...participant, sortOrder: index }
        })

      return {
        ...currentState,
        sceneCurrent: {
          ...currentScene,
          participants,
          currentTurnIndex: currentParticipantId
            ? Math.max(
                participants.findIndex((participant) => participant.id === currentParticipantId),
                0,
              )
            : 0,
        },
      }
    })
  }, [updateAppState])

  const nextTurn = useCallback(() => {
    updateAppState((currentState) => {
      const currentScene = normalizeScene(currentState.sceneCurrent)

      if (!currentScene.participants.length) {
        return currentState
      }

      const nextIndex =
        currentScene.currentTurnIndex + 1 >= currentScene.participants.length
          ? 0
          : currentScene.currentTurnIndex + 1

      return {
        ...currentState,
        sceneCurrent: {
          ...currentScene,
          currentTurnIndex: nextIndex,
          round: nextIndex === 0 ? currentScene.round + 1 : currentScene.round,
        },
      }
    })
  }, [updateAppState])

  const resetTurn = useCallback(() => {
    updateScene({ currentTurnIndex: 0, round: 1 })
  }, [updateScene])

  const setRound = useCallback((round) => {
    updateScene({ round: Math.max(Number(round) || 1, 1) })
  }, [updateScene])

  const adjustRound = useCallback((delta) => {
    updateAppState((currentState) => {
      const currentScene = normalizeScene(currentState.sceneCurrent)

      return {
        ...currentState,
        sceneCurrent: {
          ...currentScene,
          round: Math.max(currentScene.round + delta, 1),
        },
      }
    })
  }, [updateAppState])

  const clearScene = useCallback(() => {
    updateAppState((currentState) => ({
      ...currentState,
      sceneCurrent: defaultScene,
    }))
  }, [updateAppState])

  const saveScene = useCallback((name) => {
    const savedScene = {
      id: nanoid(),
      name: name?.trim() || `Cena ${new Date().toLocaleString('pt-BR')}`,
      round: scene.round,
      currentTurnIndex: scene.currentTurnIndex,
      savedAt: new Date().toISOString(),
      participants: scene.participants,
    }

    updateAppState((currentState) => ({
      ...currentState,
      sceneSaved: [...currentState.sceneSaved, savedScene],
    }))
    return savedScene
  }, [scene, updateAppState])

  const loadScene = useCallback((sceneId) => {
    const savedScene = savedScenes.find((item) => item.id === sceneId)

    if (!savedScene) {
      return false
    }

    updateAppState((currentState) => ({
      ...currentState,
      sceneCurrent: normalizeScene({
        participants: savedScene.participants,
        currentTurnIndex: savedScene.currentTurnIndex,
        round: savedScene.round,
      }),
    }))

    return true
  }, [savedScenes, updateAppState])

  const value = useMemo(
    () => ({
      participants: scene.participants,
      currentTurnIndex: scene.currentTurnIndex,
      round: scene.round,
      isMinimized: scene.isMinimized,
      savedScenes,
      addParticipant,
      addPC,
      removeParticipant,
      updateParticipant,
      reorderParticipants,
      nextTurn,
      resetTurn,
      setRound,
      adjustRound,
      clearScene,
      saveScene,
      loadScene,
      setIsMinimized: (isMinimized) => updateScene({ isMinimized }),
    }),
    [
      addPC,
      addParticipant,
      clearScene,
      loadScene,
      nextTurn,
      removeParticipant,
      reorderParticipants,
      resetTurn,
      setRound,
      adjustRound,
      saveScene,
      savedScenes,
      scene.currentTurnIndex,
      scene.isMinimized,
      scene.participants,
      scene.round,
      updateParticipant,
      updateScene,
    ],
  )

  return (
    <TurnTrackerContext.Provider value={value}>
      {children}
    </TurnTrackerContext.Provider>
  )
}
