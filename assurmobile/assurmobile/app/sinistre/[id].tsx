import fetchData from "@/hooks/fetchData";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Card, Switch, Text } from "react-native-paper";

type SinistreType = {
  id: number | string;
  plate?: string;
  sinister_datetime?: any;
  context?: string;
  driver_firstname?: string;
  driver_lastname?: string;
  call_datetime?: any;
  driver_responsability: boolean;
};

export default function SinistreDetailScreen() {
  // implémenter un state local pour charger le sinistre localement
  const [sinistre, setSinistre] = useState<SinistreType>();

  console.log("SinistreDetailScreen : ", sinistre);

  // récupérer le paramètre d'URL
  const { id } = useLocalSearchParams<{ id: string }>();

  // fetch récupérer le sinistre courant
  useEffect(() => {
    fetchData("/sinisters/" + id, "GET", {}, true)
      .then((data) => {
        setSinistre(data.sinister);
        console.log("DATA LOADED ", data);
      })
      .catch((err) => {
        console.log("Error on get sinistre " + err.message);
      });
  }, [id]);

  console.log("SinistreDetailScreen apres fetch : ", sinistre);

  if (!sinistre) {
    return (
      <View>
        <Text>Le sinistre est introuvable !</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Card key={sinistre.id}>
        <Card.Title title="Mon sinistre" />
        <Card.Content>
          <Text>Plaque : {sinistre.plate}</Text>
          <Text>Date du sinistre : {sinistre.sinister_datetime}</Text>
          <Text>
            Date de signalement du sinistre : {sinistre.call_datetime}
          </Text>
          <Text>Nom du conducteur : {sinistre.driver_lastname}</Text>
          <Text>Prénom du conducteur : {sinistre.driver_firstname}</Text>
          <Text>Contexte du sinistre : {sinistre.context}</Text>
          <Text>Responsabilité conducteur : </Text>
          <Switch disabled value={sinistre.driver_responsability} />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}