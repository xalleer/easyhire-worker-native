import { router } from 'expo-router';
import {ActivityIndicator, Button, Pressable, StyleSheet, Text, View} from 'react-native';
import AvatarUi from "@/components/ui/AvatarUi";
import colors from "@/theme/colors";
import typography from "@/theme/typography";

import {listItems} from "@/constants/accountItems";
import AccountListItem from "@/components/AccountListItem";
import {useEffect, useState} from "react";
import {useUserStore} from "@/store/userStore";
import {getMeApi} from "@/api/user";

export default function AccountScreen() {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMeApi();
        setUser(data);
      } catch (err) {
        console.error('Error loading user', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        {/*// TODO: add avatar*/}
        <AvatarUi  name={user?.name} size={128}></AvatarUi>
        <Text style={[typography.title, { marginTop: 24 }]}>{ user?.name}</Text>
        <Text style={[typography.subtitle, { marginTop: 8 }]}>{ user?.phone}</Text>
        <Text style={[typography.subtitle, { marginTop: 4 }]}>{ user?.email}</Text>
      </View>


      <View style={styles.list}>

        {listItems.map((item, index) => (
            <AccountListItem key={index} {...item} />
        ))}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.background
  },
  list: {
    gap: 16,
    marginTop: 50,
    width: '100%',
  }

});