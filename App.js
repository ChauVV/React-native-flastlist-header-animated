import React from 'react'
import {
  View, FlatList, Text, 
  StyleSheet, Animated, StatusBar, 
  Platform, RefreshControl,Image,
  TouchableOpacity
} from 'react-native'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 24, 25, 26];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const AVATAR_HEIGHT = 80;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 120 : 133;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class AnimatedHeader extends React.Component {
	state = {
		scrollY: new Animated.Value(
      // iOS has negative initial scroll value because content inset...
      Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
    ),
    refreshing: false,
	};
	
	_renderItem = ({item}) => {
		return (
			<View style={styles.nonsenseItem}>
				<Text style={styles.itemText}>{item}</Text>
			</View>
		)
	};
	
	render() {
		
    
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
    const headerTranslate = scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [0, -HEADER_SCROLL_DISTANCE],
			extrapolate: 'clamp'
    });
    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE/2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp'
    })
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [0, 100],
			extrapolate: 'clamp'
    })
    const icBackTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [-60, 0],
			extrapolate: 'clamp'
    })
    const icBackOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE/2, 3*HEADER_SCROLL_DISTANCE/4, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0,0, 1],
      extrapolate: 'clamp'
    })
    const avatarScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0.6],
      extrapolate: 'clamp',
    })
    const marginLeft = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 60],
      extrapolate: 'clamp',
    })
    const marginLeftName = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE/2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 15, 20],
      extrapolate: 'clamp',
    })
    const marginTop = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 13],
      extrapolate: 'clamp',
    })
    const marginBottom = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 3, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, 25],
      extrapolate: 'clamp',
    });

		return (
			<View style={styles.fill}>
      <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor='rgba(0, 0, 0, 0.251)'
        />
				<AnimatedFlatList
          style={styles.fill}
					scrollEventThrottle={16} // <-- Use 1 here to make sure no events are ever missed
					onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
              {
                useNativeDriver: true, // <-- Add this
                listener: event => {
                  const offsetY = event.nativeEvent.contentOffset.y
                  console.log('offsetY: ', offsetY)
                }
              } 
            )}
					data={data}
					renderItem={this._renderItem}
          keyExtractor={(_, i) => i.toString()}
          // iOS offset for RefreshControl
          contentInset={{
            top: HEADER_MAX_HEIGHT,
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT,
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({ refreshing: true });
                const self = this
                setTimeout(() => self.setState({ refreshing: false }), 1200);
              }}
              // Android offset for RefreshControl
              progressViewOffset={HEADER_MAX_HEIGHT}
            />
          }
        />
        {/* Header */}
				<Animated.View pointerEvents="none" style={[styles.header, {transform: [{ translateY: headerTranslate }]}]}>
        {/* Image header */}
        <Animated.Image
          pointerEvents="none"
            style={[
              styles.imgHeader,
            ]}
            source={require('./assets/ruong.jpg')}
          />
          {/* Image cat */}
          <Animated.Image
          pointerEvents="none"
            style={[
              styles.backgroundImage,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslate }],
              },
            ]}
            source={require('./assets/daibang.jpg')}
          />
          {/* Avatar */}
           <Animated.View
          style={[
            styles.viewAvatar
          ]}
        >
          <Animated.Image
            pointerEvents="none"
            style={[styles.avatar, 
            { 
              transform: [
              { scale: avatarScale },
              { translateY: marginBottom },
              { translateX: marginLeft }
            ],

            }]}
            source={require('./assets/avata.jpg')}
          />
          <Animated.Text 
          style={[styles.name,
          {
            transform: [
              { translateY: marginTop },
              { translateX: marginLeftName }
            ]
          }]}>{'Lý Mạng Sầu'}</Animated.Text>
        </Animated.View>
        </Animated.View>
        {/* bar */}
        <Animated.View
          style={[
            styles.bar
          ]}
        >
        {/* btnBack */}
        <Animated.View
          style={[
            styles.btnBackContainer, {
              opacity: icBackOpacity,
              transform: [
                { translateX: icBackTranslate }
              ]
            }
          ]}
        >
        <TouchableOpacity style={styles.btnBack}>
         <Image
            style={styles.icBack}
            source={require('./assets/icons8-back-30.png')}
          />
        </TouchableOpacity>
          </Animated.View>
          <Text style={styles.title}>{'Profile'}</Text>
        </Animated.View>
       
			</View>
		)
	}
}

const styles = StyleSheet.create({
	fill: {
    flex: 1,
  },
	nonsenseItem: {
		backgroundColor: 'rgba(0, 0, 255, 0.5)',
    margin: 8,
    borderRadius: 10,
    padding: 10
	},
	itemText: {
		fontSize: 40,
    padding: 20,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
    borderRadius: 10,
	},
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    zIndex: 2,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  imgHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    zIndex: 1,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: 38,
    height: 82,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 18,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  name: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  viewAvatar: {
    backgroundColor: 'transparent',
    height: AVATAR_HEIGHT,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    width: '85%',
  },
  avatar: {
    height: AVATAR_HEIGHT,
    width: AVATAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AVATAR_HEIGHT/2,
    resizeMode: 'cover',
  },
  icBack: {
    marginTop: 10
  },
  btnBackContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  btnBack: {
    width: '100%',
    paddingLeft: 10,
    height: '100%',
    justifyContent: 'center',
  }
});