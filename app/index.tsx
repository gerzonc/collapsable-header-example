import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import type { ListRenderItem, FlatListProps } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import mockData from "@/sample/mockData";

const EXPANDED_HEIGHT = 200;
const COLLAPSED_HEIGHT = 96;

interface Item {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface ListProps extends FlatListProps<Item> {
  data: Item[];
  renderItem: ListRenderItem<Item>;
  height: number;
}

interface HeaderProps {
  top: number;
  animatedTextStyleOne: {
    transform: {
      translateY: number;
    }[];
  };
  animatedHeaderStyle: {
    height: number;
  };
}

export default function HomeScreen() {
  const translateY = useSharedValue(0);
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    height: interpolate(
      translateY.value,
      [0, 120],
      [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
      Extrapolation.CLAMP
    )
  }));

  const animatedTextStyleOne = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          translateY.value,
          [0, COLLAPSED_HEIGHT],
          [COLLAPSED_HEIGHT, 0],
          Extrapolation.CLAMP
        )
      }
    ]
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      translateY.value = event.contentOffset.y;
    }
  });

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View>
      <AnimatedHeader
        top={top}
        animatedTextStyleOne={animatedTextStyleOne}
        animatedHeaderStyle={animatedHeaderStyle}
      />
      <AnimatedFlatList
        data={mockData}
        renderItem={renderItem}
        onScroll={scrollHandler}
        height={height}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const AnimatedHeader = ({
  top,
  animatedTextStyleOne,
  animatedHeaderStyle
}: HeaderProps) => (
  <>
    <Animated.View
      style={[styles.collapsedHeader, { paddingTop: COLLAPSED_HEIGHT }]}
    >
      <Animated.Text
        style={[styles.collapsedHeaderText, { top }, animatedTextStyleOne]}
      >
        Hello World
      </Animated.Text>
    </Animated.View>
    <Animated.View style={[styles.expandedHeader, animatedHeaderStyle]}>
      <Animated.View style={styles.expandedHeaderContent}>
        <Animated.Text style={styles.expandedHeaderText}>
          Hello World
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  </>
);

const AnimatedFlatList = ({
  data,
  renderItem,
  onScroll,
  height,
  scrollEventThrottle
}: ListProps) => (
  <Animated.FlatList
    data={data}
    renderItem={renderItem}
    onScroll={onScroll}
    snapToAlignment="start"
    snapToInterval={height / 5}
    scrollEventThrottle={scrollEventThrottle}
    automaticallyAdjustsScrollIndicatorInsets
    automaticallyAdjustContentInsets
    keyExtractor={(item) => item.id}
    contentContainerStyle={styles.list}
    scrollIndicatorInsets={{
      top: EXPANDED_HEIGHT - 70,
      bottom: EXPANDED_HEIGHT - 70
    }}
  />
);

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: EXPANDED_HEIGHT,
    paddingTop: EXPANDED_HEIGHT / 1.5
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
  },
  collapsedHeader: {
    backgroundColor: "red",
    overflow: "hidden",
    zIndex: 3
  },
  collapsedHeaderText: {
    ...StyleSheet.absoluteFillObject,
    textAlign: "center",
    position: "absolute",
    fontSize: 22,
    zIndex: 2
  },
  expandedHeader: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    backgroundColor: "red",
    padding: 16,
    zIndex: 2
  },
  expandedHeaderContent: {
    flex: 1,
    justifyContent: "flex-end"
  },
  expandedHeaderText: {
    fontSize: 32
  }
});
