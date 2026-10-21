import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { api } from "@/convex/_generated/api";

export default function AccountScreen() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.current);

  return (
    <View className="flex-1 bg-ink-50 px-5 pt-6">
      <Text className="mb-6 text-3xl font-bold text-ink-900">Account</Text>

      {user === undefined ? (
        <ActivityIndicator color="#0d9488" />
      ) : (
        <View className="mb-8">
          <Text className="mb-1 text-sm uppercase tracking-wide text-ink-500">
            Signed in as
          </Text>
          <Text className="text-lg text-ink-900">
            {user?.email ?? user?.name ?? "Signed-in user"}
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => void signOut()}
        className="items-center rounded-xl border border-ink-200 bg-white py-3.5 active:opacity-90"
      >
        <Text className="font-semibold text-ink-900">Sign out</Text>
      </Pressable>

      <Text className="mt-8 text-sm leading-5 text-ink-500">
        Pro upgrades (longer lectures, AI study tools) come in a later phase. For now
        everything in Speak Notes is free.
      </Text>
    </View>
  );
}
