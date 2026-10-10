import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import NoteItem from "../components/NoteItem";
import NoteInput from "../components/NoteInput";
import { tablesDB, config, ID, Query, Permission, Role } from "../lib/appwrite";
import { useAuth } from "../lib/AuthContext";

// Convert an Appwrite row into the shape our components expect
const toNote = (row) => ({
  id: row.$id,
  title: row.title,
  content: row.content,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export default function NotesScreen() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await tablesDB.listRows({
        databaseId: config.databaseId,
        tableId: config.tableId,
        queries: [
          Query.equal("userId", user.$id),
          Query.orderDesc("createdAt"),
        ],
      });
      setNotes(res.rows.map(toNote));
    } catch (err) {
      console.log("Load error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (noteText.trim() === "") return;

    try {
      if (editingNote) {
        // Update existing note
        const row = await tablesDB.updateRow({
          databaseId: config.databaseId,
          tableId: config.tableId,
          rowId: editingNote.id,
          data: {
            title: noteText.trim().slice(0, 50),
            content: noteText,
            updatedAt: new Date().toISOString(),
          },
        });
        setNotes(notes.map((n) => (n.id === editingNote.id ? toNote(row) : n)));
        setEditingNote(null);
      } else {
        // Create new note owned by the logged-in user
        const row = await tablesDB.createRow({
          databaseId: config.databaseId,
          tableId: config.tableId,
          rowId: ID.unique(),
          data: {
            title: noteText.trim().slice(0, 50),
            content: noteText,
            userId: user.$id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          permissions: [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
          ],
        });
        setNotes([toNote(row), ...notes]);
      }

      setNoteText("");
      setModalVisible(false);
    } catch (err) {
      console.log("Save error:", err.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      await tablesDB.deleteRow({
        databaseId: config.databaseId,
        tableId: config.tableId,
        rowId: id,
      });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.log("Delete error:", err.message);
    }
  };

  const editNote = (note) => {
    setEditingNote(note);
    setNoteText(note.content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNoteText("");
    setEditingNote(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{notes.length} notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={({ item }) => (
            <NoteItem note={item} onEdit={editNote} onDelete={deleteNote} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notes yet. Create one!</Text>
        </View>
      )}

      <NoteInput
        visible={modalVisible}
        onClose={closeModal}
        onSave={saveNote}
        noteText={noteText}
        setNoteText={setNoteText}
        isEditing={!!editingNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topBarText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    marginTop: -2,
  },
  notesList: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#7f8c8d",
  },
});