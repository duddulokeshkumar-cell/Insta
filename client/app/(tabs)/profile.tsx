import { dummyUserProfile } from '@/assets/assets';
import { styles } from '@/assets/styles/ProfileScreen.styles';
import Avatar from '@/components/Avatar';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {

  const {auth} = {auth : {user : dummyUserProfile}}

  const user = auth.user;
  const [editMode, setEditMode] = useState(false)
  const [profileName, setProfileName] = useState(auth.user?.name || "")
  const [profileHandle, setProfileHandle] = useState(auth.user?.handle || "")
  const [profileBio, setProfileBio] = useState(auth.user?.bio || "")
  const [avatarUri, setAvatarUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const displayAvatar = avatarUri || user?.avatar;

  const pickAvatar = async ()=>{
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(status !== 'granted'){
      Alert.alert("Permisson needed", 
        "Allow access to your photos to change avatar.");
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality:0.8,
      allowsEditing:true,
      aspect: [1,1]
    });
    if(!result.canceled && result.assets[0]){
      setAvatarUri(result.assets[0].uri)
    }
  }

  const saveProfile = async ()=>{
    setLoading(true)
    setTimeout(() => {
      setEditMode(false)
      setAvatarUri(null)
      setLoading(false)
    }, 2000);
  }

  const handleLogout = async ()=>{
    Alert.alert("Sign Out", "Are you sure you want to sign out?",
      [
        {text: "Cancel", style: "cancel",},
        {text: "Sign Out", style: "destructive", onPress:()=>{}}
      ]
    )
  }

  useEffect(()=>{
    Alert.alert("hello");
  },[]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          {!editMode && (
            <TouchableOpacity style={styles.editBtn} 
            onPress={()=>setEditMode(true)}>
              <Ionicons name='pencil' size={16} color={Colors.primary} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* avatar */}
        <View style={styles.avatarSection}>
        <TouchableOpacity onPress={editMode ? pickAvatar : undefined}
        activeOpacity={editMode ? 0.7 : 1}>
          <View style={styles.avatarWrapper}>
            <Avatar name={user?.name || "?"} src={displayAvatar} size={100}/>
            {editMode && (
              <View style={styles.cameraOverlay}>
                <Ionicons name='camera' size={22} color='#fff' />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {!editMode && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userHandle}>@{user?.handle}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.bio && <Text style={styles.userBio}>{user?.bio}</Text>}
            
          </View>
        )}
        </View>

        {/* edit form */}
        {editMode && (
          <View style={styles.form}>
            {/* name */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
              style={styles.input}
              value={profileName}
              onChangeText={setProfileName}
              placeholder='Your name'
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize='words' />
            </View>

            {/* handle */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>HANDLE</Text>
              <View style={styles.handleRow}>
                <Text style={styles.atSign}>@</Text>
              
              <TextInput
              style={[styles.input, styles.handleInput]}
              value={profileHandle}
              onChangeText={(v)=>setProfileHandle(v.toLowerCase().replace(/\s/g, ""))}
              placeholder='username'
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize='none' />
            </View>
            </View>

            {/* bio */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>BIO</Text>
              <TextInput
              style={[styles.input, styles.bioInput]}
              value={profileBio}
              onChangeText={setProfileBio}
              placeholder='Tell us about yourself...'
              placeholderTextColor={Colors.outlineVariant}
              multiline
              numberOfLines={3} />
            </View>

            {/* save button */}
            <TouchableOpacity style={styles.saveWrapper} onPress={saveProfile}
            disabled={loading} activeOpacity={0.88}>
              <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
                start={{x: 0, y:0}} end={{x: 1, y: 1}}
                style={styles.saveBtn}>
                  {loading ? (
                    <ActivityIndicator color={Colors.primary} />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  )}
              </LinearGradient>
            </TouchableOpacity>

            {/* cancel button */}
            <TouchableOpacity style={styles.cancelBtn}
            onPress={()=>setEditMode(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* profile options */}
        {!editMode && (
          <View style={styles.optionsSection}>
            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.optionIcon}>
                <Ionicons name='settings-outline' size={20}
                color={Colors.onSurfaceVariant} />
              </View>
              <Text style={styles.optionText}>Settings</Text>
              <Ionicons name='chevron-forward' size={16}
              color={Colors.outlineVariant} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.optionIcon}>
                <Ionicons name='notifications-outline' size={20}
                color={Colors.onSurfaceVariant} />
              </View>
              <Text style={styles.optionText}>Notifications</Text>
              <Ionicons name='chevron-forward' size={16}
              color={Colors.outlineVariant} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.optionIcon}>
                <Ionicons name='lock-closed-outline' size={20}
                color={Colors.onSurfaceVariant} />
              </View>
              <Text style={styles.optionText}>Privacy & Security</Text>
              <Ionicons name='chevron-forward' size={16}
              color={Colors.outlineVariant} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.optionIcon}>
                <Ionicons name='help-circle-outline' size={20}
                color={Colors.onSurfaceVariant} />
              </View>
              <Text style={styles.optionText}>Help & Support</Text>
              <Ionicons name='chevron-forward' size={16}
              color={Colors.outlineVariant} />
            </TouchableOpacity>

          </View>
        )}

        {/* sign out */}
        <View style={styles.signOutSection}>
         <TouchableOpacity
  style={[styles.signOutBtn, { backgroundColor: "red" }]}
  onPress={() => {
    console.log("Pressed");
    Alert.alert("Pressed");
  }}
>
  <Text>Sign Out</Text>
</TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}