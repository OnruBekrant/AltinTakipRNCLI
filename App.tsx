import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert, // Kullanıcıya basit mesajlar göstermek için
  ScrollView, // Çok sayıda giriş olduğunda kaydırma için
} from 'react-native';

// Her bir altın alımının nasıl görüneceğini tanımlayalım
interface GoldPurchase {
  id: string; // Benzersiz bir kimlik
  date: string;
  price: string; // Şimdilik string, sayısal işlemlerde Number() ile çevireceğiz
  quantity: string; // Şimdilik string
  // notes?: string; // Opsiyonel not alanı
}

function App(): React.JSX.Element {
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  // const [notes, setNotes] = useState(''); // Notlar için

  // Kaydedilen altın alımlarını tutacak state
  const [purchases, setPurchases] = useState<GoldPurchase[]>([]);

  const handleAddPurchase = () => {
    if (!date.trim() || !price.trim() || !quantity.trim()) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    // Basit bir ID oluşturma (daha iyisi için uuid gibi bir kütüphane kullanılabilir)
    const newPurchase: GoldPurchase = {
      id: Date.now().toString(), // Geçici olarak anlık zamanı ID yapalım
      date,
      price,
      quantity,
      // notes,
    };

    // Yeni alımı mevcut listeye ekle
    setPurchases(prevPurchases => [...prevPurchases, newPurchase]);

    // Formu temizle
    setDate('');
    setPrice('');
    setQuantity('');
    // setNotes('');

    Alert.alert('Başarılı', 'Altın alımınız eklendi!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          {/*
          <TextInput
            style={styles.input}
            placeholder="Notlar (opsiyonel)"
            value={notes}
            onChangeText={setNotes}
          />
          */}
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
                {/* purchase.notes ? <Text style={styles.listItemText}>Not: {purchase.notes}</Text> : null */}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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