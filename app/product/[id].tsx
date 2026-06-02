import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  Animated,
  Easing,
} from "react-native";
import { useMemo, useRef, useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";
import { useProduct } from "@/src/features/products/hooks";
import type { ProductVariant } from "@/src/features/products/types";
import { useAddToCart } from "@/src/features/cart/hooks";
import {
  createRestockAlert,
  useSaveRestockAlert,
} from "@/src/features/notifications/hooks";
import Svg, { Polyline, Line, Rect } from "react-native-svg";
import LoadingScreen from "@/src/components/common/LoadingScreen";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = Math.round(height * 0.461);
const SIZE_BUTTON_HEIGHT = 44;

type ProductAction = "add_to_cart" | "notify_restock";

function getProductAction(params: {
  selectedVariant: ProductVariant | null;
  allVariantsSoldOut: boolean;
}): ProductAction {
  const { selectedVariant, allVariantsSoldOut } = params;

  if (allVariantsSoldOut) {
    return "notify_restock";
  }

  if (!selectedVariant) {
    return "add_to_cart";
  }

  return selectedVariant.available ? "add_to_cart" : "notify_restock";
}

function getVariantLabel(rawTitle: string): string {
  if (!rawTitle) {
    return "Variant";
  }

  if (rawTitle.toLowerCase() === "default title") {
    return "Default";
  }

  return rawTitle;
}

function normalizeShopifyHtml(html?: string) {
  if (!html) {
    return "";
  }

  // Shopify kan nogle gange give image src som //cdn.shopify.com/...
  // React Native har det bedst med fuld https-url.
  return html
    .replace(/src="\/\//g, 'src="https://')
    .replace(/src='\/\//g, "src='https://");
}

function formatProductDetails(description?: string) {
  if (!description) {
    return "No details available.";
  }

  return description
    .split(/\s*-\s*/)
    .filter(Boolean)
    .map((line) => `- ${line.trim()}`)
    .join("\n");
}

function ArrowLeftIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 30 30">
      <Polyline
        points="18.5 22 11.5 15 18.5 8"
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}
function CloseIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 30 30">
      <Line
        x1={22}
        y1={8}
        x2={8}
        y2={22}
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <Line
        x1={8}
        y1={8}
        x2={22}
        y2={22}
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}
function ArrowDownIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 30 30">
      <Polyline
        points="8 11.5 15 18.5 22 11.5"
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}

