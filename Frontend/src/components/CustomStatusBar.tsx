import React from 'react';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

interface CustomStatusBarProps {
  translucent?: boolean;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({ 
  translucent = false 
}) => {
  const { isDarkMode, isLoading } = useTheme();
  const insets = useSafeAreaInsets();

  // Don't render StatusBar while theme is loading
  if (isLoading) {
    return null;
  }

  return (
    // <View style={{ height: insets.top,backgroundColor:isDarkMode ? '#111827' : '#f3f4f6' }}>
    <View style={{ height: insets.top,backgroundColor:'#f3f4f6' }}>
    <StatusBar
      // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      barStyle="dark-content"
      // backgroundColor={isDarkMode ? '#111827' : '#f3f4f6'}
      translucent={translucent}
    />
    </View>
  );
};

export default CustomStatusBar;
