import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '../src/features/products/hooks';
import type { ProductListItem } from '../src/features/products/types';

function ProductCard({
  product,
  onPress,
}: {
  product: ProductListItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        gap: 8,
      }}
    >
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 12,
            backgroundColor: '#f3f3f3',
          }}
          resizeMode="cover"
        />
      ) : null}

      <Text style={{ fontSize: 18, fontWeight: '600' }}>{product.title}</Text>
      <Text style={{ fontSize: 16 }}>{product.price}</Text>
      <Text style={{ color: product.available ? 'green' : 'red' }}>
        {product.available ? 'På lager' : 'Ikke på lager'}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useProducts();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
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
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Noget gik galt</Text>
        <Text style={{ textAlign: 'center' }}>{error.message}</Text>
        <Pressable
          onPress={() => refetch()}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#111',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff' }}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 8 }}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() =>
            router.push({
              pathname: '/product/[id]',
              params: { id: item.id },
            })
          }
        />
      )}
    />
  );
}