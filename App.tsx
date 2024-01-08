import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  RefreshControl,
  ScrollView,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const [refresherEnabled, setEnableRefresher] = useState(true);
  const webViewRef: any = useRef();
  const [canGoBack, setCanGoBack] = useState(false);

  const [apiData, setApiData] = useState('');
  console.log("apiData", apiData)

  const FetchApiData = async () => {
    await fetch('https://kuskayit.com/appApi.json')
      .then(res => res.json())
      .then(res => {
        setApiData(res.kuskayit);
      });
  };

  const handleBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  //Pull To Down Refresh
  const handleScroll = (res: any) => {
    const yOffset = Number(res.nativeEvent.contentOffset.y);
    if (yOffset === 0) {
      setEnableRefresher(true);
    } else {
      setEnableRefresher(false);
    }
  };

  useEffect(() => {
    FetchApiData();
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, [handleBack]);

  return ( 
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={false}
            enabled={refresherEnabled}
            onRefresh={() => {
              webViewRef.current.reload();
            }}
          />
        }>
        <WebView
          source={{uri: 'https://www.kuskayit.com/admin/dist/login.php'}}
          onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
          ref={webViewRef}
          originWhitelist={['*']}
          onScroll={handleScroll}
          allowsInlineMediaPlayback
          javaScriptEnabled
          scalesPageToFit
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabledAndroid
          useWebkit
          startInLoadingState
          cacheEnabled
          allowsFullscreenVideo
          setBuiltInZoomControls
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
