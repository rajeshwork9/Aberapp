declare module 'highcharts-react-native' {
  import * as React from 'react';
  import Highcharts = require('highcharts');

  export interface HighchartsReactNativeProps {
    /** Highcharts options object */
    options: Highcharts.Options;
    /** Style for the WebView container */
    styles?: any;
    /** Load Highcharts via CDN (default true in many examples) */
    useCDN?: boolean;
    /** Array of Highcharts module script URLs (optional) */
    modules?: string[];
    /** Optional loader element while the WebView initializes */
    loader?: React.ReactNode;
    /** Receive postMessage events from the WebView */
    onMessage?: (event: any) => void;
    /** Style for inner WebView */
    webviewStyles?: any;
  }

  export default class HighchartsReactNative extends React.Component<
    HighchartsReactNativeProps
  > {}
}
