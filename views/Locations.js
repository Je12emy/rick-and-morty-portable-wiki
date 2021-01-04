import React from 'react';
import {SafeAreaView, StyleSheet, Text, FlatList} from 'react-native';
import {useQuery, useInfiniteQuery} from 'react-query';
import {ItemCard} from '../components/ItemCard';
import {useNavigation} from '@react-navigation/native';
import {normalizeData} from '../utils/normalizeData';
import {Searchbar} from 'react-native-paper';

export const Locations = () => {
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
    fetchNextPage();
  };

  const {isLoading, error, data, fetchNextPage, hasNextPage} = useInfiniteQuery(
    'locations',
    async ({pageParam = 1}) => {
      const request = await fetch(
        'https://rickandmortyapi.com/api/location/?page=' +
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
            return lastPage.info.next.slice(47);
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      },
    },
  );

  const getMore = () => {
    fetchNextPage();
  };

  if (isLoading) return <Text>'Loading....'</Text>;

  if (error) return <Text>An error has occurred: {error.message}</Text>;

  const handleViewCharacter = (id) => {
    navigation.navigate('Location', {
      locationId: id,
    });
  };
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
            subtitle={item.type}
            image={item.image}
            onPress={handleViewCharacter}
            id={item.id}
            icon="map-marker"
          />
        )}
        keyExtractor={(character) => character.id}
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
