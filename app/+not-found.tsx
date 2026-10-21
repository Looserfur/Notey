import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-ink-50 px-6">
        <Text className="mb-3 text-xl font-bold text-ink-900">Page not found</Text>
        <Link href="/" className="text-accent-dark">
          Go home
        </Link>
      </View>
    </>
  );
}
