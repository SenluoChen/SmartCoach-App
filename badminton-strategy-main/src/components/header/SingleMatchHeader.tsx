import { HistoryHit } from '@src/app/datasource/match.type';
import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

interface HeaderProps {
  navigation: any;
  hits: any[];
  player1: string;
  opponent1: string;
  currentTurn: string;
  history: HistoryHit[]; // points du set courant
  onUndo: () => void;
  onCheck: () => void;
  currentSetIndex: number;
  totalSets: number;
  onSelectSet: (index: number) => void;
}

const SingleMatchHeader: React.FC<HeaderProps> = ({
  navigation,
  hits,
  player1,
  opponent1,
  currentTurn,
  history,
  onUndo,
  onCheck,
  currentSetIndex,
  totalSets,
  onSelectSet,
}) => {
  const player1Points = history.filter((item) => item.winLoose === 'win').length;
  const opponent1Points = history.filter((item) => item.winLoose === 'loose').length;

  return (
    <View style={styles.header}>
      <ImageBackground
        source={require('../../../assets/img/headerMatch.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        {/* Navigation et actions */}
        <View style={styles.headerContainer}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            iconColor="white"
          />
          <Text style={styles.headerTitle}>Match</Text>
          <View style={styles.iconContainer}>
            <IconButton
              icon="undo"
              disabled={hits.length === 0}
              size={24}
              onPress={onUndo}
              iconColor="white"
            />
            <IconButton
              icon="check"
              size={24}
              onPress={onCheck}
              iconColor="white"
            />
          </View>
        </View>

        {/* Sélection des sets */}
        <View style={styles.setContainer}>
          <IconButton
            icon="chevron-left"
            size={20}
            onPress={() => onSelectSet(currentSetIndex - 1)}
            disabled={currentSetIndex <= 0}
            iconColor="white"
          />
          <Text style={styles.setText}>Set {currentSetIndex + 1} / {totalSets}</Text>
          <IconButton
            icon="chevron-right"
            size={20}
            onPress={() => onSelectSet(currentSetIndex + 1)}
            disabled={currentSetIndex >= totalSets - 1}
            iconColor="white"
          />
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text
            style={[
              styles.scoreText,
              { color: 'red' },
              currentTurn === player1 ? styles.activePlayer : {},
            ]}
          >
            {player1}
          </Text>
          <Text style={styles.scoreText}>
            {player1Points} - {opponent1Points}
          </Text>
          <Text
            style={[
              styles.scoreText,
              { color: 'blue' },
              currentTurn === opponent1 ? styles.activePlayer : {},
            ]}
          >
            {opponent1}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  headerBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  setContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  setText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  activePlayer: {
    backgroundColor: 'yellow',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});

export default SingleMatchHeader;
