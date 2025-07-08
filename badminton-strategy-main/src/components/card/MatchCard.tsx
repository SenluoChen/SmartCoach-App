import { Match } from '@src/app/datasource/match.type';
import React from 'react';
import { FlatList, View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Calcule les scores de chaque set, ex: ["21-19", "15-21", "21-17"]
const getSetScores = (match: Match): string[] => {
  return match.sets.map((set) => {
    const player1Score = set.points.filter(p => p.winLoose === 'win').length;
    const opponent1Score = set.points.filter(p => p.winLoose === 'loose').length;
    return `${player1Score}-${opponent1Score}`;
  });
};

const MatchCard: React.FC<{ match: Match; onPress: () => void }> = ({ match, onPress }) => {
  const isDouble = match.type === 'double';
  const setScores = getSetScores(match);

  return (
    <Card onPress={onPress} style={{ marginVertical: 8, marginHorizontal: 16 }}>
      <Card.Content>
        <Title>{isDouble ? 'Double' : 'Simple'}</Title>
        <Paragraph>
          {match.player_1_name}
          {isDouble && match.player_2_name ? ` & ${match.player_2_name}` : ''} vs{' '}
          {match.opponent_1_name}
          {isDouble && match.opponent_2_name ? ` & ${match.opponent_2_name}` : ''}
        </Paragraph>
        <Paragraph style={{ color: 'gray' }}>{formatDate(match.timestamp * 1000)}</Paragraph>
        <Paragraph style={{ marginTop: 4 }}>Score : {setScores.join(' / ')}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default MatchCard;
