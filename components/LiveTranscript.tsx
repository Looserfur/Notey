import { ScrollView, Text, View } from "react-native";

type Props = {
  finalText: string;
  interimText: string;
  placeholder?: string;
};

export function LiveTranscript({
  finalText,
  interimText,
  placeholder = "Your words will appear here as you speak…",
}: Props) {
  const empty = !finalText && !interimText;

  return (
    <View className="min-h-[180px] flex-1 rounded-2xl border border-ink-200 bg-white px-4 py-3">
      <ScrollView>
        {empty ? (
          <Text className="text-base leading-7 text-ink-500/70">{placeholder}</Text>
        ) : (
          <Text className="text-base leading-7 text-ink-900">
            {finalText}
            {finalText && interimText ? " " : ""}
            {interimText ? (
              <Text className="text-interim">{interimText}</Text>
            ) : null}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
