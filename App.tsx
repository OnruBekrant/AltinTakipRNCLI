import React, { useState, useEffect } from 'react'; // useEffect'i ekledik
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage'ı import ettik

const PURCHASES_STORAGE_KEY = '@altin_takip_purchases'; // Verileri saklamak için bir anahtar

interface GoldPurchase {
  id: string;
  date: string;
  price: string;
  quantity: string;
}

function App(): React.JSX.Element {
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchases, setPurchases] = useState<GoldPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumunu takip etmek için

  // Uygulama ilk açıldığında verileri yüklemek için useEffect
  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setIsLoading(true);
        const storedPurchases = await AsyncStorage.getItem(PURCHASES_STORAGE_KEY);
        if (storedPurchases !== null) {
          setPurchases(JSON.parse(storedPurchases));
        }
      } catch (e) {
        Alert.alert('Hata', 'Kayıtlı alımlar yüklenirken bir sorun oluştu.');
        console.error("Failed to load purchases.", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadPurchases();
  }, []); // Boş bağımlılık dizisi, bu effect'in sadece bileşen ilk yüklendiğinde çalışmasını sağlar

  // Alımlar her değiştiğinde AsyncStorage'a kaydetmek için useEffect
  useEffect(() => {
    const savePurchases = async () => {
      // isLoading false ise ve purchases state'i ilk yüklemeden sonra değiştiyse kaydet
      // Bu, ilk yüklemede AsyncStorage'ın boş yere üzerine yazılmasını engeller
      if (!isLoading) {
        try {
          await AsyncStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
        } catch (e) {
          Alert.alert('Hata', 'Alımlar kaydedilirken bir sorun oluştu.');
          console.error("Failed to save purchases.", e);
        }
      }
    };

    savePurchases();
  }, [purchases, isLoading]); // purchases veya isLoading değiştiğinde bu effect çalışır

  const handleAddPurchase = () => {
    if (!date.trim() || !price.trim() || !quantity.trim()) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    const newPurchase: GoldPurchase = {
      id: Date.now().toString(),
      date,
      price,
      quantity,
    };
    setPurchases(prevPurchases => [...prevPurchases, newPurchase]);
    setDate('');
    setPrice('');
    setQuantity('');
    // Alert.alert('Başarılı', 'Altın alımınız eklendi!'); // Kaydetme işlemi useEffect ile yapıldığı için bu alert'i kaldırabilir veya değiştirebiliriz
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container_center}>
        <Text>Veriler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Form ve Liste kısımları aynı kalacak... Önceki koddaki gibi */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Yeni Altın Alımı Ekle</Text>
          <TextInput
            style={styles.input}
            placeholder="Alış Tarihi (örn: 24.05.2025)"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Alış Fiyatı (Gram TL)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Miktar (Gram)"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Button title="Ekle" onPress={handleAddPurchase} />
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.title}>Kaydedilen Alımlar</Text>
          {purchases.length === 0 ? (
            <Text style={styles.emptyText}>Henüz kayıtlı alım yok.</Text>
          ) : (
            purchases.map(purchase => (
              <View key={purchase.id} style={styles.listItem}>
                <Text style={styles.listItemText}>Tarih: {purchase.date}</Text>
                <Text style={styles.listItemText}>Fiyat: {purchase.price} TL/g</Text>
                <Text style={styles.listItemText}>Miktar: {purchase.quantity} g</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... stiller öncekiyle aynı kalacak, sadece yükleniyor ekranı için ek bir stil eklenebilir
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container_center: { // Yükleniyor ekranı için
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  listContainer: {
    padding: 20,
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  listItem: {
    backgroundColor: '#e9e9e9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 16,
    marginBottom: 3,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  }
});

export default App;