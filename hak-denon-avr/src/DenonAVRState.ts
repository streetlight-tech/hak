import { DenonAVRZoneState } from './DenonAVRZoneState'

export interface DenonAVRState {
  zones?: {
    main?: DenonAVRZoneState,
    zone2?: DenonAVRZoneState,
    zone3?: DenonAVRZoneState,
  },
}