import { ScrollView, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Redirect, useRootNavigationState, useRouter } from "expo-router";
import { Button, Card, Text } from "react-native-paper";
import { UserContext } from "@/contexts/UserContext";
import fetchData from "@/hooks/fetchData";

type SinistreType = {
  id: number | string;
  plate?: string;
  sinister_datetime?: any;
  context?: string;
};

export default function Index() {
  const [sinistres, setSinistres] = useState<SinistreType[]>();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData("/sinisters", "GET", {}, true).then((data) => {
      setSinistres(data.sinisters);
      console.log("DATA LOADED ", data);
    });
  }, []);

  console.log("USER : ", user);

  if (!user) {
    console.log("REDIRECT....", user);
    return <Redirect href="/login" />;
  }

  if (rootNavigationState?.key) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.pageTitle}>
          Liste des sinistres
        </Text>
        {sinistres?.map((sinistre: SinistreType) => (
          <Card key={sinistre.id} style={styles.card}>
            <Card.Title
              title={"Sinistre n°" + sinistre.id}
              subtitle={sinistre.context}
              titleStyle={styles.cardTitle}
            />
            <Card.Content>
              <Text variant="titleMedium" style={styles.plateText}>
                Véhicule : {sinistre.plate}
              </Text>
              <Text variant="bodyMedium" style={styles.dateText}>
                Soumis le : {sinistre.sinister_datetime}
              </Text>
            </Card.Content>
            <Card.Actions style={styles.actions}>
              <Button
                mode="contained"
                onPress={() =>
                  router.push({
                    pathname: "/sinistre/[id]",
                    params: { id: sinistre.id },
                  })
                }
              >
                Accéder au sinistre
              </Button>
            </Card.Actions>
          </Card>
        ))}
        {!sinistres?.length ? (
          <View style={styles.emptyState}>
            <Text>Aucun sinistre pour le moment.</Text>
          </View>
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  pageTitle: {
    fontWeight: "700",
    color: "#2A2440",
    marginBottom: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7E3F5",
    elevation: 1,
  },
  cardTitle: {
    color: "#2A2440",
    fontWeight: "700",
  },
  plateText: {
    color: "#332A54",
    fontWeight: "600",
  },
  dateText: {
    marginTop: 6,
    color: "#68627C",
  },
  actions: {
    justifyContent: "flex-end",
    paddingRight: 8,
    paddingBottom: 8,
  },
  emptyState: {
    marginTop: 20,
    padding: 16,
    alignItems: "center",
  },
});