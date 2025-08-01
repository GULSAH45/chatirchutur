import { RouteProp } from '@react-navigation/native';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';


export type MessageType = {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
};

type ChatScreenRouteProps = {
  route: RouteProp<{ params: { chatId: string; currentUserId: string; receiverId: string } }, 'params'>;
};


export function ChatScreen( props : ChatScreenRouteProps) {
console.log(props);
  const { chatId, currentUserId, receiverId } = props.route.params;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState('');
  const db = getFirestore();

  useEffect(() => {
   
    const messagesRef = collection(db, 'Messages', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data() as MessageType));
    });
    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    if (text.trim() === '') return;
  
    try {
      await addDoc(collection(db, 'Messages', chatId, 'messages'), {
        senderId: currentUserId,
        receiverId: receiverId, // Artık gerçek alıcı ID'si kaydediliyor
        text: text.trim(),
        timestamp: new Date()
      });
      setText('');
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  };
  
 return (
    <ImageBackground 
      source={require('../../assets/nature.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={[
              styles.message,
              item.senderId === currentUserId ? styles.myMessage : styles.otherMessage
            ]}>
              <Text>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Mesaj yaz..."
          />
          <Button title="Gönder" onPress={sendMessage} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  container: { 
    flex: 1, 
    padding: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.5)' // İsteğe bağlı: arka plana hafif bir opaklık
  },
  message: { 
    marginVertical: 5, 
    padding: 10, 
    borderRadius: 8, 
    maxWidth: '70%' 
  },
  myMessage: { 
    backgroundColor: '#DCF8C6', 
    alignSelf: 'flex-end' 
  },
  otherMessage: { 
    backgroundColor: '#FFF', 
    alignSelf: 'flex-start' 
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 8, 
    marginRight: 8,
    backgroundColor: 'white' // Input arka planı
  }
});