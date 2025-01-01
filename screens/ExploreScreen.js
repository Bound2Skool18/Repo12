import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Mock API for app results
const searchAppResults = async (query) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', title: 'How to cook pasta', source: 'app' },
    { id: '2', title: 'Basic guitar chords', source: 'app' },
    { id: '3', title: 'Yoga for beginners', source: 'app' },
  ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
};

// Google Custom Search API (you need to replace with your own API key and search engine ID)
const searchGoogleResults = async (query) => {
  const API_KEY = 'YOUR_GOOGLE_API_KEY';
  const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID';
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items.map(item => ({
      id: item.cacheId,
      title: item.title,
      source: 'google',
      link: item.link,
    }));
  } catch (error) {
    console.error('Error fetching Google results:', error);
    return [];
  }
};

const searchWikipedia = async (query) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.query.search.map(item => ({
      id: `wiki-${item.pageid}`,
      title: item.title,
      snippet: item.snippet,
      source: 'Wikipedia',
    }));
  } catch (error) {
    console.error('Error fetching Wikipedia results:', error);
    return [];
  }
};

const searchDuckDuckGo = async (query) => {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.RelatedTopics.map((item, index) => ({
      id: `ddg-${index}`,
      title: item.Text.split(' - ')[0],
      snippet: item.Text,
      source: 'DuckDuckGo',
    }));
  } catch (error) {
    console.error('Error fetching DuckDuckGo results:', error);
    return [];
  }
};

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsLoading(true);
    try {
      const [wikiResults, ddgResults] = await Promise.all([
        searchWikipedia(query),
        searchDuckDuckGo(query),
      ]);
      setSearchResults([...wikiResults, ...ddgResults]);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Text style={styles.resultTitle}>{item.title}</Text>
      <Text style={styles.resultSnippet}>{item.snippet.replace(/<\/?[^>]+(>|$)/g, '')}</Text>
      <Text style={styles.resultSource}>{item.source}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search skills..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => <Text style={styles.emptyText}>No results found</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F5FCFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultSnippet: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  resultSource: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default ExploreScreen;
