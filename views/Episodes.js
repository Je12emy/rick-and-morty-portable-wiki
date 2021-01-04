import React from 'react';
import {SafeAreaView, StyleSheet, Text, FlatList} from 'react-native';
import {useQuery, useInfiniteQuery} from 'react-query';
import {ItemCard} from '../components/ItemCard';
import {useNavigation} from '@react-navigation/native';
import {normalizeData} from '../utils/normalizeData';
import {Searchbar} from 'react-native-paper';

export const Episodes = () => {
  const navigation = useNavigation();

  // Search bar state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isEmpty, setIsEmpty] = React.useState(false);

  // When the search box is empty and the empty flag is true
  React.useEffect(() => {
    if (isEmpty) {
      if (searchQuery === '') {
        handleSearch();
        setIsEmpty(false);
      }
    }
  }, [searchQuery]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (searchQuery === '') {
      setIsEmpty(true);
    }
  };

  const handleSearch = () => {
    data.pages.pop();
    fetchNextPage({pageParam: 1});
  };

  const {isLoading, error, data, fetchNextPage, hasNextPage} = useInfiniteQuery(
    'episodes',
    async ({pageParam = 1}) => {
      console.log('Fetch page: ', pageParam);
      const request = await fetch(
        'https://rickandmortyapi.com/api/episode/?page=' +
          pageParam +
          '&name=' +
          searchQuery,
      );
      if (!request.ok) {
        throw new Error('Network response was not ok');
      }
      // JSON era una promesa
      const response = await request.json();
      return response;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage !== undefined) {
          if (lastPage.info.next !== null) {
            return lastPage.info.next.slice(46);
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      },
    },
  );
  // Mover a utils
  const getMore = () => {
    // fetchNextPage({pageParam: nextPage});
    const fetchResult = fetchNextPage();
    console.log(fetchResult);
  };

  if (isLoading) return <Text>'Loading....'</Text>;

  if (error) return <Text>An error has occurred: {error.message}</Text>;

  const handleViewEpisode = (id) => {
    navigation.navigate('Episode', {
      episodeId: id,
    });
  };

  // console.log('Next Page?', hasNextPage);

  return (
    <SafeAreaView>
      <Searchbar
        style={{marginBottom: 1}}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        onIconPress={handleSearch}
      />
      <FlatList
        data={normalizeData(data)}
        renderItem={({item}) => (
          <ItemCard
            title={item.name}
            subtitle={item.air_date}
            onPress={handleViewEpisode}
            id={item.id}
            icon="television"
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (hasNextPage) {
            getMore();
          }
        }}
        contentContainerStyle={{paddingBottom: 75}}
      />
    </SafeAreaView>
  );
};
