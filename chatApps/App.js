
// import React, { useState, useEffect } from 'react';
// import { View, TextInput, Button, FlatList, Text } from 'react-native';
// import io from 'socket.io-client';
// import tw from 'twrnc';

// const socket = io('http://192.168.0.109:3000/');

// const ChatBubble = ({ message, isSent, timestamp, status }) => {
//   return (
//     <View style={tw`flex ${isSent ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 my-4`}>
//       {/* Message Container */}
//       <View style={tw`flex-1 ${isSent ? 'items-end' : 'items-start'}`}>
//         <View style={[
//           tw`max-w-[80%] p-4 rounded-xl`,
//           isSent 
//             ? tw`bg-blue-500 rounded-tr-none`
//             : tw`bg-gray-100 rounded-tl-none`
//         ]}>
//           {/* Message Header */}
//           <View style={tw`flex-row items-center gap-2 mb-2`}>
//             {!isSent && <Text style={tw`text-sm font-semibold text-gray-900`}>{message.fromUserId}</Text>}
//             <Text style={tw`text-xs ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
//               {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </Text>
//           </View>

//           {/* Message Text */}
//           <Text style={tw`text-sm ${isSent ? 'text-white' : 'text-gray-900'}`}>
//             {message.text}
//           </Text>

//           {/* Status Indicator */}
//           {isSent && (
//             <Text style={tw`text-xs mt-1 ${isSent ? 'text-blue-200' : 'text-gray-500'}`}>
//               {status}
//             </Text>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// export default function App() {
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);
//   const [recipientId, setRecipientId] = useState('');
//   const [userId, setUserId] = useState(''); 
//   const [tempUserId, setTempUserId] = useState(''); 
  

//   useEffect(() => {
//     if (userId) {
//       socket.emit('registerUser', userId); 
  

//       socket.on('receiveMessage', (msg) => {
//         console.log('Received Message:', msg);
//         setChat((prev) => [
//           ...prev,
//           {
//             ...msg,
//             isSent: msg.fromUserId === userId,
//           },
//         ]);
//       });
  
//       // Handle message delivered status
//       socket.on('messageDelivered', (msg) => {
//         setChat((prev) =>
//           prev.map((m) =>
//             m.timestamp === msg.timestamp ? { ...m, status: 'delivered' } : m
//           )
//         );
//       });
  
   
//       return () => {
//         socket.off('receiveMessage');
//         socket.off('messageDelivered');
//       };
//     }
//   }, [userId]); 
  


//   const sendMessage = () => {
//     if (!message?.trim()) {
//       return socket.emit('messageError', 'Message cannot be empty');
//     }
    
//     if (message.trim() && recipientId.trim()) {
//       const trimmedMessage = message.trim();
//       const timestamp = new Date().toISOString();
  
//       setChat(prev => [...prev, {
//         fromUserId: userId,
//         text: trimmedMessage,
//         timestamp,
//         // status: 'sending',
//          isSent: true
//       }]);

//       socket.emit('sendMessage', {
//         fromUserId: userId,
//         toUserId: recipientId,
//         message: trimmedMessage
//       });
  
//       setMessage('');
//     }
//   };
  

//   const handleRegister = () => {
//     if (tempUserId.trim()) {
//       setUserId(tempUserId);
//       socket.emit('registerUser', tempUserId);
//     }
//   };
  

//   return (
//     <View style={tw`flex-1 bg-white`}>
//       {userId ? (
//         <View style={tw`flex-1 px-4 pt-8`}>
          
//           <View style={tw`py-4 border-b border-gray-200`}>
//             <Text style={tw`text-lg font-bold`}>Logged in as: {userId}</Text>
//             <TextInput
//               value={recipientId}
//               onChangeText={setRecipientId}
//               placeholder="Recipient ID"
//               style={tw`border border-gray-300 p-2 rounded-lg mt-2`}
//             />
//           </View>

//           <FlatList
//             data={chat}
//             keyExtractor={(_, index) => index.toString()}
//             renderItem={({ item }) => (
//               <ChatBubble
//                 message={item}
//                 isSent={item.isSent}
//                 timestamp={item.timestamp}
//                 status={item.status}
//               />
//             )}
//             contentContainerStyle={tw`pb-4`}
//           />

