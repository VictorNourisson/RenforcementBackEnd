import fetchData, { fetchDocument } from "@/hooks/fetchData";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, HelperText, Switch, Text, TextInput, Chip } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";

type SinistreType = {
  id: number | string;
  plate?: string;
  sinister_datetime?: any;
  context?: string;
  driver_firstname?: string;
  driver_lastname?: string;
  call_datetime?: any;
  driver_responsability: boolean;
  cni_driver?: number;
  vehicle_registration_certificate?: number;
  insurance_certificate?: number;
};

export default function SinistreDetailScreen() {
  const [sinistre, setSinistre] = useState<SinistreType>();
  const [pickedFile, setPickedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [documentType, setDocumentType] = useState<string>("CNI_DRIVER");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cni_driver, setCniDriver] = useState("");
  const [vehicle_registration_certificate, setVehicleRegistrationCertificate] = useState("");
  const [insurance_certificate, setInsuranceCertificate] = useState("");

  const { id } = useLocalSearchParams<{ id: string }>();

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    if (!result.canceled) {
      setPickedFile(result.assets[0]);
      setError(null);
    }
  };

  const submitUploadForm = () => {
    const formData = new FormData();
    formData.append("type", documentType);

    if (pickedFile) {
      if (Platform.OS === "web") {
        const webfile = (pickedFile as DocumentPicker.DocumentPickerAsset & { file?: File }).file;
        if (webfile) formData.append("file", webfile);
      } else {
        formData.append("file", {
          uri: pickedFile.uri,
          name: pickedFile.name,
          type: pickedFile.mimeType || "application/octet-stream",
        } as unknown as Blob);
      }

      setUploading(true);
      setError(null);

      fetchDocument("/sinisters/" + id + "/upload-document", "POST", formData, true)
        .then(() => {
          // Rafraîchir le sinistre après l'upload
          return fetchData("/sinisters/" + id, "GET", {}, true);
        })
        .then((data) => {
          setSinistre(data.sinister);
          setPickedFile(null);
          setDocumentType("CNI_DRIVER");
        })
        .catch((error) => {
          console.log("Error on upload:", error);
          setError(error.message);
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      setError("Pas de fichier sélectionné");
    }
  };

  const submitAssociateForm = () => {
    const body: {
      cni_driver?: number;
      vehicle_registration_certificate?: number;
      insurance_certificate?: number;
    } = {};

    if (cni_driver.trim()) {
      body.cni_driver = Number(cni_driver);
    }
    if (vehicle_registration_certificate.trim()) {
      body.vehicle_registration_certificate = Number(vehicle_registration_certificate);
    }
    if (insurance_certificate.trim()) {
      body.insurance_certificate = Number(insurance_certificate);
    }

    if (!Object.keys(body).length) {
      setError("Aucun document renseigné");
      return;
    }

    setError(null);
    fetchData("/sinisters/" + id + "/documents", "POST", body, true)
      .then((data) => {
        setSinistre(data.sinister);
        setCniDriver("");
        setVehicleRegistrationCertificate("");
        setInsuranceCertificate("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchData("/sinisters/" + id, "GET", {}, true)
      .then((data) => {
        setSinistre(data.sinister);
      })
      .catch((err) => {
        console.log("Error on get sinistre " + err.message);
      });
  }, [id]);

  if (!sinistre) {
    return (
      <View style={styles.notFoundContainer}>
        <Text>Le sinistre est introuvable !</Text>
      </View>
    );
  }

  const documentTypeOptions = [
    { label: "CNI Conducteur", value: "CNI_DRIVER" },
    { label: "Certificat Immatriculation", value: "VEHICLE_REGISTRATION_CERTIFICATE" },
    { label: "Certificat Assurance", value: "INSURANCE_CERTIFICATE" },
    { label: "Rapport Diagnostic", value: "DIAGNOSTIC_REPORT" },
    { label: "Facture Prestataire", value: "CONTRACTOR_INVOICE" },
    { label: "RIB Assuré", value: "INSURED_RIB" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card key={sinistre.id} style={styles.card}>
        <Card.Title title="Mon sinistre" />
        <Card.Content>
          <Text style={styles.infoLine}>Plaque : {sinistre.plate}</Text>
          <Text style={styles.infoLine}>Date du sinistre : {sinistre.sinister_datetime}</Text>
          <Text style={styles.infoLine}>Date de signalement : {sinistre.call_datetime}</Text>
          <Text style={styles.infoLine}>Nom du conducteur : {sinistre.driver_lastname}</Text>
          <Text style={styles.infoLine}>Prénom du conducteur : {sinistre.driver_firstname}</Text>
          <Text style={styles.infoLine}>Contexte : {sinistre.context}</Text>
          <Text style={styles.infoLine}>Responsabilité conducteur : </Text>
          <Switch disabled value={sinistre.driver_responsability} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Envoyer un document" />
        <Card.Content>
          <Button mode="outlined" onPress={pickDocument} style={styles.button}>
            {pickedFile ? "Fichier : " + pickedFile.name : "Sélectionner un fichier"}
          </Button>

          <Text style={styles.labelText}>Type de document</Text>
          <View style={styles.chipContainer}>
            {documentTypeOptions.map((option) => (
              <Chip
                key={option.value}
                selected={documentType === option.value}
                onPress={() => setDocumentType(option.value)}
                style={styles.chip}
              >
                {option.label}
              </Chip>
            ))}
          </View>

          <HelperText type="error" visible={Boolean(error)}>
            {error}
          </HelperText>

          <Button
            mode="contained"
            onPress={submitUploadForm}
            loading={uploading}
            disabled={!pickedFile || uploading}
            style={styles.submitButton}
          >
            {uploading ? "Envoi en cours..." : "Envoyer le document"}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Documents associés" />
        <Card.Content>
          <View style={styles.documentsList}>
            {sinistre.cni_driver ? (
              <View style={styles.documentItem}>
                <Text style={styles.documentLabel}>CNI Conducteur :</Text>
                <Chip style={styles.documentChip}>{sinistre.cni_driver}</Chip>
              </View>
            ) : null}
            {sinistre.vehicle_registration_certificate ? (
              <View style={styles.documentItem}>
                <Text style={styles.documentLabel}>Certificat Immatriculation :</Text>
                <Chip style={styles.documentChip}>{sinistre.vehicle_registration_certificate}</Chip>
              </View>
            ) : null}
            {sinistre.insurance_certificate ? (
              <View style={styles.documentItem}>
                <Text style={styles.documentLabel}>Certificat Assurance :</Text>
                <Chip style={styles.documentChip}>{sinistre.insurance_certificate}</Chip>
              </View>
            ) : null}
            {!sinistre.cni_driver &&
              !sinistre.vehicle_registration_certificate &&
              !sinistre.insurance_certificate && (
                <Text style={styles.noDocumentsText}>
                  Aucun document associé pour le moment
                </Text>
              )}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Associer des documents existants :
          </Text>
          <TextInput
            label="ID document CNI conducteur"
            value={cni_driver}
            onChangeText={setCniDriver}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="ID certificat immatriculation"
            value={vehicle_registration_certificate}
            onChangeText={setVehicleRegistrationCertificate}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="ID certificat assurance"
            value={insurance_certificate}
            onChangeText={setInsuranceCertificate}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={submitAssociateForm}
          >
            Associer les documents
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7E3F5",
    elevation: 1,
  },
  sectionTitle: {
    color: "#2A2440",
    fontWeight: "700",
    marginBottom: 8,
  },
  infoLine: {
    marginBottom: 5,
    color: "#3A3354",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    marginTop: 4,
    marginBottom: 10,
  },
  linkedDocText: {
    color: "#615A76",
    marginBottom: 4,
  },
  button: {
    marginBottom: 12,
  },
  uploadButton: {
    marginTop: 12,
  },
  labelText: {
    color: "#2A2440",
    fontWeight: "600",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    marginBottom: 4,
  },
  documentsList: {
    gap: 8,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  documentLabel: {
    color: "#3A3354",
    fontWeight: "600",
    flex: 1,
  },
  documentChip: {
    backgroundColor: "#E7E3F5",
  },
  noDocumentsText: {
    color: "#68627C",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 8,
  },
});