function ArrowUpIcon() {
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
function AddToCartIcon({ color = "#fff" }: { color?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 30 30">
      <Polyline
        points="23 15 23 11 7 11 7 23 16.99 23"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <Rect
        x={11}
        y={7}
        width={8}
        height={4}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <Line
        x1={23}
        y1={25.01}
        x2={23}
        y2={17}
        stroke={color}
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <Line
        x1={18.99}
        y1={21.01}
        x2={27.01}
        y2={21.01}
        stroke={color}
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  );
}
function ProductAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: "#e5e5e5",
      }}
    >
      <Pressable
        onPress={() => setIsOpen((current) => !current)}
        style={{
          minHeight: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "BarlowCondensed-SemiBold",
            textTransform: "uppercase",
            color: "#111",
          }}
        >
          {title}
        </Text>

        <View
          style={{
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </View>
      </Pressable>

      {isOpen ? (
        <View
          style={{
            paddingBottom: 18,
          }}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}
function SizeGuideTable() {
  const sizes = ["XS", "S", "M", "L", "XL"];

  const rows = [
    {
      label: "A: Body length (from hps to hem)",
      values: ["69", "70", "71", "72", "73"],
    },
    {
      label: "B: Chest width (measure chest from below armhole)",
      values: ["52", "54", "56", "58", "60"],
    },
    {
      label:
        "C: Sleeve length (measure from center back neck seam to end of sleeve)",
      values: ["88", "89", "90", "91", "92"],
    },
  ];

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#e5e5e5",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#f7f7f7",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e5e5",
        }}
      >
        <View
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderRightWidth: 1,
            borderRightColor: "#e5e5e5",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter_18pt-Regular",
              color: "#111",
              textTransform: "uppercase",
            }}
          >
            All measurements in (cm)
          </Text>
        </View>

        {sizes.map((size) => (
          <View
            key={size}
            style={{
              width: 34,
              paddingVertical: 8,
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: size === "XL" ? 0 : 1,
              borderRightColor: "#e5e5e5",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_18pt-Regular",
                color: "#111",
              }}
            >
              {size}
            </Text>
          </View>
        ))}
      </View>

      {rows.map((row, rowIndex) => (
        <View
          key={row.label}
          style={{
            flexDirection: "row",
            borderBottomWidth: rowIndex === rows.length - 1 ? 0 : 1,
            borderBottomColor: "#e5e5e5",
          }}
        >
          <View
            style={{
              flex: 1,
              paddingVertical: 9,
              paddingHorizontal: 8,
              borderRightWidth: 1,
              borderRightColor: "#e5e5e5",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                lineHeight: 17,
                fontFamily: "Inter_18pt-Regular",
                color: "#111",
              }}
            >
              {row.label}
            </Text>
          </View>

          {row.values.map((value, index) => (
            <View
              key={`${row.label}-${value}-${index}`}
              style={{
                width: 34,
                paddingVertical: 9,
                alignItems: "center",
                justifyContent: "center",
                borderRightWidth: index === row.values.length - 1 ? 0 : 1,
                borderRightColor: "#e5e5e5",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter_18pt-Regular",
                  color: "#111",
                }}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
function SoldOutSlash({
  width,
  height = 44,
}: {
  width: number;
  height?: number;
}) {
  return (
    <Svg
      width={width}
      height={height}
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Line
        x1={-9}
        y1={height + 4}
        x2={width + 4}
        y2={-4}
        stroke="#dcdcdc"
        strokeWidth={1}
        strokeLinecap="square"
      />
    </Svg>
  );
}

export default function ProductDetailScreen() {
  const addToCartMutation = useAddToCart();
  const insets = useSafeAreaInsets();
  const saveRestockAlert = useSaveRestockAlert();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const [shouldAddAfterSizeSelect, setShouldAddAfterSizeSelect] =
    useState(false);

  const flatListRef = useRef<FlatList>(null);
  const addedToBagTranslateY = useRef(new Animated.Value(320)).current;
  const sizeSheetTranslateY = useRef(new Animated.Value(320)).current;
  const variantDropdownTranslateY = useRef(new Animated.Value(320)).current;

  const sizeSheetOverlayOpacity = useRef(new Animated.Value(0)).current;
  const variantDropdownOverlayOpacity = useRef(new Animated.Value(0)).current;
  const addedToBagOverlayOpacity = useRef(new Animated.Value(0)).current;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSizeSheetOpen, setIsSizeSheetOpen] = useState(false);
  const [isAddedToBagOpen, setIsAddedToBagOpen] = useState(false);
  const [isVariantDropdownOpen, setIsVariantDropdownOpen] = useState(false);
  const [confirmedRestockVariantKey, setConfirmedRestockVariantKey] = useState<
    string | null
  >(null);

  const productId = useMemo(() => {
    if (Array.isArray(params.id)) {
      return params.id[0];
    }

    return params.id;
  }, [params.id]);

  const { data, isLoading, isError, error, refetch } = useProduct(productId);

  const selectedVariant =
    data?.variants.find((variant) => variant.id === selectedVariantId) ?? null;

  const allVariantsSoldOut = data?.variants.length
    ? data.variants.every((variant) => !variant.available)
    : false;

  const productAction = getProductAction({
    selectedVariant,
    allVariantsSoldOut,
  });

  const currentRestockVariantKey = selectedVariant?.id ?? "all-sizes";

  const isRestockConfirmed =
    productAction === "notify_restock" &&
    confirmedRestockVariantKey === currentRestockVariantKey;

  useEffect(() => {
    if (isVariantDropdownOpen) {
      variantDropdownTranslateY.setValue(320);

      Animated.timing(variantDropdownTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isVariantDropdownOpen, variantDropdownTranslateY]);

  useEffect(() => {
    if (isAddedToBagOpen) {
      addedToBagTranslateY.setValue(320);
      addedToBagOverlayOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(addedToBagTranslateY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(addedToBagOverlayOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isAddedToBagOpen, addedToBagTranslateY, addedToBagOverlayOpacity]);

  useEffect(() => {
    if (isSizeSheetOpen) {
      sizeSheetTranslateY.setValue(320);
      sizeSheetOverlayOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(sizeSheetTranslateY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sizeSheetOverlayOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSizeSheetOpen, sizeSheetTranslateY, sizeSheetOverlayOpacity]);

  function closeSizeSheet(callback?: () => void) {
    Animated.parallel([
      Animated.timing(sizeSheetTranslateY, {
        toValue: 320,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sizeSheetOverlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSizeSheetOpen(false);
      callback?.();
    });
  }
  function closeVariantDropdown(callback?: () => void) {
    Animated.timing(variantDropdownTranslateY, {
      toValue: 320,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsVariantDropdownOpen(false);
      callback?.();
    });
  }

  function closeAddedToBagSheet(callback?: () => void) {
    Animated.parallel([
      Animated.timing(addedToBagTranslateY, {
        toValue: 320,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(addedToBagOverlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAddedToBagOpen(false);
      callback?.();
    });
  }
  function addVariantToCart(variant: ProductVariant) {
    if (!variant.available) {
      return;
    }

    addToCartMutation.mutate(
      {
        merchandiseId: variant.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setIsAddedToBagOpen(true);
        },
        onError: (error) => {
          console.log("Kunne ikke tilføje til cart:", error.message);
        },
      },
    );
  }

  function handleSelectVariant(variantId: string) {
    const variant = data?.variants.find((item) => item.id === variantId);

    setSelectedVariantId(variantId);

    if (isSizeSheetOpen) {
      closeSizeSheet(() => {
        if (shouldAddAfterSizeSelect && variant?.available) {
          addVariantToCart(variant);
          setShouldAddAfterSizeSelect(false);
        }
      });

      return;
    }

    if (isVariantDropdownOpen) {
      closeVariantDropdown(() => {
        if (shouldAddAfterSizeSelect && variant?.available) {
          addVariantToCart(variant);
          setShouldAddAfterSizeSelect(false);
        }
      });

      return;
    }

    setShouldAddAfterSizeSelect(false);
  }

  function handlePrimaryAction() {
    if (!data) {
      return;
    }

    if (productAction === "notify_restock") {
      if (isRestockConfirmed) {
        return;
      }

      saveRestockAlert.mutate(
        createRestockAlert({
          productId: data.id,
          variantId: selectedVariant?.id,
          productTitle: data.title,
          variantTitle: selectedVariant
            ? getVariantLabel(selectedVariant.title)
            : allVariantsSoldOut
              ? "All sizes"
              : undefined,
          imageUrl: data.images[0]?.url,
        }),
        {
          onSuccess: () => {
            setConfirmedRestockVariantKey(currentRestockVariantKey);

            Alert.alert(
              "Restock alert saved",
              "You’ll be notified when this item is back in stock.",
            );
          },
          onError: (error) => {
            Alert.alert(
              "Could not save alert",
              error instanceof Error ? error.message : "Something went wrong.",
            );
          },
        },
      );

      return;
    }

    if (!selectedVariant) {
      setShouldAddAfterSizeSelect(true);

      if (shouldUseSizeDropdown) {
        setIsVariantDropdownOpen(true);
      } else {
        setIsSizeSheetOpen(true);
      }

      return;
    }

    if (!selectedVariant.available) {
      saveRestockAlert.mutate(
        createRestockAlert({
          productId: data.id,
          variantId: selectedVariant.id,
          productTitle: data.title,
          variantTitle: getVariantLabel(selectedVariant.title),
          imageUrl: data.images[0]?.url,
        }),
        {
          onSuccess: () => {
            Alert.alert(
              "Restock alert saved",
              "You’ll be notified when this item is back in stock.",
            );
          },
        },
      );

      return;
    }

    addToCartMutation.mutate(
      {
        merchandiseId: selectedVariant.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setIsAddedToBagOpen(true);
        },
        onError: (error) => {
          console.log("Kunne ikke tilføje til cart:", error.message);
        },
      },
    );

    setIsAddedToBagOpen(true);
  }

  if (isLoading) {
  return <LoadingScreen label="Loading product..." backgroundColor="#f1f1f1" />;
}

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            Kunne ikke hente produkt
          </Text>
          <Text style={{ textAlign: "center" }}>{error.message}</Text>

          <Pressable
            onPress={() => refetch()}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "#111",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Prøv igen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text>Produktet blev ikke fundet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const buttonLabel = isRestockConfirmed
    ? "ALERT SAVED"
    : productAction === "add_to_cart"
      ? "ADD TO CART"
      : "NOTIFY RESTOCK";

  const displayPrice =
    selectedVariant?.price ??
    data.variants[0]?.price ??
    "Pris ikke tilgængelig";

  const previewImages = data.images?.slice(0, 3) ?? [];

  const colorOptions = [
    {
      id: data.id,
      title: data.title,
      imageUrl: data.images[0]?.url,
      isCurrent: true,
    },
    ...data.relatedColors.map((product) => ({
      id: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      isCurrent: false,
    })),
  ];

  const sizeCount = data.variants.length;
  const sizeGap = 8;
  const availableWidth = width - 32;
  const shouldUseSizeDropdown = sizeCount > 6;

  const sizeRowWidth =
    sizeCount === 1
      ? availableWidth / 3
      : sizeCount === 2
        ? availableWidth * 0.66
        : availableWidth;

  const sizeButtonWidth =
    sizeCount > 0 ? (sizeRowWidth - sizeGap * (sizeCount - 1)) / sizeCount : 0;

  const selectedSizeLabel = selectedVariant
    ? getVariantLabel(selectedVariant.title)
    : "Select size";
  const bottomBarHeight = 50 + insets.bottom;
  const stickyActionHeight = 82;
  const availableVariants = data.variants.filter(
    (variant) => variant.available,
  );

  const availableSizeCount = availableVariants.length;

  const availableSizeRowWidth =
    availableSizeCount === 1
      ? availableWidth / 3
      : availableSizeCount === 2
        ? availableWidth * 0.66
        : availableWidth;

  const availableSizeButtonWidth =
    availableSizeCount > 0
      ? (availableSizeRowWidth - sizeGap * (availableSizeCount - 1)) /
        availableSizeCount
      : 0;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: bottomBarHeight + stickyActionHeight - 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: "#f1f1f1" }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: 70,
              left: 20,
              zIndex: 10,

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
            <ArrowLeftIcon />
          </Pressable>

          <FlatList
            ref={flatListRef}
            data={previewImages}
            keyExtractor={(item, index) => `${item.url}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  width,
                  height: IMAGE_HEIGHT,
                  backgroundColor: "#f1f1f1",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: item.url }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                />
              </View>
            )}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setSelectedImageIndex(index);
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: 12,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {previewImages.map((_, index) => {
              const isActive = index === selectedImageIndex;

              return (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: isActive ? "#111" : "#cfcfcf",
                  }}
                />
              );
            })}
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            paddingTop: 18,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 34,
              fontFamily: "BarlowCondensed-SemiBold",
              lineHeight: 36,
              textTransform: "uppercase",
            }}
          >
            {data.title}
          </Text>

          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_18pt-Regular",
                marginBottom: 8,
                color: "#111",
              }}
            >
              Color
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              {colorOptions.map((option, index) => {
                const isSelected = option.isCurrent;

                return (
                  <Pressable
                    key={`${option.id}-${option.title}-${index}`}
                    onPress={() => {
                      if (option.isCurrent) {
                        return;
                      }

                      router.replace({
                        pathname: "/product/[id]",
                        params: { id: option.id },
                      });
                    }}
                    style={{
                      width: 38,
                      height: 38,
                      borderWidth: 1,
                      borderColor: isSelected ? "#111" : "#dcdcdc",
                      padding: 2,
                      backgroundColor: "#fff",
                    }}
                  >
                    {option.imageUrl ? (
                      <Image
                        source={{ uri: option.imageUrl }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: 18 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_18pt-Regular",
                marginBottom: 8,
                color: "#111",
              }}
            >
              Size
            </Text>

            {shouldUseSizeDropdown ? (
              <Pressable
                onPress={() => {
                  setShouldAddAfterSizeSelect(false);
                  setIsVariantDropdownOpen(true);
                }}
                style={{
                  width: "100%",
                  height: 48,
                  borderWidth: 1,
                  borderColor: "#dcdcdc",
                  backgroundColor: "#fff",
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Inter_18pt-Regular",
                    color: selectedVariant ? "#111" : "#777",
                  }}
                >
                  {selectedSizeLabel}
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    color: "#111",
                    transform: [{ translateY: -1 }],
                  }}
                >
                  ˅
                </Text>
              </Pressable>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  gap: sizeGap,
                  width: sizeRowWidth,
                }}
              >
                {data.variants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  const isDisabled = !variant.available;

                  return (
                    <Pressable
                      key={variant.id}
                      onPress={() => handleSelectVariant(variant.id)}
                      style={{
                        width: sizeButtonWidth,
                        height: SIZE_BUTTON_HEIGHT,
                        paddingHorizontal: 8,
                        borderWidth: 1,
                        borderColor: isSelected ? "#111" : "#dcdcdc",
                        backgroundColor: isSelected ? "#111" : "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {isDisabled && !isSelected ? (
                        <SoldOutSlash
                          width={sizeButtonWidth}
                          height={SIZE_BUTTON_HEIGHT}
                        />
                      ) : null}

                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Inter_18pt-Regular",
                          color: isSelected
                            ? "#fff"
                            : isDisabled
                              ? "#999"
                              : "#111",
                        }}
                      >
                        {getVariantLabel(variant.title)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
          <View style={{ marginTop: 26 }}>
            <ProductAccordion title="Details">
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 16,
                  fontFamily: "Inter_18pt-Regular",
                  color: "#111",
                }}
              >
                {formatProductDetails(data.description)}
              </Text>
            </ProductAccordion>

            <ProductAccordion title="Size guide">
              {data.sizeChart?.body ? (
                <RenderHTML
                  contentWidth={width - 32}
                  source={{
                    html: normalizeShopifyHtml(data.sizeChart.body),
                  }}
                  systemFonts={[
                    ...defaultSystemFonts,
                    "Inter_18pt-Regular",
                    "BarlowCondensed-SemiBold",
                  ]}
                  baseStyle={{
                    fontFamily: "Inter_18pt-Regular",
                    fontSize: 13,
                    lineHeight: 20,
                    color: "#111",
                  }}
                  tagsStyles={{
                    p: {
                      marginTop: 0,
                      marginBottom: 10,
                      fontFamily: "Inter_18pt-Regular",
                      fontSize: 13,
                      lineHeight: 20,
                      color: "#111",
                    },
                    strong: {
                      fontFamily: "BarlowCondensed-SemiBold",
                      fontSize: 16,
                      color: "#111",
                    },
                    b: {
                      fontFamily: "BarlowCondensed-SemiBold",
                      fontSize: 16,
                      color: "#111",
                    },
                    h1: {
                      fontFamily: "BarlowCondensed-SemiBold",
                      fontSize: 24,
                      lineHeight: 26,
                      textTransform: "uppercase",
                      color: "#111",
                      marginBottom: 10,
                    },
                    h2: {
                      fontFamily: "BarlowCondensed-SemiBold",
                      fontSize: 22,
                      lineHeight: 24,
                      textTransform: "uppercase",
                      color: "#111",
                      marginBottom: 10,
                    },
                    h3: {
                      fontFamily: "BarlowCondensed-SemiBold",
                      fontSize: 20,
                      lineHeight: 22,
                      textTransform: "uppercase",
                      color: "#111",
                      marginBottom: 8,
                    },
                    img: {
                      marginTop: 10,
                      marginBottom: 10,
                    },
                    table: {
                      borderWidth: 1,
                      borderColor: "#e5e5e5",
                    },
                    th: {
                      fontFamily: "Inter_18pt-Regular",
                      fontSize: 12,
                      color: "#111",
                    },
                    td: {
                      fontFamily: "Inter_18pt-Regular",
                      fontSize: 12,
                      color: "#111",
                    },
                  }}
                  renderersProps={{
                    img: {
                      enableExperimentalPercentWidth: true,
                    },
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 20,
                    fontFamily: "Inter_18pt-Regular",
                    color: "#111",
                  }}
                >
                  No size guide available.
                </Text>
              )}
            </ProductAccordion>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#e5e5e5",
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: bottomBarHeight,
          height: stickyActionHeight,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ececec",
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 900,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontFamily: "BarlowCondensed-SemiBold",
            lineHeight: 30,
          }}
        >
          {displayPrice}
        </Text>

        <Pressable
          onPress={handlePrimaryAction}
          disabled={
            addToCartMutation.isPending ||
            saveRestockAlert.isPending ||
            isRestockConfirmed
          }
          style={{
            minWidth: 154,
            paddingHorizontal: 18,
            height: 52,
            backgroundColor: productAction === "add_to_cart" ? "#111" : "#fff",
            borderWidth: 1,
            borderColor: "#111",
            alignItems: "center",
            justifyContent: "center",
            opacity:
              addToCartMutation.isPending ||
              saveRestockAlert.isPending ||
              isRestockConfirmed
                ? 0.6
                : 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {productAction === "add_to_cart" ? (
              <AddToCartIcon color="#fff" />
            ) : null}

            <Text
              style={{
                color: productAction === "add_to_cart" ? "#fff" : "#111",
                fontFamily: "BarlowCondensed-SemiBold",
                fontSize: 16,
                lineHeight: 18,
                textTransform: "uppercase",
              }}
            >
              {addToCartMutation.isPending
                ? "ADDING..."
                : saveRestockAlert.isPending
                  ? "SAVING..."
                  : buttonLabel}
            </Text>
          </View>
        </Pressable>
      </View>

      {isVariantDropdownOpen ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: "flex-end",
            zIndex: 1000,
          }}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={() => closeVariantDropdown()}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.32)",
            }}
          />

          <Animated.View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 16,
              paddingTop: 18,
              paddingBottom: 28,
              transform: [{ translateY: variantDropdownTranslateY }],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#ececec",
              }}
            >
              <View style={{ width: 24 }} />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "BarlowCondensed-SemiBold",
                  textTransform: "uppercase",
                }}
              >
                SELECT SIZE
              </Text>

              <Pressable
                onPress={() => closeVariantDropdown()}
                style={{
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloseIcon />
              </Pressable>
            </View>

            <View style={{ marginTop: 10 }}>
              {data.variants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                const isDisabled = !variant.available;

                return (
                  <Pressable
                    key={variant.id}
                    onPress={() => handleSelectVariant(variant.id)}
                    style={{
                      minHeight: 48,
                      borderBottomWidth: 1,
                      borderBottomColor: "#ececec",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Inter_18pt-Regular",
                        color: isDisabled ? "#999" : "#111",
                      }}
                    >
                      {getVariantLabel(variant.title)}
                    </Text>

                    {isSelected ? (
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#111",
                        }}
                      >
                        ✓
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </View>
      ) : null}

      {isSizeSheetOpen ? (
        <Modal
          transparent
          visible={isSizeSheetOpen}
          animationType="none"
          onRequestClose={() => closeSizeSheet()}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.32)",
                opacity: sizeSheetOverlayOpacity,
              }}
            />

            <Animated.View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 16,
                paddingTop: 18,
                paddingBottom: 28,
                minHeight: 250,
                transform: [{ translateY: sizeSheetTranslateY }],
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ececec",
                }}
              >
                <View style={{ width: 24 }} />

                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "BarlowCondensed-SemiBold",
                    textTransform: "uppercase",
                  }}
                >
                  SELECT SIZE
                </Text>

                <Pressable
                  onPress={() => closeSizeSheet()}
                  style={{
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CloseIcon />
                </Pressable>
              </View>

              <View
                style={{
                  marginTop: 22,
                  alignItems: availableSizeCount < 3 ? "center" : "flex-start",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: sizeGap,
                    width: availableSizeRowWidth,
                  }}
                >
                  {availableVariants.map((variant) => {
                    const isSelected = selectedVariantId === variant.id;

                    return (
                      <Pressable
                        key={variant.id}
                        onPress={() => handleSelectVariant(variant.id)}
                        style={{
                          width: availableSizeButtonWidth,
                          height: SIZE_BUTTON_HEIGHT,
                          paddingHorizontal: 8,
                          borderWidth: 1,
                          borderColor: isSelected ? "#111" : "#dcdcdc",
                          backgroundColor: isSelected ? "#111" : "#fff",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Inter_18pt-Regular",
                            color: isSelected ? "#fff" : "#111",
                          }}
                        >
                          {getVariantLabel(variant.title)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Text
                style={{
                  marginTop: 28,
                  textAlign: "center",
                  fontSize: 11,
                  color: "#555",
                }}
              >
                NOT SURE ABOUT YOUR SIZE?
              </Text>
            </Animated.View>
          </View>
        </Modal>
      ) : null}

      {isAddedToBagOpen ? (
        <Modal
          transparent
          visible={isAddedToBagOpen}
          animationType="none"
          onRequestClose={() => closeAddedToBagSheet()}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.32)",
                opacity: addedToBagOverlayOpacity,
              }}
            />

            <Animated.View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 16,
                paddingTop: 18,
                paddingBottom: 50,
                transform: [{ translateY: addedToBagTranslateY }],
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ececec",
                }}
              >
                <View style={{ width: 32 }} />

                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "BarlowCondensed-SemiBold",
                    textTransform: "uppercase",
                    color: "#111",
                  }}
                >
                  ADDED TO CART
                </Text>

                <Pressable
                  onPress={() => closeAddedToBagSheet()}
                  style={{
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CloseIcon />
                </Pressable>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 14,
                  marginTop: 18,
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    width: 92,
                    height: 92,
                    backgroundColor: "#f1f1f1",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {previewImages[0] ? (
                    <Image
                      source={{ uri: previewImages[0].url }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode="contain"
                    />
                  ) : null}
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 20,
                      lineHeight: 24,
                      fontFamily: "BarlowCondensed-SemiBold",
                      textTransform: "uppercase",
                      color: "#111",
                    }}
                  >
                    {data.title}
                  </Text>

                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      fontFamily: "Inter_18pt-Regular",
                      color: "#111",
                    }}
                  >
                    Size:{" "}
                    {selectedVariant
                      ? getVariantLabel(selectedVariant.title)
                      : "-"}
                  </Text>

                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      fontFamily: "Inter_18pt-Regular",
                      color: "#111",
                    }}
                  >
                    {displayPrice}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 22,
                  borderTopWidth: 1,
                  borderTopColor: "#ececec",
                  paddingTop: 18,
                  gap: 10,
                }}
              >
                <Pressable
                  onPress={() => {
                    closeAddedToBagSheet(() => {
                      router.push("/cart");
                    });
                  }}
                  style={{
                    height: 52,
                    backgroundColor: "#111",
                    borderWidth: 1,
                    borderColor: "#111",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "BarlowCondensed-SemiBold",
                      fontSize: 16,
                      lineHeight: 18,
                      textTransform: "uppercase",
                    }}
                  >
                    VIEW CART
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => closeAddedToBagSheet()}
                  style={{
                    height: 52,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#111",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#111",
                      fontFamily: "BarlowCondensed-SemiBold",
                      fontSize: 16,
                      lineHeight: 18,
                      textTransform: "uppercase",
                    }}
                  >
                    CONTINUE SHOPPING
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
