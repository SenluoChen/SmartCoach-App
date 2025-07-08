import React from 'react';
import { View, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface CourtProps {
  courtSize: { width: number; height: number } | null;
  currentTurn: string;
  opponent1: string;
  onPress: (x: number, y: number) => void;
  setCourtSize: (size: { width: number; height: number }) => void;
  renderHits: () => React.ReactNode;
  editMode: boolean; // Ajout de la prop pour le mode d'édition
}

const Court: React.FC<CourtProps> = ({
  courtSize,
  currentTurn,
  opponent1,
  onPress,
  setCourtSize,
  renderHits,
  editMode,
}) => {
  return (
    <View style={styles.courtContainer}>
      <View
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCourtSize({ width, height });
        }}
      >
        {/* Zone de frappe interdite */}
        {editMode && courtSize && (
          <View
            style={[
              styles.prohibitedZone,
              currentTurn === opponent1
                ? { height: courtSize.height / 2, top: 0 }
                : { height: courtSize.height / 2, bottom: 0 },
            ]}
          />
        )}

        {/* Terrain */}
        <TouchableWithoutFeedback
           onPress={(e) => {
             if (!editMode || !courtSize) return;
            
             const { locationX, locationY } = e.nativeEvent;
            
             const x = locationX / courtSize.width;
             let y = locationY / courtSize.height;
            
             // Inverser Y si c'est le tour de l'adversaire
             if (currentTurn === opponent1) {
              console.log('')
               y = 1 - y;
             }
           
             onPress(x, y);
           }}
          >
          <Image
            source={require('../../../assets/court.jpg')}
            style={styles.court}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>

        {/* Afficher les frappes */}
        {renderHits()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courtContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  court: {
    height: '100%',
  },
  prohibitedZone: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
    width: '98%',
  },
});

export default Court;
