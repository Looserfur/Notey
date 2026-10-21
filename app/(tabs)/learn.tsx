import { ScrollView, Text, View } from "react-native";
import { LessonCard } from "@/components/LessonCard";

const LESSONS = [
  {
    title: "Sound → numbers",
    body: "Your microphone turns sound waves into digital audio — a stream of numbers a computer can process.",
  },
  {
    title: "Slicing",
    body: "That audio is cut into tiny pieces only a few milliseconds long so the model can look at short slices of speech.",
  },
  {
    title: "Pattern matching",
    body: "A trained model guesses which sounds map to which words, using patterns it learned from lots of speech data.",
  },
  {
    title: "Context",
    body: "Nearby words help the model pick “their” vs “there” vs “they’re.” Meaning comes from the whole sentence, not just one sound.",
  },
  {
    title: "Interim vs final results",
    body: "Gray text is the app’s best guess so far (interim). Dark text means the recognizer is confident and those words are locked in (final).",
  },
] as const;

export default function LearnScreen() {
  return (
    <ScrollView className="flex-1 bg-ink-50" contentContainerClassName="px-5 py-6">
      <Text className="mb-2 text-3xl font-bold text-ink-900">How speech-to-text works</Text>
      <Text className="mb-8 text-base leading-6 text-ink-500">
        Five short lessons — the same ideas that power Speak Notes on the web and on
        your phone.
      </Text>

      {LESSONS.map((lesson, i) => (
        <LessonCard
          key={lesson.title}
          step={i + 1}
          title={lesson.title}
          body={lesson.body}
        />
      ))}

      <View className="mt-2 border-t border-ink-100 pt-6">
        <Text className="mb-2 text-xl font-semibold text-ink-900">Recording tips</Text>
        <Text className="mb-2 text-base leading-7 text-ink-500">
          • Speak clearly and keep the mic close.{"\n"}
          • Pause briefly between ideas — silence can end a recognition session; Speak
          Notes restarts automatically.{"\n"}
          • Ask before recording other people.{"\n"}
          • Use Chrome, Edge, or Safari on the web (Firefox is not supported).
        </Text>
      </View>
    </ScrollView>
  );
}
