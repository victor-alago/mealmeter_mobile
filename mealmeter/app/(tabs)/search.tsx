import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/config/api';
import { AUTH_CONFIG } from '@/config';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import debounce from 'lodash/debounce';

interface FoodResult {
    food_name: string;
    food_description: string;
    food_type: string;
    brand_name?: string;
    food_url?: string;
}

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FoodResult[]>([]);
    const [selectedResult, setSelectedResult] = useState<FoodResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const performSearch = useCallback(async (query: string) => {
        if (!query || query.length <= 2) {
            setSearchResults([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const token = await SecureStore.getItemAsync(AUTH_CONFIG.tokenStorageKey);
            if (!token) {
                setError('Please log in again');
                return;
            }

            const response = await axios.get(`${API_URL}/food/search`, {
                params: { query },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const topFiveResults = response.data.results.slice(0, 5);
            setSearchResults(topFiveResults);
        } catch (err) {
            console.error('Search error:', err);
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.status === 401
                    ? 'Session expired. Please log in again.'
                    : err.response?.status === 404
                    ? 'No results found. Try a different search.'
                    : 'Unable to fetch food results.'
                : 'An unexpected error occurred.';
            
            setError(errorMessage);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Memoized debounced search to prevent unnecessary recreations
    const debouncedSearch = useMemo(
        () => debounce(performSearch, 300),
        [performSearch]
    );

    // Effect to trigger search when query changes
    useEffect(() => {
        debouncedSearch(searchQuery);

        // Cleanup function to cancel pending debounced calls
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    const renderFoodItem = useCallback(({ item }: { item: FoodResult }) => (
        <TouchableOpacity 
            style={styles.foodItemContainer}
            onPress={() => setSelectedResult(item)}
        >
            <ThemedText style={styles.foodName}>{item.food_name}</ThemedText>
            <ThemedText style={styles.foodDescription} numberOfLines={2}>
                {item.food_description || 'No description available'}
            </ThemedText>
        </TouchableOpacity>
    ), []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedResult(null);
    }, []);

    return (
        <ThemedView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity 
                        style={styles.clearButton} 
                        onPress={clearSearch}
                    >
                        <Ionicons 
                            name="close-circle" 
                            size={24} 
                            style={styles.clearButtonIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {isLoading && (
                <ThemedView style={styles.loadingContainer}>
                    <ThemedText>Searching for foods...</ThemedText>
                </ThemedView>
            )}

            {error !== '' && (
                <ThemedView style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>{error}</ThemedText>
                </ThemedView>
            )}

            <FlatList
                data={searchResults}
                renderItem={renderFoodItem}
                keyExtractor={(item, index) => `${item.food_name}-${index}`}
                contentContainerStyle={styles.resultsContainer}
                ListEmptyComponent={
                    searchResults.length === 0 && !isLoading && !error ? (
                        <ThemedText style={styles.emptyResultsText}>
                            Start typing to search for foods
                        </ThemedText>
                    ) : null
                }
            />

            {selectedResult && (
                <View style={styles.selectedResultContainer}>
                    <ThemedText style={styles.selectedResultTitle}>
                        {selectedResult.food_name}
                    </ThemedText>
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <Ionicons name="information-circle" size={20} color={Colors.light.text} />
                            <ThemedText style={styles.detailText}>
                                {selectedResult.food_description}
                            </ThemedText>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="restaurant" size={20} color={Colors.light.text} />
                            <ThemedText style={styles.detailText}>
                                Type: {selectedResult.food_type}
                            </ThemedText>
                        </View>
                        {selectedResult.brand_name && (
                            <View style={styles.detailItem}>
                                <Ionicons name="pricetag" size={20} color={Colors.light.text} />
                                <ThemedText style={styles.detailText}>
                                    Brand: {selectedResult.brand_name}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    clearButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    clearButtonIcon: {
        color: Colors.light.text,
        opacity: 0.6,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    detailItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    detailText: {
        color: Colors.light.text,
        fontSize: 16,
    },
    detailsContainer: {
        gap: 8,
    },
    emptyResultsText: {
        color: Colors.light.text,
        marginTop: 16,
        textAlign: 'center',
    },
    errorContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.errorBackground,
        justifyContent: 'center',
        padding: 16,
    },
    errorText: {
        color: Colors.light.errorText,
        textAlign: 'center',
    },
    foodDescription: {
        color: Colors.light.text,
        fontSize: 14,
    },
    foodItemContainer: {
        backgroundColor: Colors.light.background,
        borderRadius: 8,
        marginBottom: 8,
        padding: 12,
    },
    foodName: {
        color: Colors.light.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    loadingContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    resultsContainer: {
        paddingBottom: 16,
    },
    searchContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderColor: Colors.light.border,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 16,
        paddingRight: 8,
    },
    searchInput: {
        backgroundColor: 'transparent',
        color: Colors.light.text,
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    selectedResultContainer: {
        backgroundColor: Colors.light.background,
        borderRadius: 8,
        marginTop: 16,
        padding: 16,
    },
    selectedResultTitle: {
        color: Colors.light.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
});