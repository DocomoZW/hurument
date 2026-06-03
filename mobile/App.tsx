import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuthStore } from './src/store/authStore'
import { LoginScreen } from './src/screens/LoginScreen'
import { DashboardScreen } from './src/screens/DashboardScreen'
import { MeetingsScreen } from './src/screens/MeetingsScreen'
import { MeetingDetailScreen } from './src/screens/MeetingDetailScreen'
import { ActionsScreen } from './src/screens/ActionsScreen'
import { RisksScreen } from './src/screens/RisksScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const MeetingsStack = createStackNavigator()

function MeetingsStackScreen() {
  return (
    <MeetingsStack.Navigator screenOptions={{ headerShown: false }}>
      <MeetingsStack.Screen name="MeetingsList" component={MeetingsScreen} />
      <MeetingsStack.Screen name="MeetingDetail" component={MeetingDetailScreen} />
    </MeetingsStack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Meetings" component={MeetingsStackScreen} />
      <Tab.Screen name="Actions" component={ActionsScreen} />
      <Tab.Screen name="Risks" component={RisksScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const { isLoading, user, restoreSession } = useAuthStore()

  useEffect(() => {
    restoreSession()
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
