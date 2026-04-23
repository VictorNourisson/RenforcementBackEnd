import { Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useRootNavigationState, useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { useCurrentUser } from "@/contexts/UserContext";

export default function Index() {
  const [value, onChangeTitle] = useState("test ");
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const user = useCurrentUser();

  useEffect(() => {
    if (rootNavigationState?.key) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>To Edit this value : {value}.</Text>
      <Pressable
        onPress={() => {
          onChangeTitle("new Value");
        }}
      >
        <Text>Press on this link</Text>
      </Pressable>
      <Button onPress={() => router.navigate("/login")}>Se connecter</Button>
    </View>
  );
}