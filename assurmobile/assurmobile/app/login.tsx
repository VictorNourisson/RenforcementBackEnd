import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, Card, HelperText, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mot_de_passe,
        }),
      });
      if (!response.ok) setError("Echec de connexion");
      console.log("login : ", response);
      const { token } = await response.json();
      await AsyncStorage.setItem("token", token);
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