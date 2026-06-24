/**
 * React Native 0.85.3 uses a Constructor<HostInstance> & typeof ViewComponent
 * intersection pattern for native components (View, Text, etc.). TypeScript's
 * structural type check on this intersection doesn't see the class members
 * inherited through ViewComponent when checking JSX compatibility.
 *
 * This augments the react-native module to re-declare the affected components
 * as function components for type-check purposes, fixing JSX usage.
 *
 * Remove when RN ships updated types for @types/react@19.
 */
import 'react-native';

declare module 'react-native' {
  // Re-declare View, Text, etc. as function components to fix JSX type check.
  // React Native 0.85 uses a Constructor<HostInstance> & typeof ViewComponent
  // intersection pattern that breaks structural JSX assignability checks.
  const View: React.FC<import('react-native').ViewProps>;
  const Text: React.FC<import('react-native').TextProps>;
  const SafeAreaView: React.FC<import('react-native').ViewProps>;
  const TouchableOpacity: React.FC<import('react-native').TouchableOpacityProps>;
  const ScrollView: React.FC<import('react-native').ScrollViewProps>;
  const ActivityIndicator: React.FC<import('react-native').ActivityIndicatorProps>;
  const Pressable: React.FC<import('react-native').PressableProps>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FlatList: <T = any>(
    props: import('react-native').FlatListProps<T>
  ) => React.ReactElement | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SectionList: <T = any, SectionT = import('react-native').DefaultSectionT>(
    props: import('react-native').SectionListProps<T, SectionT>
  ) => React.ReactElement | null;
  const TextInput: React.FC<import('react-native').TextInputProps>;
  const Image: React.FC<import('react-native').ImageProps>;
  const Modal: React.FC<import('react-native').ModalProps>;
  const Switch: React.FC<import('react-native').SwitchProps>;
}
