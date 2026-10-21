import { Tabs } from "expo-router";
import { Text } from "react-native";

function TabLabel({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  return (
    <Text
      className={`text-[11px] ${focused ? "font-semibold text-accent-dark" : "text-ink-500"}`}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#f4f7f6" },
        headerTitleStyle: { color: "#13241f", fontWeight: "700" },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e4ebe8",
        },
        tabBarActiveTintColor: "#0f766e",
        tabBarInactiveTintColor: "#3d5a50",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Record",
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Record" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "My Notes",
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Notes" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Learn" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Account" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
