import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthProvider";
import { Redirect } from "expo-router";

const Page = () => {
  // const { isSignedIn } = useAuth();
  // const isSignedIn = true;
  const { session, user, loading } = useAuth();
  // console.log("inSession: ", session);
  console.log("inUser: ", user);

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  if (session) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;