//           <View style={tw`p-4 border-t border-gray-200`}>
//             <View style={tw`flex-row gap-2`}>
//               <TextInput
//                 value={message}
//                 onChangeText={setMessage}
//                 placeholder="Type a message"
//                 style={tw`flex-1 border border-gray-300 p-2 rounded-lg`}
//               />
//               <Button title="Send" onPress={sendMessage} />
//             </View>
//           </View>
//         </View>
//       ) : (
//         <View style={tw`flex-1 justify-center px-4`}>
//           <Text style={tw`text-2xl font-bold mb-8 text-center`}>Chat App</Text>
//           <TextInput
//             value={tempUserId}
//             onChangeText={setTempUserId}
//             placeholder="Enter your User ID"
//             style={tw`border border-gray-300 p-2 rounded-lg mb-4`}
//           />
//           <Button 
//             title="Register" 
//             onPress={handleRegister} 
//             disabled={!tempUserId.trim()} 
//           />
//         </View>
//       )}
//     </View>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { io } from 'socket.io-client';
import tw from 'twrnc';

const socket = io('https://chat-mobile-app.onrender.com/');

const ChatBubble = ({ message, isSent, timestamp, status }) => {
  return (
    <View style={tw`flex ${isSent ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 my-4`}>
      <View style={tw`flex-1 ${isSent ? 'items-end' : 'items-start'}`}>
        <View style={[
          tw`max-w-[80%] p-4 rounded-xl`,
          isSent 
            ? tw`bg-blue-500 rounded-tr-none`
            : tw`bg-gray-100 rounded-tl-none`
        ]}>
          <View style={tw`flex-row items-center gap-2 mb-2`}>
            {!isSent && <Text style={tw`text-sm font-semibold text-gray-900`}>{message.fromUserId}</Text>}
            <Text style={tw`text-xs ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Text style={tw`text-sm ${isSent ? 'text-white' : 'text-gray-900'}`}>{message.text}</Text>
          {isSent && (
            <Text style={tw`text-xs mt-1 ${isSent ? 'text-blue-200' : 'text-gray-500'}`}>{status}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [userId, setUserId] = useState(''); 
  const [tempUserId, setTempUserId] = useState(''); 

  const flatListRef = useRef(null);

  useEffect(() => {
    if (userId) {
      socket.emit('registerUser', userId);

      socket.on('receiveMessage', (msg) => {
        console.log('Received Message:', msg);
        setChat((prev) => [
          ...prev,
          {
            ...msg,
            isSent: msg.fromUserId === userId,
          },
        ]);
      });

      socket.on('messageDelivered', (msg) => {
        setChat((prev) =>
          prev.map((m) =>
            m.timestamp === msg.timestamp ? { ...m, status: 'delivered' } : m
          )
        );
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('messageDelivered');
      };
    }
  }, [userId]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chat]);

  const sendMessage = () => {
    if (!message?.trim()) {
      return socket.emit('messageError', 'Message cannot be empty');
    }
    
    if (message.trim() && recipientId.trim()) {
      const trimmedMessage = message.trim();
      const timestamp = new Date().toISOString();

      setChat(prev => [...prev, {
        fromUserId: userId,
        text: trimmedMessage,
        timestamp,
        isSent: true
      }]);

      socket.emit('sendMessage', {
        fromUserId: userId,
        toUserId: recipientId,
        message: trimmedMessage
      });

      setMessage('');
    }
  };

  const handleRegister = () => {
    if (tempUserId.trim()) {
      setUserId(tempUserId);
      socket.emit('registerUser', tempUserId);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {userId ? (
        <View style={tw`flex-1 px-4 pt-8`}>
          <View style={tw`py-4 border-b border-gray-200`}>
            <Text style={tw`text-lg font-bold`}>Logged in as: {userId}</Text>
            <TextInput
              value={recipientId}
              onChangeText={setRecipientId}
              placeholder="Recipient ID"
              style={tw`border border-gray-300 p-2 rounded-lg mt-2`}
            />
          </View>

          <FlatList
            ref={flatListRef}
            data={chat}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <ChatBubble
                message={item}
                isSent={item.isSent}
                timestamp={item.timestamp}
                status={item.status}
              />
            )}
            contentContainerStyle={tw`pb-4`}
          />

          <View style={tw`p-4 border-t border-gray-200`}>
            <View style={tw`flex-row gap-2`}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                style={tw`flex-1 border border-gray-300 p-2 rounded-lg`}
              />
              <Button title="Send" onPress={sendMessage} />
            </View>
          </View>
        </View>
      ) : (
        <View style={tw`flex-1 justify-center px-4`}>
          <Text style={tw`text-2xl font-bold mb-8 text-center`}>Chat App</Text>
          <TextInput
            value={tempUserId}
            onChangeText={setTempUserId}
            placeholder="Enter your User ID"
            style={tw`border border-gray-300 p-2 rounded-lg mb-4`}
          />
          <Button 
            title="Register" 
            onPress={handleRegister} 
            disabled={!tempUserId.trim()} 
          />
        </View>
      )}
    </View>
  );
}
