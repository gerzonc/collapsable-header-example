import mockData from "@/sample/mockData";
import { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  type ListRenderItem,
  useWindowDimensions
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";

const EXPANDED_HEIGHT = 220;
const COLLAPSED_HEIGHT = 110;

export default function HomeScreen() {
  const translateY = useSharedValue(0);
  const headerHeight = useSharedValue(EXPANDED_HEIGHT);
  const { height } = useWindowDimensions();
  const textWidth = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      console.log(event.contentOffset.y);
      translateY.value = event.contentOffset.y;
    }
  });
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        translateY.value,
        [0, COLLAPSED_HEIGHT],
        [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
        Extrapolation.CLAMP
      )
    };
  });

  const animatedTextStyleOne = useAnimatedStyle(() => {
    const translation = interpolate(
      translateY.value,
      [0, 30],
      [0, -100],
      Extrapolation.CLAMP
    );
    return {
      opacity: interpolate(translateY.value, [0, 15], [1, 0]),
      transform: [{ translateY: translation }]
    };
  });

  const animatedTextStyleTwo = useAnimatedStyle(() => {
    const translation = interpolate(
      translateY.value,
      [0, 30],
      [-100, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: interpolate(translateY.value, [0, 15], [0, 1]),
      transform: [{ translateY: translation }]
    };
  });

  const renderItem: ListRenderItem<{
    id: string;
    title: string;
    description: string;
    date: string;
  }> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View>
      <Animated.View
        style={[
          {
            backgroundColor: "red",
            alignItems: "flex-end",
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between"
          },
          animatedHeaderStyle
        ]}
      >
        <Animated.Text
          style={animatedTextStyleOne}
          onLayout={({ nativeEvent }) => {
            textWidth.value = nativeEvent.layout.width;
          }}
        >
          Hello World
        </Animated.Text>
        <Animated.Text style={animatedTextStyleTwo}>Hello World</Animated.Text>
        <Animated.View style={{ width: 100 }} />
      </Animated.View>
      <Animated.FlatList
        data={mockData}
        onScroll={scrollHandler}
        renderItem={renderItem}
        snapToAlignment="start"
        snapToInterval={height / 5}
        decelerationRate="fast"
        scrollEventThrottle={16}
        automaticallyAdjustsScrollIndicatorInsets
        automaticallyAdjustContentInsets
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: EXPANDED_HEIGHT / 2
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8
  },
  date: {
    fontSize: 12,
    color: "#aaa"
  }
});
