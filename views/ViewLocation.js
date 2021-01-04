import * as React from 'react';
import {View, Text, Image, ScrollView, SafeAreaView} from 'react-native';
import {Avatar, Card, List, Caption, Paragraph} from 'react-native-paper';
import {useQuery} from 'react-query';
import {imageIcon} from '../components/ItemCard';

export const ViewLocation = ({route, navigation}) => {
  const {locationId} = route.params;
  const [expanded, setExpanded] = React.useState(true);
  // Character list
  const [characters, setCharacters] = React.useState([]);

  const handlePress = async () => {
    await getResidentList();
    setExpanded(!expanded);
  };

  const handleCharacterVisit = (id) => {
    navigation.navigate('Character', {
      characterId: id,
    });
  };

  const {isLoading, error, data} = useQuery('location', async () => {
    const request = await fetch(
      `https://rickandmortyapi.com/api/location/${locationId}`,
    );
    if (!request.ok) {
      throw new Error('Network response was not ok');
    }
    // JSON era una promesa
    const response = await request.json();
    return response;
  });

  const getResidentList = async () => {
    // If current array is empty
    if (characters.length === 0) {
      // episode list of id's
      const idList = [];
      const characterData = [];
      console.log(idList);
      data.residents.forEach((episode) => {
        idList.push(episode.slice(42));
      });

      const characterList = await fetchResidentList(idList);
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
        characterData.push({
          name: characterList.name,
          id: characterList.id,
          origin: characterList.origin.name,
          image: characterList.image,
        });
      }
      setCharacters(characterData);
    }
  };

  const fetchResidentList = async (idList) => {
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
              title="Type"
              subtitle={data.type}
              left={(props) => <Avatar.Icon {...props} icon="dna" />}
            />
          </Card>
          <Card elevation={1} style={{marginBottom: 1}}>
            <Card.Title
              title="Dimension"
              subtitle={data.dimension}
              left={(props) => <Avatar.Icon {...props} icon="cube-outline" />}
            />
          </Card>

          <List.Section title="Featured Residents">
            <List.Accordion
              title="List of Residents"
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
