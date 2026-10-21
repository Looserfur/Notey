import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

export type NoteCardProps = {
  id: string;
  title: string;
  subject: string;
  transcript: string;
  createdAt: number;
};

function formatDate(ms: number) {
  try {
    return new Date(ms).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function NoteCard({ id, title, subject, transcript, createdAt }: NoteCardProps) {
  const preview =
    transcript.trim().length > 120
      ? `${transcript.trim().slice(0, 120)}…`
      : transcript.trim() || "No transcript yet";

  return (
    <Link href={`/note/${id}`} asChild>
      <Pressable className="mb-3 border-b border-ink-100 pb-3 active:opacity-70">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-ink-900" numberOfLines={1}>
            {title}
          </Text>
          <Text className="ml-2 text-xs text-ink-500">{formatDate(createdAt)}</Text>
        </View>
        <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-accent-dark">
          {subject}
        </Text>
        <Text className="text-sm leading-5 text-ink-500" numberOfLines={2}>
          {preview}
        </Text>
      </Pressable>
    </Link>
  );
}
