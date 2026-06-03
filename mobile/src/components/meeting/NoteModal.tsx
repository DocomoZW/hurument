import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

interface NoteModalProps {
  visible: boolean
  existingText?: string
  onSave: (text: string) => void
  onDelete: () => void
  onCancel: () => void
}

export function NoteModal({ visible, existingText, onSave, onDelete, onCancel }: NoteModalProps) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (visible) {
      setText(existingText || '')
    }
  }, [visible, existingText])

  const handleSave = () => {
    onSave(text.trim())
    setText('')
  }

  const handleCancel = () => {
    setText('')
    onCancel()
  }

  const handleDelete = () => {
    setText('')
    onDelete()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{existingText ? 'Edit Note' : 'Add Note'}</Text>

          <TextInput
            style={styles.input}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholder="Type your annotation here..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            autoFocus
          />

          <View style={styles.footer}>
            {existingText ? (
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    width: '90%',
    backgroundColor: '#F5F1E8',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3E6E',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 15,
    color: '#1A3E6E',
    minHeight: 120,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c00',
  },
  deleteButtonText: {
    color: '#c00',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1A3E6E',
  },
  cancelButtonText: {
    color: '#1A3E6E',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#C9A84C',
  },
  saveButtonText: {
    color: '#1A3E6E',
    fontSize: 14,
    fontWeight: 'bold',
  },
})
