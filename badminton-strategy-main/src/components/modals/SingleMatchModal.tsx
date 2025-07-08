import { HistoryHit, Hit } from '@src/app/datasource/match.type';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Text, Dimensions } from 'react-native';
import { Modal, IconButton } from 'react-native-paper';
import Mosaic from '../mosaic/Mosaic';
import { ScrollView } from 'react-native-gesture-handler';
import { translateLoosingShot, translateWinningShot } from '@src/tools/utils';

interface ModalsProps {
  visible: boolean;
  server: string | null;
  player1: string;
  opponent1: string;
  modalWinPoint: boolean;
  pointWinner: string | null;
  stepModalWinPoint: number;
  shotErrorType: 'error' | 'shot' | null;
  editingPointIndex: number | null;
  hits: Hit[];
  currentHits: Hit[];
  history: HistoryHit[];
  setPointWinner: (value: string | null) => void;
  setShotErrorType: (value: 'error' | 'shot' | null) => void;
  setStepModalWinPoint: (value: number) => void;
  setServer: (value: string) => void;
  setVisible: (value: boolean) => void;
  setModalWinPoint: (value: boolean) => void;
  setHistory: (value: HistoryHit[]) => void;
  setHits: (value: Hit[]) => void;
  setCurrentHits: (value: Hit[]) => void;
  setEditingPointIndex: (value: number | null) => void;
}

const height = Dimensions.get('window').height

const SingleMatchModal: React.FC<ModalsProps> = ({
  visible,
  server,
  player1,
  opponent1,
  modalWinPoint,
  pointWinner,
  stepModalWinPoint,
  shotErrorType,
  editingPointIndex,
  hits,
  history,
  currentHits,
  setPointWinner,
  setShotErrorType,
  setStepModalWinPoint,
  setServer,
  setVisible,
  setModalWinPoint,
  setHistory,
  setHits,
  setCurrentHits,
  setEditingPointIndex
}) => {
  const player1Score = history.filter(h => h.winLoose === 'win').length;
  const opponent1Score = history.filter(h => h.winLoose === 'loose').length;
  const isMatchNotStarted = player1Score === 0 && opponent1Score === 0;

  const handleWinningSelect = ( typeShot: string) => {
    console.log(typeShot);
    if(editingPointIndex === null) {
      handleWinnerSelect(typeShot);
    } else {
      handleUpdatePoint()
    }
    setShotErrorType(null);
    setStepModalWinPoint(0);
    
    setHits([]);
    setModalWinPoint(false);
    setPointWinner(null);
    setStepModalWinPoint(0);
  };

  const handleWinnerSelect = (typeShot: string | null) => {
    if (pointWinner && typeShot) {
      // Ajout à l'historique
      setHistory([
        ...history,
        {winLoose: pointWinner === player1 ? 'win' : 'loose', typeShot, hits: hits },
      ]);
    }

    setHits([]); // Réinitialiser les frappes pour le prochain point
    setCurrentHits([]);
    setModalWinPoint(false);
    setShotErrorType(null);
    setPointWinner(null);
  };

  const handleUpdatePoint = () => {
    if (pointWinner) {
      if (editingPointIndex !== null) {
        setHistory(
          history.map((item, idx) =>
            idx === editingPointIndex ? { ...item, hits: hits, winLoose: pointWinner === player1 ? 'win' : 'loose' } : item
          )
        );
      }
      setEditingPointIndex(null);
      setHits(currentHits); // Réinitialiser les frappes pour le prochain point
      setModalWinPoint(false);
      setShotErrorType(null);
      setPointWinner(null);
    }
  };

  return (
    <>
      {/* Modal: Choisir le serveur */}
      {!server && isMatchNotStarted && (
        <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modal}>
          <View>
            <View style={styles.headModal}>
              <Text style={styles.label}>Qui commence à servir ?</Text>
            </View>
            <View style={styles.playerChoiceContainer}>
              <TouchableOpacity
                style={styles.cardPlayer}
                onPress={() => {
                  setServer(player1);
                  setVisible(false);
                }}
              >
                <ImageBackground
                  source={require('/assets/img/match/player1.png')}
                  style={styles.playerImage}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.playerTitle}>{player1}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardPlayer}
                onPress={() => {
                  setServer(opponent1);
                  setVisible(false);
                }}
              >
                <ImageBackground
                  source={require('/assets/img/match/player2.png')}
                  style={styles.playerImage}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.playerTitle}>{opponent1}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal: Point gagnant */}
      <Modal visible={modalWinPoint} onDismiss={() => setModalWinPoint(false)} contentContainerStyle={styles.modal}>
      {
            stepModalWinPoint === 0 ? 
            (
            <View>
              <View style={styles.headModal}>
                <IconButton
                  icon="chevron-left"
                  iconColor={"black"}
                  size={20}
                  onPress={() => setModalWinPoint(false)}
                />
                <Text style={styles.label}>Avez vous gagné ou perdu ?</Text>
              </View>
              <View style={styles.playerChoiceContainer}>
                <TouchableOpacity
                  style={styles.cardplayer}
                  onPress={() => {
                    setPointWinner(player1);
                    setStepModalWinPoint(1);
                  }}
                >
                  <ImageBackground
                    source={require('/assets/img/match/player1.png')}
                    style={styles.playerImage}
                  >
                    <View style={styles.overlay}>
                      <Text style={styles.playerTitle}>Gagné</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cardplayer}
                  onPress={() => {
                    setPointWinner(opponent1);
                    setStepModalWinPoint(1);
                  }}
                >
                  <ImageBackground
                    source={require('/assets/img/match/player2.png')}
                    style={styles.playerImage}
                  >
                    <View style={styles.overlay}>
                      <Text style={styles.playerTitle}>Perdu</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
            ) : stepModalWinPoint === 1 && (
              <View>
                <View style={styles.headModal}>
                  <IconButton
                    icon="chevron-left"
                    iconColor={"black"}
                    size={20}
                    onPress={() => setStepModalWinPoint(0)}
                  />
                  <Text style={styles.label}>{pointWinner === player1 ? "Comment le point à été gagné ?" : "Comment le point à été perdu ?"}</Text>
                </View>
                <View style={{maxHeight: height * 0.6 }}>
                  <ScrollView>
                    <Mosaic type={pointWinner === player1 ? "WinningShot" : "OpponentError"} onSelect={handleWinningSelect} />
                    </ScrollView>
                </View>
              </View>
            )
          }
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    backgroundColor: 'white',
  },
  headModal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerChoiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPlayer: {
    width: '48%',
    aspectRatio: 1
  },
  playerImage: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardplayer: {
    width: "50%", // Trois colonnes (100% divisé par 3 avec un peu d'espace)
    aspectRatio: 1, // Les boutons sont carrés
  },
});

export default SingleMatchModal;
