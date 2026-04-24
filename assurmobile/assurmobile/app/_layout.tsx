import { UserProvider } from "@/contexts/UserContext";
import { Stack } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#5B3CC4",
    secondary: "#7C5CE0",
    background: "#F5F6FB",
    surface: "#FFFFFF",
    onSurface: "#1E1F24",
    outline: "#D9DCE8",
  },
  roundness: 14,
};

export default function RootLayout() {
  return (
    <PaperProvider theme={customTheme}>
      <UserProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#5B3CC4" },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { fontWeight: "700" },
            contentStyle: { backgroundColor: "#F5F6FB" },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Mes sinistres" }} />
          <Stack.Screen name="login" options={{ title: "Connexion" }} />
          <Stack.Screen name="sinistre/[id]" options={{ title: "Détail sinistre" }} />
        </Stack>
      </UserProvider>
    </PaperProvider>
  );
}