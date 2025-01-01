import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system'; // Removed unused import
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';  // If using Redux

const { width, height } = Dimensions.get('window');

const CreateScreen = ({ navigation }) => {
  const dispatch = useDispatch();  // If using Redux

  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleUploadVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const newVideo = {
        id: Date.now().toString(),
        url: uri,
        thumbnail: uri,  // You might want to generate a thumbnail
        title: 'My Uploaded Video',
        duration: 0,
        width: 1280,
        height: 720,
      };

      // Update your app state
      dispatch({ type: 'ADD_UPLOADED_VIDEO', payload: newVideo });  // If using Redux
      // or use your state management solution to add the new video

      navigation.navigate('Profile');  // Navigate to profile after upload
    }
  };

  const animatedStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
      },
    ],
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <MaterialIcons name="video-library" size={100} color="white" />
      </Animated.View>
      <Text style={styles.title}>Create Your Video</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadVideo}>
        <MaterialIcons name="file-upload" size={24} color="white" />
        <Text style={styles.uploadButtonText}>Upload Video</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default CreateScreen;
