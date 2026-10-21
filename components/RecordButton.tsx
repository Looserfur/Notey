import { Pressable, Text, View } from "react-native";

type Props = {
  isListening: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function RecordButton({ isListening, onPress, disabled }: Props) {
  return (
    <View className="items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isListening ? "Stop recording" : "Start recording"}
        disabled={disabled}
        onPress={onPress}
        className={`h-28 w-28 items-center justify-center rounded-full ${
          isListening ? "bg-red-500" : "bg-accent"
        } ${disabled ? "opacity-40" : "active:opacity-90"}`}
      >
        <View
          className={`h-10 w-10 ${
            isListening ? "rounded-md bg-white" : "rounded-full bg-white/90"
          }`}
        />
      </Pressable>
      <Text className="mt-3 text-base font-semibold text-ink-700">
        {isListening ? "Tap to stop" : "Tap to record"}
      </Text>
    </View>
  );
}
