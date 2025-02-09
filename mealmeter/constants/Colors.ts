/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: 'black',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#E0E0E0',  // Light gray border color
    errorBackground: '#FFEBEE',  // Light red background for errors
    errorText: '#D32F2F',  // Dark red text for errors
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: 'white',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#444444',  // Dark gray border color
    errorBackground: '#5D1212',  // Dark red background for errors
    errorText: '#FF6B6B',  // Light red text for errors
  },
};
