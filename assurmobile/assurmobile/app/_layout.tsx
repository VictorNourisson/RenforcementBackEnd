import { UserProvider } from "@/contexts/UserContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <UserProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Homepage" }} />
          <Stack.Screen name="login" options={{ title: "Connexion" }} />
        </Stack>
      </UserProvider>
    </PaperProvider>
  );
}