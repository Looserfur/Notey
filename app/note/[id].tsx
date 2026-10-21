import { useMutation, useQuery } from "convex/react";
import * as Clipboard from "expo-clipboard";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const noteId = id as Id<"notes">;
  const note = useQuery(api.notes.get, id ? { id: noteId } : "skip");
  const updateNote = useMutation(api.notes.update);
  const removeNote = useMutation(api.notes.remove);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [transcript, setTranscript] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setSubject(note.subject);
      setTranscript(note.transcript);
      setDirty(false);
    }
  }, [note]);

  const save = async () => {
    setSaving(true);
    try {
      await updateNote({ id: noteId, title, subject, transcript });
      setDirty(false);
    } catch (e) {
      Alert.alert("Update failed", e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  const copy = async () => {
    await Clipboard.setStringAsync(transcript);
    Alert.alert("Copied", "Transcript copied to clipboard.");
  };

  const onDelete = () => {
    Alert.alert("Delete note?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeNote({ id: noteId });
          router.replace("/(tabs)/notes");
        },
      },
    ]);
  };

  if (note === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-50">
        <ActivityIndicator color="#0d9488" />
      </View>
    );
  }

  if (note === null) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-50 px-6">
        <Text className="text-base text-ink-500">Note not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: note.title || "Note", headerShown: true }} />
      <ScrollView
        className="flex-1 bg-ink-50"
        contentContainerClassName="px-5 py-4 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-1 text-sm text-ink-500">Title</Text>
        <TextInput
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            setDirty(true);
          }}
          className="mb-3 rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900"
        />

        <Text className="mb-1 text-sm text-ink-500">Subject</Text>
        <TextInput
          value={subject}
          onChangeText={(t) => {
            setSubject(t);
            setDirty(true);
          }}
          className="mb-3 rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900"
        />

        <Text className="mb-1 text-sm text-ink-500">Transcript</Text>
        <TextInput
          value={transcript}
          onChangeText={(t) => {
            setTranscript(t);
            setDirty(true);
          }}
          multiline
          textAlignVertical="top"
          className="mb-5 min-h-[220px] rounded-xl border border-ink-200 bg-white px-4 py-3 text-base leading-6 text-ink-900"
        />

        <View className="flex-row flex-wrap gap-2">
          <Pressable
            disabled={!dirty || saving}
            onPress={save}
            className={`rounded-xl px-4 py-3 ${dirty ? "bg-accent" : "bg-ink-200"}`}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Save changes</Text>
            )}
          </Pressable>
          <Pressable
            onPress={copy}
            className="rounded-xl border border-ink-200 bg-white px-4 py-3"
          >
            <Text className="font-semibold text-ink-900">Copy</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <Text className="font-semibold text-red-700">Delete</Text>
          </Pressable>
        </View>

        <Text className="mt-4 text-xs text-ink-500">
          Duration: {note.durationSec}s · Updated{" "}
          {new Date(note.updatedAt).toLocaleString()}
        </Text>
      </ScrollView>
    </>
  );
}
