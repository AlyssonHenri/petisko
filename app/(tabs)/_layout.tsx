import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { create } from 'zustand';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export const useNavbarStore = create<{
  isActive: boolean;
  setActive: (active: boolean) => void;
}>((set: any) => ({
  isActive: false,
  setActive: (active: any) => set({ isActive: active }),
}));

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isNavbarActive = useNavbarStore((state: any) => state.isActive);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: isNavbarActive ? {} : { display: 'none' },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          href: null,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={'white'} />,
          headerRight: () => null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={Colors.laranja} />,
          tabBarLabelStyle: { color: Colors.laranja },
          headerRight: () => null,
        }}
      />

      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarLabelStyle: { color: Colors.laranja },
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={Colors.laranja} />,
          headerRight: () => null,
        }}
      />
      
      <Tabs.Screen
        name='register'
        options={{
          title: 'Tab Tree',
          href: null,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => null,
        }}
      />

      <Tabs.Screen
        name='edit-profile'
        options={{
          title: 'Tab Edit',
          href: null,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => null,
        }}
      />
      
      <Tabs.Screen
        name='createPet'
        options={{
          title: 'Tab Create',
          href: null,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => null,
        }}
      />
      
      <Tabs.Screen
        name='edit-pet'
        options={{
          title: 'edit-pet',
          href: null,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => null,
        }}
      />
    </Tabs>
  );
}