import { categorizedLosingActions, categorizedWinningActions } from "@src/app/datasource/match.type";
import { translateLoosingShot, translateWinningShot } from "@src/tools/utils";
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { Text } from "react-native-paper";

type MosaicProps = {
  type: 'WinningShot' | 'OpponentError';
  onSelect: (value: string) => void;
};

const Mosaic: React.FC<MosaicProps> = ({ type, onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentCategory = (type === 'OpponentError' ? categorizedLosingActions : categorizedWinningActions).find(c => c.category === selectedCategory);

  const tiles = selectedCategory && currentCategory
    ? currentCategory.items.map((item, index) => ({
        key: `${selectedCategory}-${index}`,
        value: item,
        label: item,
      }))
    : (type === 'OpponentError' ? categorizedLosingActions : categorizedWinningActions).map(cat => ({
        key: cat.category,
        value: cat.category,
        label: cat.label,
      }));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {tiles.map(tile => (
          <TouchableOpacity
            key={tile.key}
            style={styles.tile}
            onPress={() => {
              if (selectedCategory) {
                onSelect(tile.value);
              } else {
                setSelectedCategory(tile.value);
              }
            }}
          >
            <ImageBackground
              source={require("/assets/img/shot/out.webp")} // image par défaut
              style={styles.imageBackground}
            >
              <View style={styles.overlay}>
                <Text style={styles.text}>{type === 'OpponentError' ? translateLoosingShot(tile.label) : translateWinningShot(tile.label)}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
      {selectedCategory && (
        <TouchableOpacity onPress={() => setSelectedCategory(null)}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  tile: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 5,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(19, 2, 217, 0.5)",
    justifyContent: "center",
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  backText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
    textAlign: "center",
  },
});

export default Mosaic;
