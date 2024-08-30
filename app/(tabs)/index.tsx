import mockData from "@/sample/mockData";
import {
  View,
  Text,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EXPANDED_HEIGHT = 220;
const COLLAPSED_HEIGHT = 144;

export default function HomeScreen() {
  const translateY = useSharedValue(0);
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const textWidth = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
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
      [0, 45],
      [0, -100],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      translateY.value,
      [0, 30],
      [0, -100],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      translateY.value,
      [0, 45],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: interpolate(translateY.value, [0, 30], [1, 0]),
      transform: [{ translateY: translation }, { translateX }, { scale }]
    };
  });

  const animatedTextStyleTwo = useAnimatedStyle(() => {
    const translation = interpolate(
      translateY.value,
      [0, 120],
      [15, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      translateY.value,
      [0, 120],
      [2, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY: translation }, { scale }],
      opacity: interpolate(translateY.value, [0, 45], [0, 1])
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
            paddingTop: top,
            backgroundColor: "red",
            justifyContent: "flex-end",
            padding: 16
          },
          animatedHeaderStyle
        ]}
      >
        <Animated.Text
          style={[
            {
              fontSize: 25,
              alignSelf: "center"
            },
            animatedTextStyleTwo
          ]}
        >
          Hello World
        </Animated.Text>
        <Animated.Text
          adjustsFontSizeToFit
          style={[{ fontSize: 32 }, animatedTextStyleOne]}
          onLayout={({ nativeEvent }) => {
            textWidth.value = nativeEvent.layout.width;
          }}
        >
          Hello World
        </Animated.Text>
      </Animated.View>
      <Animated.FlatList
        data={mockData}
        onScroll={scrollHandler}
        renderItem={renderItem}
        snapToAlignment="start"
        snapToInterval={height / 5}
        scrollEventThrottle={16}
        automaticallyAdjustsScrollIndicatorInsets
        automaticallyAdjustContentInsets
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: EXPANDED_HEIGHT
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
