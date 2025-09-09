import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../src/utils/database';

export default function Layout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return <Stack />;
}