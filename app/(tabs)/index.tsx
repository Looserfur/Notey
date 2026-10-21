import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { LiveTranscript } from "@/components/LiveTranscript";
import { RecordButton } from "@/components/RecordButton";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { api } from "@/convex/_generated/api";

function formatTimer(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function RecordScreen() {
  const router = useRouter();
  const createNote = useMutation(api.notes.create);
  const speech = useSpeechToText();

  const [showMicRationale, setShowMicRationale] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [showSave, setShowSave] = useState(false);

  const onRecordPress = () => {
    if (speech.isListening) {
      speech.stop();
      return;
    }
    if (!speech.support.supported) {
      return;
    }
    setShowMicRationale(true);
  };

  const confirmMicAndStart = async () => {
    setShowMicRationale(false);
    await speech.start();
  };

  const openSave = () => {
    speech.stop();
    if (!speech.transcript.trim()) {
      Alert.alert("Nothing to save", "Record some speech before saving a note.");
      return;
    }
    setTitle("");
    setSubject("");
    setShowSave(true);
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      const id = await createNote({
        title: title.trim() || `Note ${new Date().toLocaleString()}`,
        subject: subject.trim() || "General",
        transcript: speech.transcript,
        durationSec: speech.elapsedSec,
      });
      speech.reset();
      setShowSave(false);
      router.push(`/note/${id}`);
    } catch (e) {
      Alert.alert(
        "Save failed",
        e instanceof Error ? e.message : "Could not save note",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-ink-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8 pt-4"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-2 text-sm leading-5 text-ink-500">
          Privacy tip: get permission before recording teachers or classmates.
          Some schools and states require consent.
        </Text>

        {!speech.support.supported ? (
          <View className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Text className="text-sm leading-5 text-amber-900">
              {speech.support.reason}
            </Text>
          </View>
        ) : null}

        {speech.error ? (
          <View className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-700">{speech.error}</Text>
          </View>
        ) : null}

        <View className="mb-6 items-center">
          <Text className="mb-4 font-mono text-3xl text-ink-900">
            {formatTimer(speech.elapsedSec)}
          </Text>
          <RecordButton
            isListening={speech.isListening}
            onPress={onRecordPress}
            disabled={!speech.support.supported}
          />
        </View>

        <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">
          Live transcript
        </Text>
        <Text className="mb-2 text-xs text-ink-500">
          Gray text = interim guess · Dark text = final words
        </Text>
        <LiveTranscript
          finalText={speech.finalText}
          interimText={speech.interimText}
        />

        <View className="mt-5 flex-row gap-3">
          <Pressable
            onPress={openSave}
            className="flex-1 items-center rounded-xl bg-ink-900 py-3.5 active:opacity-90"
          >
            <Text className="font-semibold text-white">Save note</Text>
          </Pressable>
          <Pressable
            onPress={() => speech.reset()}
            className="items-center rounded-xl border border-ink-200 bg-white px-5 py-3.5 active:opacity-90"
          >
            <Text className="font-semibold text-ink-700">Clear</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={showMicRationale} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full rounded-2xl bg-white p-5">
            <Text className="mb-2 text-xl font-bold text-ink-900">
              Microphone access
            </Text>
            <Text className="mb-5 text-base leading-6 text-ink-500">
              Speak Notes uses your microphone so your words can appear as text
              while you talk. Audio stays on your device for recognition — we
              only save the transcript you choose to keep.
            </Text>
            <Pressable
              onPress={confirmMicAndStart}
              className="mb-2 items-center rounded-xl bg-accent py-3"
            >
              <Text className="font-semibold text-white">Allow & start</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowMicRationale(false)}
              className="items-center py-2"
            >
              <Text className="text-ink-500">Not now</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showSave} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-5 pb-10 pt-5">
            <Text className="mb-4 text-xl font-bold text-ink-900">Save note</Text>
            <Text className="mb-1 text-sm text-ink-700">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Biology lecture"
              placeholderTextColor="#94a3b8"
              className="mb-3 rounded-xl border border-ink-200 px-4 py-3 text-base text-ink-900"
            />
            <Text className="mb-1 text-sm text-ink-700">Class / subject</Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Biology"
              placeholderTextColor="#94a3b8"
              className="mb-5 rounded-xl border border-ink-200 px-4 py-3 text-base text-ink-900"
            />
            <Pressable
              disabled={saving}
              onPress={saveNote}
              className="mb-2 items-center rounded-xl bg-accent py-3.5"
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-semibold text-white">Save</Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => setShowSave(false)}
              className="items-center py-2"
            >
              <Text className="text-ink-500">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
