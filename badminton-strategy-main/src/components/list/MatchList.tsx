import { Match } from "@src/app/datasource/match.type";
import MatchCard from "../card/MatchCard";
import { FlatList, View } from "react-native";
import React from "react";

type MatchListProps = {
  matches: Match[];
  onSelect: (match: Match) => void;
};
const MatchList: React.FC<MatchListProps> = ({ matches, onSelect }) => {
  const sortedMatches = [...matches].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={sortedMatches}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <MatchCard match={item} onPress={() => onSelect(item)} />}
      />
    </View>
  );
};

export default MatchList;