import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, View } from "react-native";
import { NoteCard } from "@/components/NoteCard";
import { api } from "@/convex/_generated/api";

export default function NotesScreen() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const notes = useQuery(api.notes.list, {
    search: search.trim() || undefined,
    subject: subject.trim() || undefined,
  });

  const subjects = useMemo(() => {
    if (!notes) return [] as string[];
    const set = new Set(notes.map((n) => n.subject).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  return (
    <View className="flex-1 bg-ink-50">
      <View className="border-b border-ink-100 bg-white px-5 pb-3 pt-2">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search notes…"
          placeholderTextColor="#94a3b8"
          className="mb-2 rounded-xl border border-ink-200 bg-ink-50 px-4 py-2.5 text-base text-ink-900"
        />
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder="Filter by subject (exact)…"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-2.5 text-base text-ink-900"
        />
        {subjects.length > 0 ? (
          <Text className="mt-2 text-xs text-ink-500">
            Subjects: {subjects.join(" · ")}
          </Text>
        ) : null}
      </View>

      <ScrollView contentContainerClassName="px-5 py-4">
        {notes === undefined ? (
          <ActivityIndicator color="#0d9488" className="mt-8" />
        ) : notes.length === 0 ? (
          <Text className="mt-8 text-center text-base text-ink-500">
            No notes yet. Record something on the Record tab.
          </Text>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note._id}
              id={note._id}
              title={note.title}
              subject={note.subject}
              transcript={note.transcript}
              createdAt={note.createdAt}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
