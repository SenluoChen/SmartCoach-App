import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Provider, Portal, Text, Dialog, Button } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'Main';
import SingleMatchHeader from '@src/components/header/SingleMatchHeader';
import History from '@src/components/court/History';
import { HistoryHit, Hit } from '@src/app/datasource/match.type';
import SingleMatchModal from '@src/components/modals/SingleMatchModal';
import Court from '@src/components/court/Court';
import { usePostAnalyzeMatchResultMutation, usePutMatchMutation } from '@src/app/redux/api/matchApi';
import { useAppSelector } from '@src/app/hooks';
import { useDispatch } from 'react-redux';
import { setMatch, setMatches } from '@src/app/redux/slices/matchSlice';

type MatchScreenProps = {
  route: RouteProp<RootStackParamList, 'MatchSingle'>;
};

const SingleMatchScreen: React.FC<MatchScreenProps> = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  const match = useAppSelector((state) => state.match.match);
  const matches = useAppSelector((state) => state.match.matches);
  const player1 = match?.player_1_name ?? "player1";
  const opponent1 = match?.opponent_1_name ?? "player2";
  const [server, setServer] = useState<string | null>(null);
  const [hits, setHits] = useState<Hit[]>([]);
  const [currentHits, setCurrentHits] = useState<Hit[]>([]);
  const [courtSize, setCourtSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [visible, setVisible] = useState(true);
  const [modalWinPoint, setModalWinPoint] = useState(false);
  const [stepModalWinPoint, setStepModalWinPoint] = useState<number>(0);
  const [pointWinner, setPointWinner] = useState<string | null>(null);
  const [shotErrorType, setShotErrorType] = useState<'error' | 'shot' | null>(
    null
  );
  const [showAnalysisPrompt, setShowAnalysisPrompt] = useState(false);
  const [editingPointIndex, setEditingPointIndex] = useState<number | null>(
    null
  );
  const [currentTurn, setCurrentTurn] = useState<string>(player1);
  const [currentSetIndex, setCurrentSetIndex] = useState(0); // Set en cours
  const [history, setHistory] = useState<HistoryHit[]>(
    match?.sets?.[0]?.points ?? []
  );
  const [showSetWinnerModal, setShowSetWinnerModal] = useState(false);
  const [setWinnerName, setSetWinnerName] = useState<string | null>(null);
  const [showMatchWinnerModal, setShowMatchWinnerModal] = useState(false);
  const [matchWinnerName, setMatchWinnerName] = useState<string | null>(null);

  const [putMatch] =
        usePutMatchMutation();
        
  

  const updateMatch = useCallback(async (history: HistoryHit[]) => {
    if (match) {
      const updatedSets = [...(match.sets ?? [])];
      updatedSets[currentSetIndex] = {
        ...updatedSets[currentSetIndex],
        points: history,
      };

      await putMatch({
        timestamp: match.timestamp,
        sets: updatedSets,
      }).unwrap();

      dispatch(setMatch({...match, sets: updatedSets}))
      dispatch(setMatches([...matches.filter(item => item.user_id !== match.user_id && item.timestamp !== match.timestamp), {...match, sets: updatedSets}]))

      const player1Score = history.filter(h => h.winLoose === 'win').length;
      const opponent1Score = history.filter(h => h.winLoose === 'loose').length;

      const maxScore = Math.max(player1Score, opponent1Score);

      // Déclencher l’analyse à 11 ou 21 (set 1 ou 2)
      if (maxScore === 11 || (maxScore === 21 && currentSetIndex < 2)) {
        setShowAnalysisPrompt(true);
      }

      // Si 21 => fin du set
      if (maxScore >= 21) {
        const winner = player1Score > opponent1Score ? player1 : opponent1;
      
        setSetWinnerName(winner);
        setShowSetWinnerModal(true);
      
        // Mise à jour des sets dans Redux
        const updatedSets = [...(match.sets ?? [])];
        updatedSets[currentSetIndex] = {
          ...updatedSets[currentSetIndex],
          points: history,
        };
      
        // Vérifier les sets gagnés
        const winCountPlayer1 = updatedSets.filter(set =>
          set.points.filter(p => p.winLoose === 'win').length >
          set.points.filter(p => p.winLoose === 'loose').length
        ).length;
      
        const winCountOpponent1 = updatedSets.filter(set =>
          set.points.filter(p => p.winLoose === 'loose').length >
          set.points.filter(p => p.winLoose === 'win').length
        ).length;
      
        if (winCountPlayer1 === 2 || winCountOpponent1 === 2) {
          const matchWinner = winCountPlayer1 === 2 ? player1 : opponent1;
          setMatchWinnerName(matchWinner);
          setShowMatchWinnerModal(true);
        }
      }
    }
  }, [match, currentSetIndex]);

  const handleAnalysisDecision = (confirm: boolean) => {
    setShowAnalysisPrompt(false);
    if (confirm) {
      rootNavigation.navigate('AnalyzeMatchResult');
    }
  };

  useEffect(() => {
    updateMatch(history);
  }, [history])

  useEffect(() => {
    server && setCurrentTurn(server)
  }, [server])

  const handleSetSet = (setIndex: number) => {
    setCurrentSetIndex(setIndex);
  }

  const handleNextSet = () => {
    if (!match || !match.sets) return;
    
    const nextSetIndex = currentSetIndex + 1;
    let updatedSets = [...match.sets];
    
    // Créer le set suivant s'il n'existe pas
    if (!updatedSets[nextSetIndex]) {
      updatedSets[nextSetIndex] = {
        set_number: nextSetIndex + 1,
        points: [],
      };
    }
  
    // Mettre à jour le match dans Redux
    dispatch(setMatch({
      ...match,
      sets: updatedSets,
    }));
  
    // Avancer vers le nouveau set
    setCurrentSetIndex(nextSetIndex);
    setHistory([]);
  };

  const handleCourtPress = (x: number, y: number) => {
    // Normaliser y : 0 = filet, 1 = fond, peu importe le joueur
    const normalizedY = currentTurn === opponent1 ? 1 - y : y;

    if (!server) {
      Alert.alert(
        'Erreur',
        'Veuillez sélectionner le serveur avant de continuer.'
      );
      return;
    }

    if (
      (currentTurn === player1 && normalizedY > 0.5) ||
      (currentTurn === opponent1 && normalizedY <= 0.5)
    ) {
      Alert.alert('Erreur', 'Vous ne pouvez pas jouer de ce côté !');
      return;
    }

    setHits((prevHits) => [
      ...prevHits,
      { position: { x, y: normalizedY }, player: currentTurn },
    ]);

    setCurrentHits((prevHits) => [
      ...prevHits,
      { position: { x, y: normalizedY }, player: currentTurn },
    ]);

    setCurrentTurn((prev) => (prev === player1 ? opponent1 : player1));
  };

  const handleUndoHit = () => {
    setCurrentTurn(currentTurn === player1 ? opponent1 : player1)
    setHits((prevHits) => prevHits.slice(0, -1));
  };

  const renderHits = () => {
    if (!courtSize) return null;

    return hits.map((hit, index) => (
      <View
        key={index}
        style={{
          position: 'absolute',
          top: hit.position.y * courtSize.height - 10,
          left: hit.position.x * courtSize.width - 10,
          width: 25,
          height: 25,
          backgroundColor: 'red',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
      </View>
    ));
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header */}
        <SingleMatchHeader
          navigation={navigation}
          hits={hits}
          player1={player1}
          opponent1={opponent1}
          currentTurn={currentTurn}
          history={history}
          onUndo={handleUndoHit}
          onCheck={() => setModalWinPoint(true)}
          onSelectSet={handleSetSet} 
          currentSetIndex={currentSetIndex}
          totalSets={match?.sets?.length ?? 1}        />
        {/* History */}
        <History
          player={player1}
          history={history}
          editingPointIndex={editingPointIndex}
          setHits={setHits}
          setEditingPointIndex={setEditingPointIndex} 
          currentHits={currentHits}        
        />

        {/* Court */}
        <Court
          courtSize={courtSize}
          currentTurn={currentTurn}
          opponent1={opponent1}
          onPress={handleCourtPress}
          setCourtSize={setCourtSize}
          renderHits={renderHits}
          editMode={editingPointIndex === null}
        />

      </View>

      {/* Modals */}
      <Portal>
        <SingleMatchModal
          visible={visible}
          server={server}
          player1={player1}
          opponent1={opponent1}
          modalWinPoint={modalWinPoint}
          pointWinner={pointWinner}
          stepModalWinPoint={stepModalWinPoint}
          shotErrorType={shotErrorType}
          editingPointIndex={editingPointIndex}
          hits={hits}
          history={history}
          setPointWinner={setPointWinner}
          setShotErrorType={setShotErrorType}
          setStepModalWinPoint={setStepModalWinPoint}
          setServer={setServer}
          setVisible={setVisible}
          setModalWinPoint={setModalWinPoint}
          setHistory={setHistory}
          setHits={setHits}
          setEditingPointIndex={setEditingPointIndex}
          currentHits={currentHits} 
          setCurrentHits={setCurrentHits}
        />
        <Dialog visible={showAnalysisPrompt} onDismiss={() => setShowAnalysisPrompt(false)}>
          <Dialog.Title>Analyser le match ?</Dialog.Title>
          <Dialog.Content>
            <Text>Souhaitez-vous analyser ce match pour obtenir des conseils ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => handleAnalysisDecision(false)}>Non</Button>
            <Button onPress={() => handleAnalysisDecision(true)}>Oui</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={showSetWinnerModal} onDismiss={() => setShowSetWinnerModal(false)}>
          <Dialog.Title>Fin du Set</Dialog.Title>
          <Dialog.Content>
            <Text>Ce set a été gagné par {setWinnerName}.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setShowSetWinnerModal(false);
              handleNextSet();
            }}>OK</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SingleMatchScreen;
