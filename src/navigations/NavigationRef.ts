import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './Navigation';
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export const isReadyRef = { current: false };
