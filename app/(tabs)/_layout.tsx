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
  return <FontAwesome size={26} style={{ marginBottom: 0 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isNavbarActive = useNavbarStore((state: any) => state.isActive);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.laranja,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: isNavbarActive ? {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
        } : { display: 'none' },
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
        name="feed"
        options={{
          title: 'Feed',
          tabBarLabelStyle: { color: Colors.laranja },
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={Colors.laranja} />,
          headerRight: () => null,
        }}
      />

      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarLabelStyle: { color: Colors.laranja },
          tabBarIcon: ({ color }) => <TabBarIcon name="heart-o" color={Colors.laranja} />,
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