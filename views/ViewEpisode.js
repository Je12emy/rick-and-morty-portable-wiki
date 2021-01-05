import * as React from 'react';
import {View, Text, Image, ScrollView, SafeAreaView} from 'react-native';
import {Card, List, Caption, Paragraph, Avatar} from 'react-native-paper';
import {useQuery} from 'react-query';
import {imageIcon} from '../components/ItemCard';

export const ViewEpisode = ({route, navigation}) => {
  const {episodeId} = route.params;
  const [expanded, setExpanded] = React.useState(false);

  // Character list
  const [characters, setCharacters] = React.useState([]);

  const handlePress = async () => {
    setExpanded(!expanded);
    if (characters.length === 0) {
      await getCharacterList();
    }
  };

  const handleCharacterVisit = (id) => {
    navigation.navigate('Character', {
      characterId: id,
    });
  };

  const {isLoading, error, data} = useQuery('location', async () => {
    const request = await fetch(
      `https://rickandmortyapi.com/api/episode/${episodeId}`,
    );
    if (!request.ok) {
      throw new Error('Network response was not ok');
    }
    // JSON era una promesa
    const response = await request.json();
    return response;
  });

  const getCharacterList = async () => {
    // If current array is empty
    if (characters.length === 0) {
      // episode list of id's
      const idList = [];
      const characterData = [];

      data.characters.forEach((episode) => {
        idList.push(episode.slice(42));
      });

      const characterList = await fetchCharacterList(idList);
      if (idList.length > 1) {
        // Shape data
        characterList.forEach((character) => {
          characterData.push({
            name: character.name,
            id: character.id,
            origin: character.origin.name,
            image: character.image,
          });
        });
      } else {
        characterData.push(characterList);
      }

      setCharacters(characterData);
    }
  };

  const fetchCharacterList = async (idList) => {
    // Fetch character list
    const request = await fetch(
      `https://rickandmortyapi.com/api/character/${idList}`,
    );
    if (!request.ok) {
      throw new Error('Network response was not ok');
    }
    // JSON era una promesa
    const response = await request.json();
    return response;
  };

  if (isLoading) return <Text>'Loading....'</Text>;

  if (error) return <Text>An error has occurred: {error.message}</Text>;
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{marginTop: 8}}>
          <Paragraph style={{marginBottom: 8, marginLeft: 16}}>
            Information
          </Paragraph>
          <Card elevation={1} style={{marginBottom: 1}}>
            <Card.Title
              title="Name"
              subtitle={data.name}
              left={(props) => <Avatar.Icon {...props} icon="form-textbox" />}
            />
          </Card>
          <Card elevation={1} style={{marginBottom: 1}}>
            <Card.Title
              title="Air Date"
              subtitle={data.air_date}
              left={(props) => <Avatar.Icon {...props} icon="calendar-range" />}
            />
          </Card>
          <Card elevation={1} style={{marginBottom: 1}}>
            <Card.Title
              title="Episode"
              subtitle={data.episode}
              left={(props) => (
                <Avatar.Icon {...props} icon="format-list-numbered" />
              )}
            />
          </Card>
          <List.Section title="Featured Characters">
            <List.Accordion
              title="List of Characters"
              left={(props) => <List.Icon {...props} icon="folder" />}
              expanded={expanded}
              onPress={handlePress}>
              {characters.map((character) => (
                <List.Item
                  key={character.id}
                  title={character.name}
                  description={character.origin}
                  left={() => imageIcon(character)}
                  onPress={() => {
                    handleCharacterVisit(character.id);
                  }}
                />
              ))}
            </List.Accordion>
          </List.Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
