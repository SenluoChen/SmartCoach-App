import { HistoryHit, Hit } from '@src/app/datasource/match.type';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface HistoryProps {
  player: string;
  history: HistoryHit[];
  currentHits: Hit[];
  editingPointIndex: number | null;
  setHits: (hits: Hit[]) => void;
  setEditingPointIndex: (index: number | null) => void;
}

const History: React.FC<HistoryProps> = ({
  player,
  history,
  editingPointIndex,
  currentHits,
  setHits,
  setEditingPointIndex,
}) => {
  useEffect(() => {
    console.log(history)
  }, [history])
  return (
    <View style={styles.historyContainer}>
      <ScrollView horizontal>
      {history.map((winner, index) => (
        <TouchableOpacity
        onPress={() => {
          setEditingPointIndex(index);
          setHits(winner.hits);
        }}
        key={index}
      >
          <View
            style={{
              alignItems: 'center',
              backgroundColor: editingPointIndex === index ? 'green' : winner.winLoose === 'win' ? 'blue' : 'red',
              width: 30,
              height: 30,
              justifyContent: 'center',
            }}
          >
            <Text style={styles.historyItem}>{winner.hits.length}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
            onPress={() => {
              setEditingPointIndex(null);
              setHits(currentHits);
            }}
          >
        <View
            style={{
              alignItems: 'center',
              backgroundColor: editingPointIndex === null ? 'green' : 'black',
              width: 30,
              height: 30,
              justifyContent: 'center',
            }}
          >
            <Text style={styles.historyItem}>{currentHits.length}</Text>
        </View>
        </TouchableOpacity>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    flexDirection: 'row',
  },
  historyItem: {
    color: 'white',
  },
});

export default History;
