import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import { Route } from "expo-router";
import { useRouter } from "expo-router";

export default function Index() {
  const [value, onChangeTitle] = useState("test ");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>
        To Edit this value : {value}
        <Pressable
          onPress={() => {
            onChangeTitle("new Value ");
          }}
        >
          Press on this link
        </Pressable>
      </Text>
    </View>
  );
}