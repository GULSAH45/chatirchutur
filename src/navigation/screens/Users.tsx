import { Text } from '@react-navigation/elements';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
type RootStackParamList = {
  Chat: {
    chatId: string;
    currentUserId: string;
    receiverId: string;
  };
  
  Users: { user: { fullName: string; email: string; userUid: string } };

};

export type UserType = {
  userUid: string;
  fullName: string;
  email: string;
};

export function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Chat'>>();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userStr = await AsyncStorage.getItem('currentUser');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList: UserType[] = querySnapshot.docs.map(doc => ({
        userUid: doc.id,
        ...doc.data()
      } as UserType));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  // Giriş yapan kullanıcıyı listeden çıkar
  const filteredUsers = currentUser
    ? users.filter(u => u.userUid !== currentUser.userUid)
    : users;

    const handleUserPress = (receiverId: string) => {
      if (!currentUser) return;
      const currentUserId = currentUser.userUid;
      const chatId = [receiverId, currentUserId].sort().join('_');
      
      navigation.navigate('Chat', {
        chatId,
        currentUserId,
        receiverId
      });
    };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item, index) => item.email + index}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => handleUserPress(item.userUid)}
          >
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});
