import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRides } from '@/hooks/useRides';
import PublishRideForm from '@/components/PublishRideForm';

export default function PublishRide() {
  const router = useRouter();
  const { publishRide } = useRides();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async (formData: any) => {
    try {
      setIsSubmitting(true);
      await publishRide(formData);
      router.back();
    } catch (error) {
      console.error('Error publishing ride:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PublishRideForm onSubmit={function (formData: any): void {
        throw new Error('Function not implemented.');
      } } isSubmitting={false} />
    </SafeAreaView>
  );
}