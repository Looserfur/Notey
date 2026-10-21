import { Text, View } from "react-native";

type Props = {
  step: number;
  title: string;
  body: string;
};

export function LessonCard({ step, title, body }: Props) {
  return (
    <View className="mb-5">
      <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent-dark">
        Lesson {step}
      </Text>
      <Text className="mb-2 text-xl font-semibold text-ink-900">{title}</Text>
      <Text className="text-base leading-7 text-ink-500">{body}</Text>
    </View>
  );
}
