import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';

export default function AppNavigator() {
    const { user } = useAuth();
  
    return user ? <MainTabNavigator /> : <AuthStackNavigator />;
  }