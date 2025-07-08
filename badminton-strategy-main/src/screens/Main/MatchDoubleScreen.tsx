import React, { useState } from "react";
import { View, StyleSheet, Alert, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Text,
  Button,
  Menu,
  Provider,
  Divider,
  IconButton,
} from "react-native-paper";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "Main";

type Hit = {
  position: { x: number; y: number }; // Position du volant
  player: string; // Joueur ayant frappé
};

type MatchScreenProps = {
    route: RouteProp<RootStackParamList, 'MatchDouble'>;
  };
  
const MatchDoubleScreen: React.FC<MatchScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { player1, player2, opponent1, opponent2 } = route.params;
  const [players, setPlayers] = useState(["Joueur 1", "Joueur 2", "Joueur 3", "Joueur 4"]);
  const [server, setServer] = useState<string | null>(null);
  const [hits, setHits] = useState<Hit[]>([]);
  const [courtSize, setCourtSize] = useState<{ width: number; height: number } | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [winnerMenuVisible, setWinnerMenuVisible] = useState(false);
  const [pointWinner, setPointWinner] = useState<string | null>(null);

  const isSingle = players[1] === undefined || players[3] === undefined;

  const handleSelectServer = (player: string) => {
    setServer(player);
    setMenuVisible(false);
  };

  const handleCourtPress = (x: number, y: number) => {
    if (!server) {
      Alert.alert("Erreur", "Veuillez sélectionner le serveur avant de continuer.");
      return;
    }

    setHits((prevHits) => [...prevHits, { position: { x, y }, player: "" }]);
  };

  const handlePointEnd = () => {
    setWinnerMenuVisible(true);
  };

  const handleWinnerSelect = (winner: string) => {
    setPointWinner(winner);
    setHits([]); // Réinitialiser les frappes pour le prochain point
    setWinnerMenuVisible(false);
  };

  const renderHits = () => {
    if (!courtSize) return null;

    return hits.map((hit, index) => (
      <View
        key={index}
        style={{
          position: "absolute",
          top: hit.position.y * courtSize.height - 10,
          left: hit.position.x * courtSize.width - 10,
          width: 20,
          height: 20,
          backgroundColor: "red",
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
      </View>
    ));
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Bouton de retour */}
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />

        <Text style={styles.title}>Badminton Match</Text>
        <Divider style={styles.divider} />

        {/* Sélection du serveur */}
        {!server && (
          <View style={{paddingTop: 2}}>
            <Text style={styles.label}>Qui commence à servir ???</Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setMenuVisible(true)}>
                  {server || "Sélectionnez un joueur"}
                </Button>
              }
            >
              {players.map((player) => (
                <Menu.Item
                  key={player}
                  onPress={() => handleSelectServer(player)}
                  title={player}
                />
              ))}
            </Menu>
          </View>
        )}

        {/* Terrain cliquable */}
        {server && (
          <View>
            <Text style={styles.label}>Cliquez sur le terrain</Text>
            <View
              style={styles.court}
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setCourtSize({ width, height });
              }}
              onTouchEnd={(e) => {
                if (!courtSize) return;

                const { locationX, locationY } = e.nativeEvent;
                const x = locationX / courtSize.width;
                const y = locationY / courtSize.height;
                handleCourtPress(x, y);
              }}
            >
              <View style={styles.net} />
              <Text style={[styles.playerLabel, { top: 10 }]}>
                {players[0]} {isSingle ? "(vous)" : ""}
              </Text>
              <Text style={[styles.playerLabel, { bottom: 10 }]}>
                {isSingle ? players[2] : players[3]}
              </Text>
              {renderHits()}
            </View>
            <Button mode="contained" onPress={handlePointEnd} style={styles.endPointButton}>
              Terminer le point
            </Button>
          </View>
        )}

        {/* Menu pour sélectionner le gagnant du point */}
        <Menu
          visible={winnerMenuVisible}
          onDismiss={() => setWinnerMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setWinnerMenuVisible(true)}>
              {pointWinner || "Sélectionnez le gagnant du point"}
            </Button>
          }
        >
          {players.map((player) => (
            <Menu.Item
              key={player}
              onPress={() => handleWinnerSelect(player)}
              title={player}
            />
          ))}
        </Menu>

        {/* Résumé des frappes */}
        <Divider style={styles.divider} />
        {hits.length > 0 && (
          <View>
            <Text style={styles.label}>Résumé des frappes :</Text>
            {hits.map((hit, index) => (
              <Text key={index} style={styles.hitText}>
                {hit.player || "Inconnu"} : ({hit.position.x.toFixed(2)}, {hit.position.y.toFixed(2)})
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  court: {
    width: "100%",
    height: 400,
    backgroundColor: "#d9f7be",
    borderWidth: 1,
    borderColor: "#000",
    position: "relative",
    marginBottom: 16,
  },
  net: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#000",
  },
  playerLabel: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    width: "100%",
  },
  hitText: {
    fontSize: 14,
    marginVertical: 4,
  },
  endPointButton: {
    marginTop: 16,
  },
});

export default MatchDoubleScreen;
