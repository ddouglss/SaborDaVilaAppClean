/**
 * Web-only Simple Dashboard
 * Versão ultra-simplificada para evitar timeouts na web
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';

const WebDashboard = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null; // ou um <View> simples vazio
  }

  // ...resto do componente
};