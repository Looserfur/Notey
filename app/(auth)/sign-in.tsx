import { useAuthActions } from "@convex-dev/auth/react";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri();

export default function SignInScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (flow === "signUp" && !ageConfirmed) {
      setError("You must confirm you are 13 or older to create an account.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setBusy(true);
    try {
      await signIn("password", { email: email.trim(), password, flow });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    if (flow === "signUp" && !ageConfirmed) {
      setError("You must confirm you are 13 or older to create an account.");
      return;
    }
    setBusy(true);
    try {
      const { redirect } = await signIn("google", { redirectTo });
      if (Platform.OS === "web") {
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(
        redirect!.toString(),
        redirectTo,
      );
      if (result.type === "success") {
        const code = new URL(result.url).searchParams.get("code");
        if (code) {
          await signIn("google", { code });
        }
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Google sign-in failed. Ensure AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET are set in Convex.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-ink-50"
      contentContainerClassName="flex-grow justify-center px-6 py-12"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="mb-1 text-4xl font-bold text-ink-900">Speak Notes</Text>
      <Text className="mb-8 text-base text-ink-500">
        Talk, watch words appear, save and study.
      </Text>

      <View className="mb-4 flex-row gap-2">
        <Pressable
          onPress={() => setFlow("signIn")}
          className={`rounded-lg px-4 py-2 ${flow === "signIn" ? "bg-ink-900" : "bg-ink-100"}`}
        >
          <Text className={flow === "signIn" ? "text-white" : "text-ink-700"}>
            Sign in
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFlow("signUp")}
          className={`rounded-lg px-4 py-2 ${flow === "signUp" ? "bg-ink-900" : "bg-ink-100"}`}
        >
          <Text className={flow === "signUp" ? "text-white" : "text-ink-700"}>
            Sign up
          </Text>
        </Pressable>
      </View>

      <Text className="mb-1 text-sm font-medium text-ink-700">Email</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@school.edu"
        placeholderTextColor="#94a3b8"
        className="mb-3 rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900"
      />

      <Text className="mb-1 text-sm font-medium text-ink-700">Password</Text>
      <TextInput
        secureTextEntry
        autoComplete={flow === "signUp" ? "new-password" : "password"}
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        placeholderTextColor="#94a3b8"
        className="mb-4 rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900"
      />

      {flow === "signUp" ? (
        <Pressable
          onPress={() => setAgeConfirmed((v) => !v)}
          className="mb-4 flex-row items-start gap-3"
        >
          <View
            className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
              ageConfirmed ? "border-accent bg-accent" : "border-ink-300 bg-white"
            }`}
          >
            {ageConfirmed ? <Text className="text-xs text-white">✓</Text> : null}
          </View>
          <Text className="flex-1 text-sm leading-5 text-ink-700">
            I confirm I am 13 years of age or older. (Required under US COPPA —
            Speak Notes is not for children under 13.)
          </Text>
        </Pressable>
      ) : null}

      {error ? (
        <Text className="mb-3 text-sm text-red-600">{error}</Text>
      ) : null}

      <Pressable
        disabled={busy}
        onPress={onSubmit}
        className="mb-3 items-center rounded-xl bg-accent py-3.5 active:opacity-90"
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-semibold text-white">
            {flow === "signIn" ? "Sign in with email" : "Create account"}
          </Text>
        )}
      </Pressable>

      <Pressable
        disabled={busy}
        onPress={onGoogle}
        className="mb-6 items-center rounded-xl border border-ink-200 bg-white py-3.5 active:opacity-90"
      >
        <Text className="text-base font-semibold text-ink-900">
          Continue with Google
        </Text>
      </Pressable>

      <Text className="text-center text-xs leading-5 text-ink-500">
        Email/password works once Convex Auth JWT keys are set. Google also
        needs AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in your Convex dashboard.
      </Text>
    </ScrollView>
  );
}
