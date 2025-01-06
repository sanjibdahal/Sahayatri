import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthProvider";
import { Redirect } from "expo-router";

const Page = () => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  if (session) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;