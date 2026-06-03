import React, { useState, useCallback, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  Animated,
  LayoutRectangle,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useAnnotationStore, type Annotation, type AnnotationType } from '../../store/annotationStore'
import { useSyncQueueStore } from '../../store/syncQueue'
import { SignaturePad } from './SignaturePad'
import { NoteModal } from './NoteModal'

interface AnnotationOverlayProps {
  meetingId: string
  pageNumber: number
  activeTool: AnnotationType | null
  onAnnotationCountChange?: (count: number) => void
}

const { width: screenWidth } = Dimensions.get('window')

const ANNOTATION_COLORS: Record<AnnotationType, string> = {
  highlight: 'rgba(255, 235, 59, 0.4)',
  note: '#C9A84C',
  signature: '#1A3E6E',
}

const TOOL_LABELS: Record<AnnotationType, string> = {
  highlight: 'Highlight',
  note: 'Note',
  signature: 'Signature',
}

export function AnnotationOverlay({
  meetingId,
  pageNumber,
  activeTool,
  onAnnotationCountChange,
}: AnnotationOverlayProps) {
  const { annotations, addAnnotation, deleteAnnotation, getAnnotationsForPage } = useAnnotationStore()
  const { enqueue } = useSyncQueueStore()

  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null)
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [selectorPos, setSelectorPos] = useState({ x: 0, y: 0 })
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [pendingAnnotation, setPendingAnnotation] = useState<Annotation | null>(null)

  const fadeAnim = useRef(new Animated.Value(0)).current

  const pageAnnotations = getAnnotationsForPage(meetingId, pageNumber)

  React.useEffect(() => {
    onAnnotationCountChange?.(pageAnnotations.length)
  }, [pageAnnotations.length, onAnnotationCountChange])

  const animateIn = () => {
    fadeAnim.setValue(0)
    Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start()
  }

  const animateOut = (callback?: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(callback)
  }

  const toPercent = (val: number, max: number) => (max > 0 ? (val / max) * 100 : 0)
  const fromPercent = (val: number, max: number) => (max * val) / 100

  const handleLongPress = useCallback(
    (x: number, y: number) => {
      setSelectorPos({ x, y })
      setShowTypeSelector(true)
      animateIn()
    },
    [animateIn]
  )

  const createAnnotation = useCallback(
    (type: AnnotationType, x: number, y: number, extra: { text?: string; signatureSvg?: string } = {}) => {
      if (!layout) return
      const xp = toPercent(x, layout.width)
      const yp = toPercent(y, layout.height)

      const base = {
        meetingId,
        pageNumber,
        type,
        x: xp,
        y: yp,
        width: type === 'highlight' ? 20 : 4,
        height: type === 'highlight' ? 3 : 4,
        color: ANNOTATION_COLORS[type],
        ...extra,
      }

      const annotation = addAnnotation(base)

      enqueue({
        type: 'CREATE_ANNOTATION',
        payload: {
          meetingId: annotation.meetingId,
          pageNumber: annotation.pageNumber,
          type: annotation.type,
          x: annotation.x,
          y: annotation.y,
          width: annotation.width,
          height: annotation.height,
          color: annotation.color,
          text: annotation.text,
          signatureSvg: annotation.signatureSvg,
          localId: annotation.id,
        },
      })

      return annotation
    },
    [layout, meetingId, pageNumber, addAnnotation, enqueue]
  )

  const handleToolSelect = (type: AnnotationType) => {
    setShowTypeSelector(false)

    if (type === 'signature') {
      setShowSignaturePad(true)
      return
    }

    if (type === 'note') {
      const annotation = createAnnotation('note', selectorPos.x, selectorPos.y)
      if (annotation) {
        setPendingAnnotation(annotation)
        setShowNoteModal(true)
      }
      return
    }

    if (type === 'highlight') {
      createAnnotation('highlight', selectorPos.x, selectorPos.y)
    }
  }

  const handleMarkerPress = (annotation: Annotation) => {
    setSelectedAnnotation(annotation)
    animateIn()
  }

  const handleDeleteAnnotation = () => {
    if (!selectedAnnotation) return

    enqueue({
      type: 'DELETE_ANNOTATION',
      payload: { serverId: selectedAnnotation.serverId || '', localId: selectedAnnotation.id },
    })

    deleteAnnotation(selectedAnnotation.id)
    setSelectedAnnotation(null)
  }

  const handleSaveSignature = (signatureSvg: string) => {
    setShowSignaturePad(false)
    createAnnotation('signature', selectorPos.x, selectorPos.y, { signatureSvg })
  }

  const handleSaveNote = (text: string) => {
    setShowNoteModal(false)
    if (!pendingAnnotation) return

    const store = useAnnotationStore.getState()
    store.updateAnnotation(pendingAnnotation.id, { text })

    enqueue({
      type: 'UPDATE_ANNOTATION',
      payload: {
        serverId: pendingAnnotation.serverId || '',
        localId: pendingAnnotation.id,
        meetingId: pendingAnnotation.meetingId,
        pageNumber: pendingAnnotation.pageNumber,
        type: pendingAnnotation.type,
        x: pendingAnnotation.x,
        y: pendingAnnotation.y,
        width: pendingAnnotation.width,
        height: pendingAnnotation.height,
        color: pendingAnnotation.color,
        text,
        signatureSvg: pendingAnnotation.signatureSvg,
      },
    })

    setPendingAnnotation(null)
  }

  const handleDeleteNote = () => {
    setShowNoteModal(false)
    if (pendingAnnotation) {
      deleteAnnotation(pendingAnnotation.id)
    }
    setPendingAnnotation(null)
  }

  const longPressTimeout = useRef<NodeJS.Timeout | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent
        touchStart.current = { x: locationX, y: locationY }
        longPressTimeout.current = setTimeout(() => {
          handleLongPress(locationX, locationY)
        }, 600)
      },
      onPanResponderRelease: () => {
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current)
          longPressTimeout.current = null
        }
        touchStart.current = null
      },
      onPanResponderTerminate: () => {
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current)
          longPressTimeout.current = null
        }
        touchStart.current = null
      },
    })
  ).current

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="box-none"
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
      {...panResponder.panHandlers}
    >
      {pageAnnotations.map((annotation) => {
        const left = fromPercent(annotation.x, layout?.width || screenWidth)
        const top = fromPercent(annotation.y, layout?.height || 600)

        if (annotation.type === 'highlight') {
          return (
            <TouchableOpacity
              key={annotation.id}
              style={[
                styles.highlightMarker,
                {
                  left,
                  top,
                  width: fromPercent(annotation.width, layout?.width || screenWidth),
                  height: fromPercent(annotation.height, layout?.height || 600),
                  backgroundColor: annotation.color,
                },
              ]}
              onPress={() => handleMarkerPress(annotation)}
              activeOpacity={0.8}
            />
          )
        }

        if (annotation.type === 'signature') {
          return (
            <TouchableOpacity
              key={annotation.id}
              style={[
                styles.signatureMarker,
                { left, top, borderColor: annotation.color },
              ]}
              onPress={() => handleMarkerPress(annotation)}
              activeOpacity={0.8}
            >
              {annotation.signatureSvg ? (
                <Svg width={28} height={28} viewBox="0 0 100 100">
                  <Path d="M10,50 Q30,20 50,50 T90,50" stroke="#1A3E6E" strokeWidth="4" fill="none" />
                </Svg>
              ) : (
                <Text style={styles.markerText}>✍</Text>
              )}
            </TouchableOpacity>
          )
        }

        return (
          <TouchableOpacity
            key={annotation.id}
            style={[
              styles.noteMarker,
              { left, top, backgroundColor: annotation.color },
            ]}
            onPress={() => handleMarkerPress(annotation)}
            activeOpacity={0.8}
          >
            <Text style={styles.markerText}>📝</Text>
          </TouchableOpacity>
        )
      })}

      {selectedAnnotation ? (
        <Animated.View style={[styles.detailCard, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.detailClose}
            onPress={() => {
              animateOut(() => setSelectedAnnotation(null))
            }}
          >
            <Text style={styles.detailCloseText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.detailType}>
            {TOOL_LABELS[selectedAnnotation.type]}
          </Text>
          {selectedAnnotation.text ? (
            <Text style={styles.detailText}>{selectedAnnotation.text}</Text>
          ) : null}
          {selectedAnnotation.signatureSvg ? (
            <Text style={styles.detailText}>Signature saved</Text>
          ) : null}
          <Text style={styles.detailTimestamp}>
            {new Date(selectedAnnotation.createdAt).toLocaleString()}
          </Text>
          <TouchableOpacity style={styles.detailDelete} onPress={handleDeleteAnnotation}>
            <Text style={styles.detailDeleteText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      {showTypeSelector ? (
        <Animated.View
          style={[
            styles.typeSelector,
            {
              left: Math.min(selectorPos.x, (layout?.width || screenWidth) - 140),
              top: Math.min(selectorPos.y, (layout?.height || 600) - 120),
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.selectorTitle}>Add Annotation</Text>
          {(Object.keys(TOOL_LABELS) as AnnotationType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.selectorItem}
              onPress={() => handleToolSelect(type)}
            >
              <View style={[styles.selectorDot, { backgroundColor: ANNOTATION_COLORS[type] }]} />
              <Text style={styles.selectorLabel}>{TOOL_LABELS[type]}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.selectorCancel}
            onPress={() => {
              animateOut(() => setShowTypeSelector(false))
            }}
          >
            <Text style={styles.selectorCancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      <SignaturePad
        visible={showSignaturePad}
        onSave={handleSaveSignature}
        onCancel={() => setShowSignaturePad(false)}
      />

      <NoteModal
        visible={showNoteModal}
        existingText={pendingAnnotation?.text}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        onCancel={() => {
          setShowNoteModal(false)
          setPendingAnnotation(null)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  highlightMarker: {
    position: 'absolute',
    borderRadius: 2,
  },
  noteMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  signatureMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  markerText: {
    fontSize: 14,
  },
  detailCard: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
  },
  detailClose: {
    position: 'absolute',
    top: 8,
    right: 12,
  },
  detailCloseText: {
    fontSize: 18,
    color: '#999',
  },
  detailType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A3E6E',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  detailTimestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  detailDelete: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#c00',
  },
  detailDeleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  typeSelector: {
    position: 'absolute',
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 20,
  },
  selectorTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A3E6E',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  selectorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  selectorLabel: {
    fontSize: 14,
    color: '#333',
  },
  selectorCancel: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  selectorCancelText: {
    fontSize: 14,
    color: '#999',
  },
})
