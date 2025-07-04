import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

interface LoaderProps {
  size?: number | 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = '#FF5400',
  fullScreen = true,
  style,
}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={color} style={style} />;
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default Loader;
