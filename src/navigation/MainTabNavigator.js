import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../data/theme';

import DashboardScreen from '../screens/DashboardScreen';
import FoodScreen from '../screens/FoodScreen';
import LiftScreen from '../screens/LiftScreen';
import AICoachScreen from '../screens/AICoachScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const icons = ['grid', 'restaurant', 'barbell', 'person'];
  const labels = ['Dashboard', 'Food', 'Lift', 'Profile'];

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isCenter = index === 2;

        if (route.name === 'AICoach') {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate('AICoach')}
              style={styles.centerBtn}
              activeOpacity={0.85}
            >
              <View style={styles.centerBtnInner}>
                <Ionicons name="sparkles" size={26} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          );
        }

        const iconMap = {
          Dashboard: isFocused ? 'grid' : 'grid-outline',
          Food: isFocused ? 'restaurant' : 'restaurant-outline',
          Lift: isFocused ? 'barbell' : 'barbell-outline',
          Profile: isFocused ? 'person' : 'person-outline',
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconMap[route.name]}
              size={22}
              color={isFocused ? COLORS.primary : COLORS.textMuted}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Food" component={FoodScreen} />
      <Tab.Screen name="AICoach" component={AICoachScreen} />
      <Tab.Screen name="Lift" component={LiftScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 24,
    paddingTop: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  centerBtn: {
    flex: 1,
    alignItems: 'center',
  },
  centerBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
