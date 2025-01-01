import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import VideoFeed from '../components/VideoFeed';
import CommentModal from '../components/CommentModal';

const HomeScreen = ({ route }) => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (route.params?.newVideo) {
      setVideos(prevVideos => [route.params.newVideo, ...prevVideos]);
    }
  }, [route.params?.newVideo]);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.pexels.com/videos/search?query=nature&per_page=10', {
        headers: {
          Authorization: 'h4V0edQkCYkmsvxKQ7p3Daz4XJ3nrPd2d5cljcToy1Rzqomqvm2ZX6jM'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedVideos = formatVideoData(data.videos);
      setVideos(formattedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatVideoData = (apiData) => {
    return apiData.map(item => ({
      id: item.id,
      url: item.video_files[0].link,
      title: item.user.name,
      duration: item.duration,
      width: item.width,
      height: item.height,
    }));
  };

  const handleSwap = (video) => {
    console.log('Swap', video);
  };

  const handleDuet = (video) => {
    console.log('Duet', video);
  };

  const handleTokenSpend = (video) => {
    console.log('Token Spend', video);
  };

  const handleLike = (video) => {
    const updatedVideos = videos.map(v => 
      v.id === video.id ? { ...v, isLiked: !v.isLiked } : v
    );
    setVideos(updatedVideos);
    // Here you would typically update the like status on your backend
  };

  const handleComment = (video) => {
    setCurrentVideo(video);
    setCommentModalVisible(true);
  };

  const handleAddComment = (comment) => {
    if (currentVideo) {
      const updatedVideos = videos.map(v => 
        v.id === currentVideo.id 
          ? { ...v, comments: [...(v.comments || []), { id: Date.now().toString(), text: comment }] } 
          : v
      );
      setVideos(updatedVideos);
      // Here you would typically send the new comment to your backend
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <VideoFeed
        videos={videos}
        onSwap={handleSwap}
        onDuet={handleDuet}
        onTokenSpend={handleTokenSpend}
        onLike={handleLike}
        onComment={handleComment}
      />
      <CommentModal
        isVisible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        comments={currentVideo?.comments || []}
        onAddComment={handleAddComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
