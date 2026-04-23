import React, { useContext, useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "@/contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import fetchData from "@/hooks/fetchData";

type JwtPayload = {
  user: {};
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const login = async () => {
    try {
      const { token } = await fetchData(
        "/auth/login",
        "POST",
        { email, mot_de_passe },
        false,
      );
      console.log("token : ", token);
      await AsyncStorage.setItem("token", token);
      const user = jwtDecode<JwtPayload>(token);
      console.log("user : ", user);
      setUser(user);
      router.push({ pathname: "/" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Error during login: ", err);
    }
  };

  return (
    <View>
      <Card.Content>
        <Text>Connection</Text>
        <TextInput label="identifiant" onChangeText={setEmail}></TextInput>
        <TextInput
          label="mot de passe"
          secureTextEntry
          onChangeText={setMotDePasse}
        ></TextInput>
        <HelperText type="error" visible={Boolean(error)}>
          {error}
        </HelperText>
        <Button mode="contained" onPress={login}>
          Se connecter
        </Button>
      </Card.Content>
    </View>
  );
}