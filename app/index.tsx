import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { getProductIdByHandle } from "../src/features/products/hooks";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  scrollTo,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHomeContent } from "../src/features/home/hooks";
import { getCountdownParts } from "../src/features/home/utils";
import type { HomeSlide, MonthlyDropOverlay } from "../src/features/home/types";
import { useProducts } from "../src/features/products/hooks";
import PressableScale from "@/src/components/common/PressableScale";
import Svg, { Polyline } from "react-native-svg";
import { useBottomBarVisibility } from "@/src/components/common/BottomBarVisibilityContext";
import SaunaLoader from "@/src/components/common/SaunaLoader";
import LoadingScreen from "@/src/components/common/LoadingScreen";

const { width, height } = Dimensions.get("window");
const HERO_HEIGHT = height;
const PRODUCT_SECTION_OFFSET = HERO_HEIGHT;
const GRID_PADDING = 0;
const GRID_GAP = 1;
const SWIPE_GUIDE_STORAGE_KEY = "hasSeenSwipeGuide13";
type SwipeGuideStep = "horizontal" | "vertical";

const CARD_WIDTH = (width - GRID_GAP) / 2;

function HomeSlideCard({
  slide,
  onPress,
}: {
  slide: HomeSlide;
  onPress: () => void;
}) {
  return (
    <View style={{ width, height: HERO_HEIGHT }}>
      <Image
        source={{ uri: slide.imageUrl }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          padding: 24,
          paddingBottom: 220,
          backgroundColor: "rgba(0,0,0,0.18)",
        }}
      >
        <View style={{ gap: 16 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 44,
              fontFamily: "BarlowCondensed-Bold",
              textTransform: "uppercase",
              lineHeight: 44,
            }}
          >
            {slide.title}
          </Text>

          <PressableScale
            onPress={onPress}
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#fff",
              paddingHorizontal: 18,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{
                color: "#111",
                fontFamily: "BarlowCondensed-Bold",
                fontSize: 12,
              }}
            >
              {slide.ctaLabel}
            </Text>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <View
      style={{
        minWidth: 72,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "rgba(255,255,255,0.14)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.22)",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 26,
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        {String(value).padStart(2, "0")}
      </Text>

      <Text
        style={{
          color: "#fff",
          fontSize: 11,
          textAlign: "center",
          marginTop: 4,
          opacity: 0.9,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function DropOverlaySection({
  overlay,
  onPress,
}: {
  overlay: MonthlyDropOverlay;
  onPress: () => void;
}) {
  const [countdown, setCountdown] = useState(
    getCountdownParts(overlay.dropDate),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownParts(overlay.dropDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [overlay.dropDate]);

  return (
    <View style={{ height: HERO_HEIGHT }}>
      <Image
        source={{ uri: overlay.imageUrl }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          padding: 24,
          paddingBottom: 220,
          backgroundColor: "rgba(0,0,0,0.28)",
        }}
      >
        <View style={{ gap: 20 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 40,
              fontFamily: "BarlowCondensed-Bold",
              textTransform: "uppercase",
            }}
          >
            {overlay.title}
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <CountdownBox value={countdown.days} label="DAYS" />
            <CountdownBox value={countdown.hours} label="HOURS" />
            <CountdownBox value={countdown.minutes} label="MIN" />
            <CountdownBox value={countdown.seconds} label="SEC" />
          </View>

          {overlay.ctaLabel ? (
            <PressableScale
              onPress={onPress}
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#fff",
                paddingHorizontal: 18,
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  color: "#111",
                  fontFamily: "BarlowCondensed-Bold",
                  fontSize: 18,
                  letterSpacing: 1,
                }}
              >
                {overlay.ctaLabel}
              </Text>
            </PressableScale>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function ScrollTopIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 30 30">
      <Polyline
        points="8 18.5 15 11.5 22 18.5"
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

function SwipeRightIcon() {
  return (
    <Svg width={70} height={70} viewBox="0 0 70 70">
      <Polyline
        points="28 22 42 35 28 48"
        fill="none"
        stroke="#fff"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

function SwipeUpIcon() {
  return (
    <Svg width={70} height={70} viewBox="0 0 70 70">
      <Polyline
        points="22 42 35 28 48 42"
        fill="none"
        stroke="#fff"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

function ProductGridCard({
  product,
  index,
  onPress,
}: {
  product: {
    id: string;
    title: string;
    imageUrl?: string;
    price: string;
  };
  index: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: CARD_WIDTH,
        marginBottom: GRID_GAP,
        marginRight: index % 2 === 0 ? GRID_GAP : 0,
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: "100%",
            aspectRatio: 0.9,
            backgroundColor: "#f3f3f3",
          }}
        >
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="contain"
            />
          ) : null}
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: 12,
            backgroundColor: "#f3f3f3",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: "#111",
              fontSize: 14,
              fontFamily: "BarlowCondensed-Bold",
              textTransform: "uppercase",
            }}
          >
            {product.title}
          </Text>

          <Text
            style={{
              color: "#111",
              fontSize: 12,
              marginTop: 3,
            }}
          >
            {product.price}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function ProductSection({
  onProductPress,
}: {
  onProductPress: (id: string) => void;
}) {
  const { data, isLoading, isError, error, refetch } = useProducts(200);

  if (isLoading) {
    return <LoadingScreen label="Loading products..." backgroundColor="#f1f1f1" />;
  }

  if (isError) {
    return (
      <View
        style={{
          paddingVertical: 60,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Kunne ikke hente produkter
        </Text>
        <Text style={{ textAlign: "center", paddingHorizontal: 24 }}>
          {error.message}
        </Text>

        <Pressable
          onPress={() => refetch()}
          style={{
            backgroundColor: "#111",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: "#fff" }}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View
        style={{
          paddingVertical: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Ingen produkter fundet.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: GRID_PADDING,
        paddingTop: 0,
        paddingBottom: 40,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {data.map((product, index) => (
          <ProductGridCard
            key={product.id}
            product={product}
            index={index}
            onPress={() => onProductPress(product.id)}
          />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { setBottomBarVisible } = useBottomBarVisibility();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const [isNavigatingToProduct, setIsNavigatingToProduct] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const slideListRef = useRef<FlatList<HomeSlide>>(null);
  const isProgrammaticScroll = useRef(false);
  const [swipeGuideStep, setSwipeGuideStep] =
    useState<SwipeGuideStep>("horizontal");
  const swipeGuideContentOpacity = useSharedValue(1);

  const swipeGuideProgress = useSharedValue(0);
  const [showSwipeGuide, setShowSwipeGuide] = useState(false);
  const scrollAnimationRef = useRef<number | null>(null);
  const {
    data: homeData,
    isLoading,
    isError,
    error,
    refetch,
  } = useHomeContent();
  const lastScrollY = useRef(0);
  const dragStartedNearTop = useRef(false);
  const dragStartY = useRef(0);
  useDerivedValue(() => {
    scrollTo(scrollRef, 0, scrollY.value, false);
  });
  useFocusEffect(
    useCallback(() => {
      setBottomBarVisible(false);
      setShowScrollTopButton(false);

      return () => {
        setBottomBarVisible(true);
      };
    }, [setBottomBarVisible]),
  );

  const swipeGuideContentStyle = useAnimatedStyle(() => {
    return {
      opacity: swipeGuideContentOpacity.value,
      transform: [
        {
          scale: 0.96 + swipeGuideContentOpacity.value * 0.04,
        },
      ],
    };
  });

  async function completeSwipeGuide() {
    await AsyncStorage.setItem(SWIPE_GUIDE_STORAGE_KEY, "true");
    setShowSwipeGuide(false);
  }

  const horizontalSwipeDotStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: -swipeGuideProgress.value * 60,
        },
      ],
    };
  });

  function transitionSwipeGuideStep(nextStep: SwipeGuideStep) {
    swipeGuideContentOpacity.value = withTiming(
      0,
      {
        duration: 160,
        easing: Easing.out(Easing.cubic),
      },
      () => {
        // Vi skifter step på JS-thread
        // Derfor bruger vi setTimeout i stedet for direkte callback bridge.
      },
    );

    setTimeout(() => {
      setSwipeGuideStep(nextStep);

      swipeGuideContentOpacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
    }, 170);
  }

  const verticalSwipeDotStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -swipeGuideProgress.value * 58,
        },
      ],
    };
  });

  useEffect(() => {
    if (!showSwipeGuide) {
      swipeGuideProgress.value = 0;
      return;
    }

    swipeGuideProgress.value = 0;
    swipeGuideProgress.value = withRepeat(
      withTiming(1, {
        duration: 950,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      true,
    );
  }, [showSwipeGuide, swipeGuideStep, swipeGuideProgress]);

  useEffect(() => {
    async function checkSwipeGuide() {
      const hasSeenGuide = await AsyncStorage.getItem(SWIPE_GUIDE_STORAGE_KEY);

      if (!hasSeenGuide) {
        setSwipeGuideStep("horizontal");
        setShowSwipeGuide(true);
      }
    }

    void checkSwipeGuide();
  }, []);

  function stopScrollAnimation(currentY: number) {
    cancelAnimation(scrollY);
    scrollY.value = currentY;
  }
  function syncBottomBarAfterSnap(targetY: number) {
    const shouldShowBottomBar = targetY === PRODUCT_SECTION_OFFSET;

    setTimeout(() => {
      setBottomBarVisible(shouldShowBottomBar);
    }, 80);
  }
  function animateScrollTo(targetY: number) {
    scrollY.value = lastScrollY.current;

    scrollY.value = withTiming(targetY, {
      duration: targetY === PRODUCT_SECTION_OFFSET ? 190 : 230,
    });
  }
  const slides = homeData?.slides ?? [];

  const loopedSlides =
    slides.length > 1
      ? [slides[slides.length - 1], ...slides, slides[0]]
      : slides;

  async function goToProductByHandle(handle?: string) {
  console.log("CTA product handle:", handle);

  if (!handle || isNavigatingToProduct) {
    console.log("No handle or already navigating");
    return;
  }

  try {
    setIsNavigatingToProduct(true);

    const productId = await getProductIdByHandle(handle);

    console.log("Found product id:", productId);

    if (!productId) {
      console.log("Produkt ikke fundet for handle:", handle);
      return;
    }

    router.push({
      pathname: "/product/[id]",
      params: { id: productId },
    });
  } catch (error) {
    console.log("Kunne ikke navigere til produkt:", error);
  } finally {
    setIsNavigatingToProduct(false);
  }
}

  function scrollToProducts() {
    setBottomBarVisible(true);
    animateScrollTo(PRODUCT_SECTION_OFFSET);
  }

  function scrollToTop() {
    setBottomBarVisible(false);
    animateScrollTo(0);
  }

  if (isLoading) {
    return <LoadingScreen label="Loading products..." backgroundColor="#f1f1f1" />;
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Kunne ikke hente forside
        </Text>
        <Text style={{ textAlign: "center" }}>{error?.message}</Text>

        <Pressable
          onPress={refetch}
          style={{
            backgroundColor: "#111",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: "#fff" }}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: "#fff" }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={(event) => {
          const y = event.nativeEvent.contentOffset.y;

          stopScrollAnimation(y);

          dragStartY.current = y;
        }}
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;

          if (showSwipeGuide && swipeGuideStep === "vertical" && y > 30) {
            void completeSwipeGuide();
          }

          lastScrollY.current = y;

          const shouldShow = y > PRODUCT_SECTION_OFFSET - 100;

          setShowScrollTopButton((current) => {
            if (current === shouldShow) {
              return current;
            }

            return shouldShow;
          });

          setBottomBarVisible(shouldShow);
        }}
        onScrollEndDrag={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          const startedY = dragStartY.current;
          const deltaY = y - startedY;

          const SNAP_FREE_ZONE = 24;

          const isScrollingDownInsideProducts =
            startedY >= PRODUCT_SECTION_OFFSET - SNAP_FREE_ZONE && deltaY > 0;

          if (isScrollingDownInsideProducts) {
            return;
          }

          const isAlreadyInsideProducts =
            startedY > PRODUCT_SECTION_OFFSET + SNAP_FREE_ZONE ||
            y > PRODUCT_SECTION_OFFSET + SNAP_FREE_ZONE;

          if (isAlreadyInsideProducts) {
            return;
          }

          const startedFromProducts = startedY > PRODUCT_SECTION_OFFSET * 0.5;

          const targetY = startedFromProducts
            ? y < PRODUCT_SECTION_OFFSET * 0.98
              ? 0
              : PRODUCT_SECTION_OFFSET
            : y > PRODUCT_SECTION_OFFSET * 0.05
              ? PRODUCT_SECTION_OFFSET
              : 0;

          animateScrollTo(targetY);
          syncBottomBarAfterSnap(targetY);
        }}
      >
        <View style={{ height: HERO_HEIGHT }}>
          {homeData.isDropMode && homeData.overlay ? (
            <DropOverlaySection
              overlay={homeData.overlay}
              onPress={() => {
                void goToProductByHandle(homeData.overlay?.productHandle);
              }}
            />
          ) : (
            <FlatList
              bounces={false}
              alwaysBounceHorizontal={false}
              overScrollMode="never"
              decelerationRate="fast"
              ref={slideListRef}
              data={loopedSlides}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              horizontal
              pagingEnabled
              initialScrollIndex={slides.length > 1 ? 1 : 0}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={(event) => {
                const x = event.nativeEvent.contentOffset.x;

                const loopedIndex = Math.round(x / width);
                if (showSwipeGuide && swipeGuideStep === "horizontal") {
                  const horizontalSwipeDistance = Math.abs(x - width);

                  if (horizontalSwipeDistance > 40) {
                    transitionSwipeGuideStep("vertical");
                  }
                }

                if (slides.length <= 1) return;

                let realIndex = loopedIndex - 1;

                if (realIndex < 0) {
                  realIndex = slides.length - 1;
                }

                if (realIndex >= slides.length) {
                  realIndex = 0;
                }

                setActiveSlideIndex(realIndex);
              }}
              onMomentumScrollEnd={(event) => {
                if (slides.length <= 1) return;

                const x = event.nativeEvent.contentOffset.x;
                const index = Math.round(x / width);

                if (index === 0) {
                  slideListRef.current?.scrollToIndex({
                    index: slides.length,
                    animated: false,
                  });
                }

                if (index === loopedSlides.length - 1) {
                  slideListRef.current?.scrollToIndex({
                    index: 1,
                    animated: false,
                  });
                }
              }}
              renderItem={({ item }) => (
                <HomeSlideCard
                  slide={item}
                  onPress={() => {
                    void goToProductByHandle(item.productHandle);
                  }}
                />
              )}
            />
          )}
          {!homeData.isDropMode && homeData.slides.length > 1 ? (
            <View
              style={{
                position: "absolute",
                top: 58,
                left: 24,
                right: 24,
                zIndex: 20,
                flexDirection: "row",
                gap: 8,
              }}
            >
              {homeData.slides.map((slide, index) => (
                <View
                  key={slide.id}
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor:
                      index === activeSlideIndex
                        ? "#fff"
                        : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </View>
          ) : null}

          <PressableScale
            onPress={scrollToProducts}
            style={{
              position: "absolute",
              bottom: 36,
              alignSelf: "center",
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: "rgba(255,255,255,0.18)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.28)",
              borderRadius: 999,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Swipe up to shop
            </Text>
          </PressableScale>
        </View>
        <View
          style={{
            height: 50,
            backgroundColor: "#f3f3f3",
          }}
        />
        <ProductSection
          onProductPress={(id) =>
            router.push({
              pathname: "/product/[id]",
              params: { id },
            })
          }
        />
      </Animated.ScrollView>
      {showSwipeGuide ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: HERO_HEIGHT,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.75)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <Animated.View style={swipeGuideContentStyle}>
            {swipeGuideStep === "horizontal" ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ translateY: -20 }],
                }}
              >
                <View
                  style={{
                    width: 120,
                    height: 60,
                    borderRadius: 999,
                    borderWidth: 3,
                    borderColor: "#fff",
                    justifyContent: "center",
                    paddingHorizontal: 9,
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        width: 35,
                        height: 35,
                        borderRadius: 999,
                        backgroundColor: "#fff",
                        alignSelf: "flex-end",
                      },
                      horizontalSwipeDotStyle,
                    ]}
                  />
                </View>

                <Text
                  style={{
                    marginTop: 34,
                    color: "#fff",
                    fontSize: 32,
                    lineHeight: 34,
                    fontFamily: "BarlowCondensed-Bold",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  Swipe left to{"\n"}view new drop
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ translateY: -20 }],
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 120,
                    borderRadius: 999,
                    borderWidth: 3,
                    borderColor: "#fff",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingVertical: 10,
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        width: 35,
                        height: 35,
                        borderRadius: 999,
                        backgroundColor: "#fff",
                      },
                      verticalSwipeDotStyle,
                    ]}
                  />
                </View>

                <Text
                  style={{
                    marginTop: 34,
                    color: "#fff",
                    fontSize: 32,
                    lineHeight: 34,
                    fontFamily: "BarlowCondensed-Bold",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  Swipe up to{"\n"}view all products
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      ) : null}

      {showScrollTopButton ? (
        <Pressable
          onPress={scrollToTop}
          style={{
            position: "absolute",
            right: 20,
            bottom: 105,
            zIndex: 999,

            width: 44,
            height: 44,
            backgroundColor: "#fff",

            alignItems: "center",
            justifyContent: "center",

            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <ScrollTopIcon />
        </Pressable>
      ) : null}
    </View>
  );
}
