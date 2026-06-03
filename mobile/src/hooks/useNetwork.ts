import { useNetInfo } from '@react-native-community/netinfo'

export function useNetwork() {
  const netInfo = useNetInfo()

  return {
    isConnected: netInfo.isConnected ?? false,
    isInternetReachable: netInfo.isInternetReachable ?? false,
    connectionType: netInfo.type ?? 'unknown',
  }
}
