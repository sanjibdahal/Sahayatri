import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '@/components/Button';
import InputField from '@/components/InputField';

export default function Verify() {
  // const { verifyCode } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      // await verifyCode(code);
      
      // if (params.photo) {
      //   const response = await fetch(params.photo as string);
      //   const blob = await response.blob();
      //   const storage = getStorage();
      //   const auth = getAuth();
      //   const storageRef = ref(storage, `profiles/${auth.currentUser?.uid}`);
      //   await uploadBytes(storageRef, blob);
      //   const photoUrl = await getDownloadURL(storageRef);
        
      //   const firestore = getFirestore();
      //   await setDoc(doc(collection(firestore, 'users'), auth.currentUser?.uid), {
      //     name: params.name,
      //     phone_number: params.phone,
      //     photo_url: photoUrl,
      //     created_at: serverTimestamp(),
      //   });
      // }
      
      router.replace('/(root)/(tabs)/home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 justify-center">
      <Text className="text-3xl font-plusjakartasans_700bold mb-8">Verify Phone</Text>
      
      <InputField
        title="Verification Code"
        value={code}
        onChangeText={setCode}
        placeholder="Enter 6-digit code"
        keyboardType="number-pad"
        maxLength={6}
      />

      <Button
        title="Verify"
        onPress={handleVerify}
        isLoading={loading}
        containerStyles="mt-8"
        disabled={code.length !== 6}
      />
    </View>
  );
}