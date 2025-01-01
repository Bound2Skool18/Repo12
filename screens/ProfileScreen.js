import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, FlatList, SectionList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const route = useRoute();
  const [user, setUser] = useState({
    username: 'Diddy',
    name: 'Call me through the hotline',
    bio: 'I did it',
    followers: 1000000,
    following: 1,
    posts: 42,
    avatar: 'https://m.media-amazon.com/images/M/MV5BNTE1ODU3NTM1N15BMl5BanBnXkFtZTcwNTk0NDM4Nw@@._V1_.jpg',
  });

  const [skills, setSkills] = useState(['Cooking', 'Guitar', 'Yoga', 'Coding', 'Painting', 'Photography']);
  const [posts, setPosts] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [newSkill, setNewSkill] = useState('');
  const [showLikedVideos, setShowLikedVideos] = useState(false);
  const [showUploadedVideos, setShowUploadedVideos] = useState(true);

  const likedVideos = [
    { id: '1', thumbnail: 'https://example.com/thumbnail1.jpg', title: 'Funny Cat Video' },
    { id: '2', thumbnail: 'https://example.com/thumbnail2.jpg', title: 'Amazing Dance Moves' },
    { id: '3', thumbnail: 'https://example.com/thumbnail3.jpg', title: 'Cooking Tutorial' },
    // Add more liked videos as needed
  ];

  const uploadedVideos = [
    { id: '4', thumbnail: 'https://example.com/thumbnail4.jpg', title: 'My First Upload' },
    { id: '5', thumbnail: 'https://example.com/thumbnail5.jpg', title: 'Vlog: A Day in My Life' },
  ];

  useEffect(() => {
    if (route.params?.newPost) {
      setPosts(prevPosts => [route.params.newPost, ...prevPosts]);
      setUser(prevUser => ({
        ...prevUser,
        posts: prevUser.posts + 1
      }));
    }
  }, [route.params?.newPost]);

  const handleSaveProfile = () => {
    setUser(editedUser);
    setIsEditModalVisible(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const renderVideo = ({ item }) => (
    <TouchableOpacity style={styles.videoItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.videoTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title, data, isExpanded, onToggle } }) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <MaterialIcons
        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
        size={24}
        color="white"
      />
    </TouchableOpacity>
  );

  const sections = [
    {
      title: 'Uploaded Videos',
      data: showUploadedVideos ? uploadedVideos : [],
      isExpanded: showUploadedVideos,
      onToggle: () => setShowUploadedVideos(!showUploadedVideos),
    },
    {
      title: 'Liked Videos',
      data: showLikedVideos ? likedVideos : [],
      isExpanded: showLikedVideos,
      onToggle: () => setShowLikedVideos(!showLikedVideos),
    },
  ];

  const EditProfileModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={() => setIsEditModalVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => {}}
          style={styles.modalView}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedUser.name}
              onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editedUser.username}
              onChangeText={(text) => setEditedUser({ ...editedUser, username: text })}
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Bio"
              multiline
              value={editedUser.bio}
              onChangeText={(text) => setEditedUser({ ...editedUser, bio: text })}
            />
            <Text style={styles.skillsTitle}>Skills</Text>
            <View style={styles.skillsList}>
              {skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillText}>{skill}</Text>
                  <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                    <Icon name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.addSkillContainer}>
              <TextInput
                style={styles.addSkillInput}
                placeholder="Add a new skill"
                value={newSkill}
                onChangeText={setNewSkill}
              />
              <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}>
                <Text style={styles.addSkillButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.id}
      renderItem={renderVideo}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={() => (
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.profilePic}
          />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditModalVisible(true)}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    color: '#ccc',
  },
  bio: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  editProfileButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  editProfileText: {
    fontSize: 14,
    color: 'white',
  },
  skillsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    color: 'white',
  },
  postsContainer: {
    padding: 20,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postThumbnail: {
    width: '32%',
    aspectRatio: 1,
    backgroundColor: '#333',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
  },
  postImage: {
    width: '100%',
    height: '70%',
    borderRadius: 5,
  },
  postTitle: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  addSkillContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  addSkillInput: {
    flex: 1,
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addSkillButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
  },
  addSkillButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  videoItem: {
    width: '33%',
    aspectRatio: 1,
    padding: 2,
  },
  thumbnail: {
    flex: 1,
    borderRadius: 5,
  },
  videoTitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ProfileScreen;
