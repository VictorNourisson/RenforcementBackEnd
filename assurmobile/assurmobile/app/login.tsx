import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, Card, HelperText, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mot_de_passe: motDePasse,
        }),
      });
      if (response.ok && response.status !== 204) {
        // Tente de parser le JSON seulement si le body existe
        try {
          const data = await response.json();
          console.log("data : ", data);
        } catch (jsonErr) {
          setError("Réponse du serveur invalide.");
        }
      } else if (response.status === 204) {
        setError("Aucune donnée reçue du serveur.");
      } else {
        // Essaye de lire le message d'erreur du backend
        let errorMsg = "Erreur lors de la connexion.";
        try {
          const errData = await response.json();
          if (errData && errData.message) errorMsg = errData.message;
        } catch {}
        setError(errorMsg);
      }
      console.log("login : ", response);
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
        <TextInput label="Email" onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput label="Mot de passe" onChangeText={setMotDePasse} secureTextEntry />
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