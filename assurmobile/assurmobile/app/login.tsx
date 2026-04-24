import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Connexion
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Connecte-toi pour accéder à tes sinistres.
          </Text>
          <TextInput
            label="identifiant"
            mode="outlined"
            style={styles.input}
            onChangeText={setEmail}
          />
          <TextInput
            label="mot de passe"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            onChangeText={setMotDePasse}
          />
          <HelperText type="error" visible={Boolean(error)}>
            {error}
          </HelperText>
          <Button mode="contained" onPress={login}>
            Se connecter
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F5F6FB",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7E3F5",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontWeight: "700",
    color: "#2A2440",
    marginBottom: 4,
  },
  subtitle: {
    color: "#6A647E",
    marginBottom: 14,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
});