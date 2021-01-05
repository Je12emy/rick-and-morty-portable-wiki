import * as React from 'react';
import {View, Text, Image, ScrollView, SafeAreaView} from 'react-native';
import {Avatar, Card, List, Caption, Paragraph} from 'react-native-paper';
import {useQuery} from 'react-query';

export const ViewCharacter = ({route, navigation}) => {
  const {characterId} = route.params;
  const [expanded, setExpanded] = React.useState(false);

  // Episodes list
  const [episodes, setEpisodes] = React.useState([]);

  const handlePress = async () => {
    setExpanded(!expanded);
    // If episode list is empty
    if (episodes.length === 0) {
      await getEpisodeList();
    }
  };

  const handleEpisodeVisit = (id) => {
    navigation.navigate('Episode', {
      episodeId: id,
    });
  };

  const {isLoading, error, data} = useQuery('character', async () => {
    const request = await fetch(
      `https://rickandmortyapi.com/api/character/${characterId}`,
    );
    if (!request.ok) {
      throw new Error('Network response was not ok');
    }
    // JSON era una promesa
    const response = await request.json();
    return response;
  });

  const getGenderIcon = (gender) => {
    if (gender === 'Male') {
      return 'gender-male';
    }
    if (gender === 'Female') {
      return 'gender-female';
    } else {
      return 'gender-non-binary';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Alive') {
      return 'heart-pulse';
    }
    if (status === 'Dead') {
      return 'skull-outline';
    } else {
      return 'help';
    }
  };

  // name, episodeId
  const getEpisodeList = async () => {
    // If current array is empty
    if (episodes.length === 0) {
      // episode list of id's
      const idList = [];
      const episodeData = [];

      data.episode.forEach((episode) => {
        idList.push(episode.slice(40));
      });

      const episodeList = await fetchEpisodeList(idList);
      if (idList.length > 1) {
        // Shape data
        episodeList.forEach((episode) => {
          episodeData.push({
            name: episode.name,
            id: episode.id,
            episode: episode.episode,
          });
        });
      } else {
        episodeData.push(episodeList);
      }
      setEpisodes(episodeData);
    }
  };

  const fetchEpisodeList = async (idList) => {
    // Fetch episode list
    const request = await fetch(
      `https://rickandmortyapi.com/api/episode/${idList}`,
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
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Avatar.Image
            size={200}
            source={{
              uri: data.image,
            }}
            style={{marginTop: 8, marginBottom: 8}}
          />
        </View>
        <View>
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
              title="Gender"
              subtitle={data.gender}
              left={(props) => (
                <Avatar.Icon {...props} icon={getGenderIcon(data.gender)} />
              )}
            />
          </Card>
          <Card elevation={1} style={{marginBottom: 1}}>
            <Card.Title
              title="Species"
              subtitle={data.species}
              left={(props) => <Avatar.Icon {...props} icon="human" />}
            />
          </Card>
          <Card elevation={1} style={{marginBottom: 1}}>
            <Card.Title
              title="Status"
              subtitle={data.status}
              left={(props) => (
                <Avatar.Icon {...props} icon={getStatusIcon(data.status)} />
              )}
            />
          </Card>
          <Card elevation={1} style={{marginBottom: 1}}>
            <Card.Title
              title="Origin"
              subtitle={data.origin.name}
              left={(props) => <Avatar.Icon {...props} icon="earth" />}
            />
          </Card>
          <Card elevation={1} style={{marginBottom: 1}}>
            <Card.Title
              title="Location"
              subtitle={data.location.name}
              left={(props) => <Avatar.Icon {...props} icon="map-marker" />}
            />
          </Card>
          {
            // apply conditional
            data.type !== '' ? (
              <Card elevation={1} style={{marginBottom: 1}}>
                <Card.Title
                  title="Type"
                  subtitle={data.type}
                  left={(props) => (
                    <Avatar.Icon {...props} icon="account-alert" />
                  )}
                />
              </Card>
            ) : null
          }

          <List.Section title="Featured in">
            <List.Accordion
              title="List of Episodes"
              left={(props) => <List.Icon {...props} icon="folder" />}
              expanded={expanded}
              onPress={handlePress}>
              {
                // map episodes
                episodes.map((episode, index) => (
                  <List.Item
                    id={episode.id}
                    title={episode.name}
                    description={episode.episode}
                    left={(props) => <List.Icon {...props} icon="television" />}
                    onPress={() => {
                      handleEpisodeVisit(episode.id);
                    }}
                    key={episode.id.toString()}
                  />
                ))
              }
            </List.Accordion>
          </List.Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
