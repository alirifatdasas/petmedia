import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  Home as HomeIcon,
  Users,
  Droplets
} from 'lucide-react-native';
import { theme } from '../../theme';
import { AppHeader } from '../../components/common/AppHeader';
import { FeatureCard } from '../../components/common/FeatureCard';
import { PetCard } from '../../components/common/PetCard';
import { BeautifulModal } from '../../components/common/BeautifulModal';
import { PetDetailModal } from '../../components/common/PetDetailModal';
import { PawIcon } from '../../components/common/PawIcon';
import { usePetStore } from '../../stores/petStore';
import { Pet } from '../../types';

const { width } = Dimensions.get('window');

// Mock data for pets
const mockPets: Pet[] = [
  {
    id: '1',
    ownerId: 'owner1',
    species: 'dog',
    name: 'Luna',
    sex: 'female',
    ageMonths: 24,
    size: 'medium',
    breed: 'Golden Retriever Mix',
    city: 'İstanbul',
    vaccinated: true,
    neutered: true,
    description: 'Çok sevimli ve oyuncu bir köpek. Çocuklarla çok iyi anlaşıyor.',
    photos: [
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
      'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg'
    ],
    videos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    ],
    tags: ['arkadaş-canlısı', 'eğitilmiş'],
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    ownerId: 'owner2',
    species: 'cat',
    name: 'Pamuk',
    sex: 'male',
    ageMonths: 8,
    size: 'small',
    breed: 'Van Kedisi',
    city: 'Ankara',
    vaccinated: true,
    neutered: false,
    description: 'Sakin ve sevecen bir kedi. Apartman hayatına uygun.',
    photos: [
      'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
      'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg',
      'https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg'
    ],
    videos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
    ],
    tags: ['sakin', 'ev-kedisi'],
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    ownerId: 'owner3',
    species: 'dog',
    name: 'Karabaş',
    sex: 'male',
    ageMonths: 36,
    size: 'large',
    breed: 'Kangal',
    city: 'İzmir',
    vaccinated: true,
    neutered: true,
    description: 'Sadık ve koruyucu bir köpek. Geniş bahçeli ev arıyor.',
    photos: [
      'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg',
      'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'
    ],
    videos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'
    ],
    tags: ['koruyucu', 'sadık'],
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    ownerId: 'owner4',
    species: 'cat',
    name: 'Minnoş',
    sex: 'female',
    ageMonths: 12,
    size: 'small',
    breed: 'Tekir',
    city: 'Bursa',
    vaccinated: true,
    neutered: true,
    description: 'Oyuncu ve enerjik bir kedi. Çocuklarla çok iyi anlaşır.',
    photos: [
      'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg',
      'https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg',
      'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg'
    ],
    videos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    ],
    tags: ['oyuncu', 'çocuk-dostu', 'enerjik'],
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cat' | 'dog' | 'other'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    description: '',
    icon: null as React.ReactNode,
    onConfirm: () => {}
  });
  const [petDetailVisible, setPetDetailVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  
  const { favorites, toggleFavorite } = usePetStore();

  const filteredPets = mockPets.filter(pet => {
    const matchesFilter = selectedFilter === 'all' || pet.species === selectedFilter;
    return matchesFilter;
  });

  const renderPetCard = ({ item }: { item: Pet }) => (
    <PetCard
      pet={item}
      isFavorite={favorites.includes(item.id)}
      onPress={() => {
        setSelectedPet(item);
        setPetDetailVisible(true);
      }}
      onFavoritePress={() => toggleFavorite(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" backgroundColor={theme.colors.background.primary} />
      
      {/* Header */}
      <AppHeader 
        showLogin={true}
        onLoginPress={() => console.log('Login pressed')}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <FeatureCard
            title={t('features.findHome.title')}
            backgroundColor={theme.colors.cards.purple}
            icon={<HomeIcon size={32} color="white" />}
            onPress={() => {
              setModalContent({
                title: "🏠 Yuva Bul",
                description: "Her yıl binlerce sevimli dostumuz sokaklarda yaşıyor. Onlara güvenli bir yuva bulmak, sadece bir ev değil, sevgi dolu bir aile demek. Bu dostlarımızın hayatını değiştirebilir, onlara ikinci bir şans verebilirsiniz. Her sahiplenme, bir hayat kurtarır ve dünyayı daha güzel bir yer yapar.",
                icon: <HomeIcon size={40} color={theme.colors.primary[500]} />,
                onConfirm: () => {
                  console.log('Find home pressed');
                  setModalVisible(false);
                }
              });
              setModalVisible(true);
            }}
          />
          
          <FeatureCard
            title={t('features.findFriend.title')}
            backgroundColor={theme.colors.cards.lightBlue}
            icon={<Users size={32} color="white" />}
            onPress={() => {
              setModalContent({
                title: "👥 Arkadaş Bul",
                description: "Pet sahipleriyle tanışmak, deneyimlerinizi paylaşmak ve birlikte güzel anılar biriktirmek için harika bir fırsat! Aynı sevgiyi paylaşan insanlarla bağ kurun, yeni dostluklar edinin ve pet dünyasının bir parçası olun. Birlikte daha güçlüyüz!",
                icon: <Users size={40} color={theme.colors.primary[500]} />,
                onConfirm: () => {
                  console.log('Find friend pressed');
                  setModalVisible(false);
                }
              });
              setModalVisible(true);
            }}
          />
          
          <FeatureCard
            title={t('features.foodWater.title')}
            backgroundColor={theme.colors.cards.orange}
            icon={<Droplets size={32} color="white" />}
            onPress={() => {
              setModalContent({
                title: "💧 Yemek & Su",
                description: "Sokaklarda aç kalan dostlarımız için küçük bir yardım büyük fark yaratır. Bir kap su, bir parça yemek onların hayatını kurtarabilir. Bu sevgi dolu dostlarımızın temel ihtiyaçlarını karşılamak, onlara umut vermek demektir. Her yardım, bir hayat kurtarır.",
                icon: <Droplets size={40} color={theme.colors.primary[500]} />,
                onConfirm: () => {
                  console.log('Food/water pressed');
                  setModalVisible(false);
                }
              });
              setModalVisible(true);
            }}
          />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA', '#C4B5FD']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                <PawIcon size={60} color="white" />
              </View>
              
              <Text style={styles.heroTitle}>
                🐾 Dostlarımızı Yalnız Bırakmıyoruz
              </Text>
              
              <Text style={styles.heroDescription}>
                Her sevimli dostumuz bir aile bekliyor. Onlara güvenli bir yuva, 
                sevgi dolu bir kalp ve sonsuz mutluluk verelim. Birlikte daha güzel 
                bir dünya kuralım! 💕
              </Text>
              
              <View style={styles.heroStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1000+</Text>
                  <Text style={styles.statLabel}>Mutlu Aile</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Kurtarılan Hayat</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>24/7</Text>
                  <Text style={styles.statLabel}>Destek</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Sahiplenmek İsteyenler</Text>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {[
              { key: 'all', label: 'Hepsi' },
              { key: 'cat', label: 'Kediler' },
              { key: 'dog', label: 'Köpekler' },
              { key: 'other', label: 'Diğerleri' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.key && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pets Grid */}
        <View style={styles.petsContainer}>
          <View style={styles.petsGrid}>
            {filteredPets.map((pet) => (
              <View key={pet.id} style={styles.petCardWrapper}>
                {renderPetCard({ item: pet })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Beautiful Modal */}
      <BeautifulModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        description={modalContent.description}
        icon={modalContent.icon}
        onConfirm={modalContent.onConfirm}
        confirmText="Devam Et"
        cancelText="İptal"
      />

      {/* Pet Detail Modal */}
      <PetDetailModal
        visible={petDetailVisible}
        onClose={() => setPetDetailVisible(false)}
        pet={selectedPet}
        isFavorite={selectedPet ? favorites.includes(selectedPet.id) : false}
        onFavoritePress={() => {
          if (selectedPet) {
            toggleFavorite(selectedPet.id);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Account for tab bar
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  heroSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius['2xl'],
    overflow: 'hidden',
  },
  heroGradient: {
    padding: theme.spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIconContainer: {
    marginBottom: theme.spacing.md,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bodyBold,
    textAlign: 'center',
    color: 'white',
    marginBottom: theme.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroDescription: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.body,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bodyBold,
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: theme.spacing.xs,
  },
  searchSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: theme.typography.fontFamily.bodyBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bodySemiBold,
    color: theme.colors.text.secondary,
  },
  filterTextActive: {
    color: theme.colors.text.inverse,
  },
  petsContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  petCardWrapper: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
});