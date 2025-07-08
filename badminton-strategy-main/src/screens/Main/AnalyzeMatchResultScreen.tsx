import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  Appbar,
  Provider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { usePostAnalyzeMatchResultMutation } from "@src/app/redux/api/matchApi";
import { useAppSelector } from "@src/app/hooks";
import { Advice, MatchAnalysisResult } from "@src/app/datasource/analyzeMatchResult.type";

const AnalyzeMatchResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const match = useAppSelector((state) => state.match.match);

  const [postAnalyzeMatchResult, { isLoading }] = usePostAnalyzeMatchResultMutation();
  const [adviceData, setAdviceData] = useState<MatchAnalysisResult | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      if (!match) return;

      try {
        const result = await postAnalyzeMatchResult({
          type: match.type,
          timestamp: match.timestamp,
          player_1_name: match.player_1_name,
          player_2_name: match.player_2_name,
          opponent_1_name: match.opponent_1_name,
          opponent_2_name: match.opponent_2_name,
          phase: "1_11",
          sets: match.sets,
        }).unwrap();
        setAdviceData(result.advice);
      } catch (error) {
        console.error("Erreur lors de l’analyse :", error);
      }
    };

    fetchAdvice();
  }, [match]);

  const renderAdviceCard = (advice: Advice, index: number, isMain: boolean = false) => (
    <Card key={index} style={styles.card}>
      <Card.Content>
        <Title style={isMain ? styles.mainTitle : styles.secondaryTitle}>
          {advice.title}
        </Title>
        <Paragraph style={styles.text}>{advice.text}</Paragraph>
        <Paragraph style={styles.comment}>💬 {advice.comment}</Paragraph>
        <View style={styles.tagContainer}>
          {advice.tag.map((tag, i) => (
            <Chip key={i} style={styles.chip}>
              {tag}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Provider>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Analyse du Match" />
      </Appbar.Header>

      {isLoading || !adviceData ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" />
          <Text style={{ marginTop: 16 }}>Analyse en cours...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {renderAdviceCard(adviceData.mainAdvice, 0, true)}

          <Text style={styles.secondaryHeader}>Conseils secondaires</Text>

          {adviceData.secondaryAdvices.map((advice, index) =>
            renderAdviceCard(advice, index + 1)
          )}
        </ScrollView>
      )}
    </Provider>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e53935",
  },
  secondaryTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    marginTop: 8,
    fontSize: 16,
  },
  comment: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#666",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f1f1f1",
  },
  secondaryHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
});

export default AnalyzeMatchResultScreen;
