import "../global.css";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

const convex = new ConvexReactClient(
  convexUrl ?? "https://placeholder.convex.cloud",
);

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function AuthRouter({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-50">
        <ActivityIndicator color="#0d9488" />
      </View>
    );
  }

  return <>{children}</>;
}

function MissingConvexConfig() {
  return (
    <View className="flex-1 items-center justify-center bg-ink-50 px-6">
      <Text className="mb-2 text-center text-2xl font-bold text-ink-900">
        Speak Notes
      </Text>
      <Text className="text-center text-base leading-6 text-ink-500">
        Set EXPO_PUBLIC_CONVEX_URL in .env.local after running{" "}
        <Text className="font-semibold text-ink-700">npx convex dev</Text>, then
        restart Expo.
      </Text>
    </View>
  );
}

export default function RootLayout() {
  if (!convexUrl) {
    return <MissingConvexConfig />;
  }

  return (
    <ConvexAuthProvider
      client={convex}
      storage={
        Platform.OS === "android" || Platform.OS === "ios"
          ? secureStorage
          : undefined
      }
    >
      <AuthRouter>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="note/[id]"
            options={{
              headerShown: true,
              title: "Note",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthRouter>
    </ConvexAuthProvider>
  );
}
