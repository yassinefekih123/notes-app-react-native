import "react-native-gesture-handler";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import NotesScreen from "./screens/NotesScreen";
import AuthScreen from "./screens/AuthScreen";
import { AuthProvider, useAuth } from "./lib/AuthContext";

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading, logout } = useAuth();

  // While we check if a session exists
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Not logged in: show the login/register screen
  if (!user) {
    return <AuthScreen />;
  }

  // Logged in: show the app
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Notes App",
            headerStyle: { backgroundColor: "#f4511e" },
            headerTintColor: "#fff",
            headerRight: () => (
              <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Logout
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Notes"
          component={NotesScreen}
          options={{ title: "My Notes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}