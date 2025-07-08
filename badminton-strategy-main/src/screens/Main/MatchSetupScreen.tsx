import { NavigationProp, useNavigation } from "@react-navigation/native";
import { usePostAnalyzeMatchResultMutation, usePostMatchMutation } from "@src/app/redux/api/matchApi";
import { setMatch } from "@src/app/redux/slices/matchSlice";
import { RootStackParamList } from "Main";
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Text,
  RadioButton,
  TextInput,
  Button,
  Divider,
  IconButton,
} from "react-native-paper";
import { useDispatch } from "react-redux";

const MatchSetupScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [mode, setMode] = useState<"simple" | "double">("simple");
  const [player1, setPlayer1] = useState("");
  const [partner, setPartner] = useState("");
  const [opponent1, setOpponent1] = useState("");
  const [opponent2, setOpponent2] = useState("");
  const [isPlayer1Locked, setIsPlayer1Locked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [postMatch] =
      usePostMatchMutation();

  const handlePlayer1AutoFill = () => {
    setPlayer1("Moi");
    setIsPlayer1Locked(true);
  };

 const handleSubmit = async () => {
    if (!player1 || !opponent1 || (mode === "double" && (!partner || !opponent2))) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    let success = false;

    try {
      setIsLoading(true);
      if (mode === "double") {
        await postMatch({
          type: mode,
          player_1_name: player1,
          player_2_name: partner,
          opponent_1_name: opponent1,
          opponent_2_name: opponent2,
          sets: [],
        }).unwrap();

        navigation.navigate('MatchDouble', {
          player1,
          player2: partner,
          opponent1,
          opponent2,
        });
      } else {
        const result = await postMatch({
          type: mode,
          player_1_name: player1,
          opponent_1_name: opponent1,
          sets: [],
        }).unwrap();
        dispatch(setMatch(result.match));

        navigation.navigate('MatchSingle');
      }

      success = true;
    } catch (error) {
      console.error("Erreur lors de la création du match :", error);
      Alert.alert("Erreur", "Une erreur est survenue pendant l'enregistrement.");
    } finally {
      setIsLoading(false);
      if (success) {
        Alert.alert("Succès", "Configuration enregistrée !");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurer le match</Text>
      <Text style={styles.label}>Mode</Text>
      <RadioButton.Group
        onValueChange={(value) => setMode(value as "simple" | "double")}
        value={mode}
      >
        <View style={styles.radioGroup}>
          <RadioButton value="simple" />
          <Text style={styles.radioLabel}>Simple</Text>
        </View>
        <View style={styles.radioGroup}>
          <RadioButton value="double" />
          <Text style={styles.radioLabel}>Double</Text>
        </View>
      </RadioButton.Group>

      <Divider style={styles.divider} />

      <View style={styles.inputWithButton}>
        <TextInput
          label="Joueur 1 (Vous)"
          value={player1}
          onChangeText={setPlayer1}
          mode="outlined"
          style={[styles.inputWithLock, isPlayer1Locked && styles.lockedInput]}
          editable={!isPlayer1Locked}
        />
        <IconButton
          icon={isPlayer1Locked ? "lock-open" : "lock"}
          size={24}
          onPress={() => {
            if (isPlayer1Locked) {
              setIsPlayer1Locked(false);
            } else {
              handlePlayer1AutoFill();
            }
          }}
        />
      </View>

      {mode === "double" && (
        <TextInput
          label="Partenaire"
          value={partner}
          onChangeText={setPartner}
          mode="outlined"
          style={styles.input}
        />
      )}

      <TextInput
        label="Adversaire 1"
        value={opponent1}
        onChangeText={setOpponent1}
        mode="outlined"
        style={styles.input}
      />

      {mode === "double" && (
        <TextInput
          label="Adversaire 2"
          value={opponent2}
          onChangeText={setOpponent2}
          mode="outlined"
          style={styles.input}
        />
      )}

     <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={isLoading}
        loading={isLoading}
        style={styles.button}
      >
        Prêt pour le match
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 16,
  },
  inputWithLock: {
    marginBottom: 16,
    flex: 1
  },
  input: {
    marginBottom: 16,
  },
  lockedInput: {
    backgroundColor: "#f0f0f0",
  },
  inputWithButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 16,
  },
});

export default MatchSetupScreen;
