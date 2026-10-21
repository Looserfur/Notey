import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export type SpeechSupport =
  | { supported: true }
  | { supported: false; reason: string };

function detectSpeechSupport(): SpeechSupport {
  if (Platform.OS !== "web") {
    return { supported: true };
  }
  if (typeof window === "undefined") {
    return {
      supported: false,
      reason: "Speech recognition needs a browser window.",
    };
  }
  const SpeechRecognitionCtor =
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: unknown })
      .webkitSpeechRecognition;
  if (!SpeechRecognitionCtor) {
    const isFirefox = /firefox/i.test(navigator.userAgent);
    return {
      supported: false,
      reason: isFirefox
        ? "Firefox doesn’t support live speech recognition. Try Chrome, Edge, or Safari."
        : "This browser doesn’t support live speech recognition. Try Chrome, Edge, or Safari.",
    };
  }
  return { supported: true };
}

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [support] = useState<SpeechSupport>(() => detectSpeechSupport());

  const wantListeningRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const clearRestartTimer = () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const startEngine = useCallback(() => {
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
      contextualStrings: ["Speak Notes", "homework", "lecture"],
    });
  }, []);

  const scheduleRestart = useCallback(() => {
    clearRestartTimer();
    if (!wantListeningRef.current) return;
    restartTimerRef.current = setTimeout(() => {
      if (!wantListeningRef.current) return;
      try {
        startEngine();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not restart recognition");
      }
    }, 250);
  }, [startEngine]);

  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
    setError(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    if (wantListeningRef.current) {
      scheduleRestart();
    }
  });

  useSpeechRecognitionEvent("result", (event) => {
    const pieces = event.results ?? [];
    if (pieces.length === 0) return;

    if (event.isFinal) {
      const chunk = pieces
        .map((r) => r.transcript.trim())
        .filter(Boolean)
        .join(" ");
      if (chunk) {
        setFinalText((prev) => (prev ? `${prev} ${chunk}` : chunk));
      }
      setInterimText("");
    } else {
      const interim = pieces
        .map((r) => r.transcript.trim())
        .filter(Boolean)
        .join(" ");
      setInterimText(interim);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (event.error === "aborted") return;
    if (event.error === "no-speech" || event.error === "speech-timeout") {
      if (wantListeningRef.current) {
        scheduleRestart();
      }
      return;
    }
    setError(event.message || event.error);
    if (wantListeningRef.current && event.error !== "not-allowed") {
      scheduleRestart();
    }
  });

  useEffect(() => {
    return () => {
      wantListeningRef.current = false;
      clearRestartTimer();
      clearTick();
      try {
        ExpoSpeechRecognitionModule.abort();
      } catch {
        // ignore
      }
    };
  }, []);

  const start = useCallback(async () => {
    if (!support.supported) {
      setError(support.reason);
      return false;
    }

    setError(null);
    const permission =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setError("Microphone permission is required to record notes.");
      return false;
    }

    wantListeningRef.current = true;
    startedAtRef.current = Date.now();
    setElapsedSec(0);
    clearTick();
    tickRef.current = setInterval(() => {
      if (startedAtRef.current) {
        setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }
    }, 500);

    try {
      startEngine();
      return true;
    } catch (e) {
      wantListeningRef.current = false;
      clearTick();
      setError(e instanceof Error ? e.message : "Could not start recognition");
      return false;
    }
  }, [startEngine, support]);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    clearRestartTimer();
    clearTick();
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
    setInterimText("");
  }, []);

  const reset = useCallback(() => {
    stop();
    setFinalText("");
    setInterimText("");
    setElapsedSec(0);
    setError(null);
    startedAtRef.current = null;
  }, [stop]);

  const transcript = [finalText, interimText].filter(Boolean).join(" ").trim();

  return {
    support,
    isListening,
    finalText,
    interimText,
    transcript,
    error,
    elapsedSec,
    start,
    stop,
    reset,
    setFinalText,
  };
}
