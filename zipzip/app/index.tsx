import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { getProductIdByHandle } from '../src/features/products/hooks';

import { useHomeContent } from '../src/features/home/hooks';
import { getCountdownParts } from '../src/features/home/utils';
import type { HomeSlide, MonthlyDropOverlay } from '../src/features/home/types';
import { useProducts } from '../src/features/products/hooks';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height;
const PRODUCT_SECTION_OFFSET = HERO_HEIGHT - 40;

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
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          padding: 24,
          paddingBottom: 120,
          backgroundColor: 'rgba(0,0,0,0.18)',
        }}
      >
        <View style={{ gap: 16 }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 40,
              fontWeight: '800',
              textTransform: 'uppercase',
            }}
          >
            {slide.title}
          </Text>

          <Pressable
            onPress={onPress}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#fff',
              paddingHorizontal: 18,
              paddingVertical: 12,
            }}
          >
            <Text style={{ color: '#111', fontWeight: '700' }}>
              {slide.ctaLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function CountdownBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <View
      style={{
        minWidth: 72,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 26,
          fontWeight: '800',
          textAlign: 'center',
        }}
      >
        {String(value).padStart(2, '0')}
      </Text>

      <Text
        style={{
          color: '#fff',
          fontSize: 11,
          textAlign: 'center',
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
          paddingBottom: 120,
          backgroundColor: "rgba(0,0,0,0.28)",
        }}
      >
        <View style={{ gap: 20 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 40,
              fontWeight: "800",
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
            <Pressable
              onPress={onPress}
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#fff",
                paddingHorizontal: 18,
                paddingVertical: 12,
              }}
            >
              <Text style={{ color: "#111", fontWeight: "700" }}>
                {overlay.ctaLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function ProductGridCard({
  product,
  onPress,
}: {
  product: {
    id: string;
    title: string;
    imageUrl?: string;
    price: string;
  };
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '48%',
        marginBottom: 20,
      }}
    >
      <View
        style={{
          width: '100%',
          aspectRatio: 0.82,
          backgroundColor: '#f3f3f3',
          overflow: 'hidden',
          borderRadius: 8,
        }}
      >
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <View style={{ marginTop: 10, gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '600' }}>{product.title}</Text>
        <Text style={{ fontSize: 14 }}>{product.price}</Text>
      </View>
    </Pressable>
  );
}

function ProductSection({
  onProductPress,
}: {
  onProductPress: (id: string) => void;
}) {
  const { data, isLoading, isError, error, refetch } = useProducts(20);

  if (isLoading) {
    return (
      <View
        style={{
          paddingVertical: 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Henter produkter...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          paddingVertical: 60,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700' }}>
          Kunne ikke hente produkter
        </Text>
        <Text style={{ textAlign: 'center', paddingHorizontal: 24 }}>
          {error.message}
        </Text>

        <Pressable
          onPress={() => refetch()}
          style={{
            backgroundColor: '#111',
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: '#fff' }}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View
        style={{
          paddingVertical: 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Ingen produkter fundet.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 40,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          marginBottom: 20,
          textTransform: 'uppercase',
        }}
      >
        Shop
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {data.map((product) => (
          <ProductGridCard
            key={product.id}
            product={product}
            onPress={() => onProductPress(product.id)}
          />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [isNavigatingToProduct, setIsNavigatingToProduct] = useState(false);

  const {
    data: homeData,
    isLoading,
    isError,
    error,
    refetch,
  } = useHomeContent();

  async function goToProductByHandle(handle?: string) {
  if (!handle || isNavigatingToProduct) {
    return;
  }

  try {
    setIsNavigatingToProduct(true);

    const productId = await getProductIdByHandle(handle);

    if (!productId) {
      console.log('Produkt ikke fundet for handle:', handle);
      return;
    }

    router.push({
      pathname: '/product/[id]',
      params: { id: productId },
    });
  } catch (error) {
    console.log('Kunne ikke navigere til produkt:', error);
  } finally {
    setIsNavigatingToProduct(false);
  }
}

  function scrollToProducts() {
    scrollRef.current?.scrollTo({
      y: PRODUCT_SECTION_OFFSET,
      animated: true,
    });
  }

  const swipeUpGesture = Gesture.Pan().onEnd((event) => {
    const isStrongSwipeUp = event.translationY < -80;
    const isMostlyVertical =
      Math.abs(event.translationY) > Math.abs(event.translationX);

    if (isStrongSwipeUp && isMostlyVertical) {
      scrollToProducts();
    }
  });

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Henter forside...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700' }}>
          Kunne ikke hente forside
        </Text>
        <Text style={{ textAlign: 'center' }}>{error?.message}</Text>

        <Pressable
          onPress={refetch}
          style={{
            backgroundColor: '#111',
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: '#fff' }}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <GestureDetector gesture={swipeUpGesture}>
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
              data={homeData.slides}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
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

          <Pressable
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
          </Pressable>
        </View>
      </GestureDetector>

      <ProductSection
        onProductPress={(id) =>
          router.push({
            pathname: "/product/[id]",
            params: { id },
          })
        }
      />
    </ScrollView>
  );
}