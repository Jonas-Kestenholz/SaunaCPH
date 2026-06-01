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
import { SafeAreaView } from "react-native-safe-area-context";
import { useProduct } from "@/src/features/products/hooks";
import type { ProductVariant } from "@/src/features/products/types";
import { useAddToCart } from "@/src/features/cart/hooks";
import BottomBar from "@/src/components/common/BottomBar";
import {
  createRestockAlert,
  useSaveRestockAlert,
} from "@/src/features/notifications/hooks";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = Math.round(height * 0.72);

type ProductAction = "add_to_cart" | "notify_restock";

function getProductAction(params: {
  selectedVariant: ProductVariant | null;
  hasAnySoldOutVariants: boolean;
  allVariantsAvailable: boolean;
}): ProductAction {
  const { selectedVariant, hasAnySoldOutVariants, allVariantsAvailable } =
    params;

  if (selectedVariant) {
    return selectedVariant.available ? "add_to_cart" : "notify_restock";
  }

  if (allVariantsAvailable) {
    return "add_to_cart";
  }

  if (hasAnySoldOutVariants) {
    return "notify_restock";
  }

  return "add_to_cart";
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

export default function ProductDetailScreen() {
  const addToCartMutation = useAddToCart();
  const saveRestockAlert = useSaveRestockAlert();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const flatListRef = useRef<FlatList>(null);
  const addedToBagTranslateY = useRef(new Animated.Value(320)).current;
  const sizeSheetTranslateY = useRef(new Animated.Value(320)).current;

  const productId = useMemo(() => {
    if (Array.isArray(params.id)) {
      return params.id[0];
    }

    return params.id;
  }, [params.id]);

  const { data, isLoading, isError, error, refetch } = useProduct(productId);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSizeSheetOpen, setIsSizeSheetOpen] = useState(false);
  const [isAddedToBagOpen, setIsAddedToBagOpen] = useState(false);

  const selectedVariant =
    data?.variants.find((variant) => variant.id === selectedVariantId) ?? null;

  const hasAnySoldOutVariants =
    data?.variants.some((variant) => !variant.available) ?? false;

  const allVariantsAvailable =
    data?.variants.every((variant) => variant.available) ?? false;

  const productAction = getProductAction({
    selectedVariant,
    hasAnySoldOutVariants,
    allVariantsAvailable,
  });

  useEffect(() => {
    if (isAddedToBagOpen) {
      addedToBagTranslateY.setValue(320);

      Animated.timing(addedToBagTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isAddedToBagOpen, addedToBagTranslateY]);

  useEffect(() => {
    if (isSizeSheetOpen) {
      sizeSheetTranslateY.setValue(320);

      Animated.timing(sizeSheetTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isSizeSheetOpen, sizeSheetTranslateY]);

  function closeSizeSheet(callback?: () => void) {
    Animated.timing(sizeSheetTranslateY, {
      toValue: 320,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSizeSheetOpen(false);
      callback?.();
    });
  }

  const buttonLabel =
    productAction === "add_to_cart" ? "ADD TO CART" : "NOTIFY RESTOCK";

  const displayPrice =
    selectedVariant?.price ??
    data?.variants[0]?.price ??
    "Pris ikke tilgængelig";

  const previewImages = data?.images?.slice(0, 3) ?? [];
  const colorOptions = data
    ? [
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
      ]
    : [];

  function handleSelectVariant(variantId: string) {
    setSelectedVariantId(variantId);

    if (isSizeSheetOpen) {
      closeSizeSheet();
    }
  }

  function closeAddedToBagSheet(callback?: () => void) {
    Animated.timing(addedToBagTranslateY, {
      toValue: 320,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsAddedToBagOpen(false);
      callback?.();
    });
  }

  function handlePrimaryAction() {
    if (!data) {
      return;
    }

    if (productAction === "notify_restock") {
      saveRestockAlert.mutate(
        createRestockAlert({
          productId: data.id,
          variantId: selectedVariant?.id,
          productTitle: data.title,
          variantTitle: selectedVariant
            ? getVariantLabel(selectedVariant.title)
            : undefined,
          imageUrl: data.images[0]?.url,
        }),
        {
          onSuccess: () => {
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
      setIsSizeSheetOpen(true);
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
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <Text>Henter produkt...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
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

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ backgroundColor: "#f1f1f1" }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 10,
                width: 36,
                height: 36,
                backgroundColor: "#f7f7f7",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, lineHeight: 24 }}>×</Text>
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
                fontSize: 28,
                fontWeight: "900",
                lineHeight: 32,
                textTransform: "uppercase",
              }}
            >
              {data.title}
            </Text>

            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 12,
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
                  marginBottom: 8,
                  color: "#111",
                }}
              >
                Size
              </Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                {data.variants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  const isDisabled = !variant.available;

                  return (
                    <Pressable
                      key={variant.id}
                      onPress={() => handleSelectVariant(variant.id)}
                      style={{
                        minWidth: 54,
                        paddingVertical: 14,
                        paddingHorizontal: 8,
                        borderWidth: 1,
                        borderColor: isSelected ? "#111" : "#d9d9d9",
                        backgroundColor: isSelected ? "#111" : "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: isDisabled && !isSelected ? 0.35 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
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

            <View
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTopWidth: 1,
                borderTopColor: "#ececec",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "900",
                }}
              >
                {displayPrice}
              </Text>

              <Pressable
                onPress={handlePrimaryAction}
                disabled={
                  addToCartMutation.isPending || saveRestockAlert.isPending
                }
                style={{
                  minWidth: 154,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  backgroundColor:
                    productAction === "add_to_cart" ? "#111" : "#fff",
                  borderWidth: 1,
                  borderColor: "#111",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: addToCartMutation.isPending ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color: productAction === "add_to_cart" ? "#fff" : "#111",
                    fontWeight: "800",
                    fontSize: 13,
                  }}
                >
                  {addToCartMutation.isPending
                    ? "ADDING..."
                    : saveRestockAlert.isPending
                      ? "SAVING..."
                      : buttonLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomBar />

      {isSizeSheetOpen ? (
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
          <View
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
              <Text style={{ fontSize: 22, fontWeight: "800" }}>
                SELECT SIZE
              </Text>
              <Pressable onPress={() => closeSizeSheet()}>
                <Text style={{ fontSize: 24, lineHeight: 24 }}>×</Text>
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginTop: 22,
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
                      minWidth: 54,
                      paddingVertical: 14,
                      paddingHorizontal: 8,
                      borderWidth: 1,
                      borderColor: isSelected ? "#111" : "#d9d9d9",
                      backgroundColor: isSelected ? "#111" : "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: isDisabled && !isSelected ? 0.35 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isSelected ? "#fff" : "#111",
                      }}
                    >
                      {getVariantLabel(variant.title)}
                    </Text>
                  </Pressable>
                );
              })}
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
      ) : null}

      {isAddedToBagOpen ? (
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
          <View
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
              <View style={{ width: 24 }} />
              <Text style={{ fontSize: 22, fontWeight: "800" }}>
                ADDED TO BAG
              </Text>
              <Pressable onPress={() => closeAddedToBagSheet()}>
                <Text style={{ fontSize: 24, lineHeight: 24 }}>×</Text>
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 14,
                marginTop: 18,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 92,
                  height: 92,
                  backgroundColor: "#f3f3f3",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {previewImages[0] ? (
                  <Image
                    source={{ uri: previewImages[0].url }}
                    style={{ width: 72, height: 72 }}
                    resizeMode="contain"
                  />
                ) : null}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "800" }}>
                  PRODUCT NAME
                </Text>
                <Text style={{ marginTop: 4, fontSize: 13 }}>
                  SIZE:{" "}
                  {selectedVariant
                    ? getVariantLabel(selectedVariant.title)
                    : "-"}
                </Text>
                <Text style={{ marginTop: 4, fontSize: 13 }}>
                  {displayPrice}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                closeAddedToBagSheet(() => {
                  router.push("/cart");
                });
              }}
              style={{
                marginTop: 24,
                backgroundColor: "#111",
                paddingVertical: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                VIEW CART
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}
