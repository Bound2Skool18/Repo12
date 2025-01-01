import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = 50;

const VideoFeed = ({ videos, onSwap, onDuet, onTokenSpend, onLike, onComment }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [status, setStatus] = useState({});
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setOnPlaybackStatusUpdate(status => {
        setStatus(() => status);
        setPosition(status.positionMillis);
        setDuration(status.durationMillis);

        // Restart the video when it finishes
        if (status.didJustFinish) {
          videoRef.current.replayAsync();
        }
      });
    }
  }, [activeVideoIndex]);

  useEffect(() => {
    if (videoRef.current) {
      if (isFocused) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isFocused]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleSliderChange = async (value) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderVideoItem = ({ item, index }) => {
    const isActive = index === activeVideoIndex;

    return (
      <View style={styles.videoContainer}>
        <Video
          ref={isActive ? videoRef : null}
          source={{ uri: item.url }}
          style={styles.video}
          resizeMode="contain"
          isLooping={false} // Changed to false to allow manual replay
          shouldPlay={isActive && isFocused}
          isMuted={!isActive}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={handlePlayPause}>
              <MaterialIcons 
                name={status.isPlaying ? "pause" : "play-arrow"} 
                size={32} 
                color="white" 
              />
            </TouchableOpacity>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={handleSliderChange}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FFFFFF"
            />
            <Text style={styles.timeText}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onSwap(item)}>
              <Text style={styles.buttonText}>Swap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onDuet(item)}>
              <Text style={styles.buttonText}>Duet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onTokenSpend(item)}>
              <Text style={styles.buttonText}>Token</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onLike(item)}>
              <MaterialIcons name={item.isLiked ? "favorite" : "favorite-border"} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onComment(item)}>
              <MaterialIcons name="comment" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <FlatList
      data={videos}
      renderItem={renderVideoItem}
      keyExtractor={(item) => item.id.toString()}
      pagingEnabled
      vertical
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50
      }}
      initialNumToRender={1}
      maxToRenderPerBatch={2}
      windowSize={2}
      getItemLayout={(data, index) => ({
        length: height - BOTTOM_TAB_HEIGHT,
        offset: (height - BOTTOM_TAB_HEIGHT) * index,
        index,
      })}
      snapToInterval={height - BOTTOM_TAB_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: width,
    height: height - BOTTOM_TAB_HEIGHT,
    justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
    alignItems: 'center',
    paddingTop: 20, // Added padding to the top
  },
  video: {
    width: '100%',
    height: '70%', // Reduced height to bring video up
  },
  overlay: {
    position: 'absolute',
    bottom: 100, // Adjusted to move overlay up
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10, // Reduced margin
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduced margin
    width: '90%',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 115,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VideoFeed;
