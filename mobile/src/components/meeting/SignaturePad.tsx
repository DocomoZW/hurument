import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  PanResponder,
  Dimensions,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'

interface Point {
  x: number
  y: number
}

interface SignaturePadProps {
  visible: boolean
  onSave: (signatureSvg: string) => void
  onCancel: () => void
}

const { width, height } = Dimensions.get('window')

export function SignaturePad({ visible, onSave, onCancel }: SignaturePadProps) {
  const [paths, setPaths] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string>('')
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])

  const buildSvg = useCallback((allPaths: string[]) => {
    const svgWidth = Math.round(width * 0.9)
    const svgHeight = Math.round(height * 0.6)
    const pathsStr = allPaths.map((p, idx) => `<path d="${p}" stroke="#1A3E6E" strokeWidth="3" fill="none" key="${idx}"/>`).join('')
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">${pathsStr}</svg>`
  }, [])

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent
          setCurrentPoints([{ x: locationX, y: locationY }])
          setCurrentPath(`M${locationX.toFixed(1)},${locationY.toFixed(1)}`)
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent
          setCurrentPoints((prev) => [...prev, { x: locationX, y: locationY }])
          setCurrentPath((prev) => `${prev} L${locationX.toFixed(1)},${locationY.toFixed(1)}`)
        },
        onPanResponderRelease: () => {
          setPaths((prev) => [...prev, currentPath])
          setCurrentPath('')
          setCurrentPoints([])
        },
      }),
    [currentPath]
  )

  const handleClear = () => {
    setPaths([])
    setCurrentPath('')
    setCurrentPoints([])
  }

  const handleSave = () => {
    const allPaths = currentPath ? [...paths, currentPath] : paths
    if (allPaths.length === 0) {
      onCancel()
      return
    }
    const svgString = buildSvg(allPaths)
    onSave(svgString)
    setPaths([])
    setCurrentPath('')
    setCurrentPoints([])
  }

  const handleCancel = () => {
    setPaths([])
    setCurrentPath('')
    setCurrentPoints([])
    onCancel()
  }

  const allPaths = currentPath ? [...paths, currentPath] : paths

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleCancel}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign Here</Text>
        </View>

        <View style={styles.padContainer} {...panResponder.panHandlers}>
          <Svg width={width * 0.9} height={height * 0.6} style={styles.svg}>
            {allPaths.map((d, idx) => (
              <Path
                key={idx}
                d={d}
                stroke="#1A3E6E"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Svg>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A3E6E',
  },
  padContainer: {
    width: width * 0.9,
    height: height * 0.6,
    borderWidth: 2,
    borderColor: '#1A3E6E',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  svg: {
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c00',
  },
  cancelButtonText: {
    color: '#c00',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#C9A84C',
  },
  saveButtonText: {
    color: '#1A3E6E',
    fontSize: 15,
    fontWeight: 'bold',
  },
})
