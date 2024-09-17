<template>
  <div class="bg-gray-900 min-h-screen p-8 text-white">
    <div class="container mx-auto">

      <div class="flex items-center justify-center mb-12 space-x-6">
  
        <img 
          src="./assets/img/rick-morty.png" 
          alt="Rick and Morty" 
          class="w-48 h-auto object-cover transform transition-transform duration-300 hover:scale-110 hover:rotate-3"
        />
    
        <h1 class="text-7xl font-bold text-green-400 text-center leading-tight transform transition-transform duration-300 hover:scale-105 hover:text-yellow-300">
          Rick and Morty
        </h1>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
 
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="searchCharacters" 
          placeholder="Search by name..." 
          class="w-full max-w-md p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        />

        <select 
          v-model="selectedStatus" 
          @change="filterByStatus" 
          class="w-full max-w-md p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        >
          <option value="">All</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div 
          v-for="character in filteredCharacters" 
          :key="character.id" 
          class="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-out"
        >
          <img 
            :src="character.image" 
            :alt="character.name" 
            class="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
          />
          <div class="p-4">
            <h2 class="text-2xl font-semibold text-white mb-2">{{ character.name }}</h2>
            <div class="flex justify-between items-center mb-3">
              <span 
                :class="getStatusClass(character.status)" 
                class="px-2 py-1 rounded-full text-sm font-medium"
              >
                {{ character.status }}
              </span>
              <span class="text-gray-400">{{ character.species }}</span>
            </div>
            <p class="text-gray-500 text-sm">Origin: {{ character.origin.name }}</p>
            <p class="text-gray-500 text-sm">Location: {{ character.location.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from './services/api';

export default {
  data() {
    return {
      characters: [],
      filteredCharacters: [],
      currentPage: 1,
      searchQuery: '',
      selectedStatus: '',
    };
  },
  created() {
    this.fetchCharacters();
  },
  methods: {
    async fetchCharacters() {
      try {
        const response = await api.getCharacters(this.currentPage);
        this.characters = response.data.results;
        this.filteredCharacters = this.characters;
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    },
    async searchCharacters() {
      try {
        if (this.searchQuery === '') {
          this.fetchCharacters();
        } else {
          const response = await api.searchCharactersByName(this.searchQuery);
          this.characters = response.data.results;
          this.filteredCharacters = this.characters;
        }
      } catch (error) {
        console.error('Error', error);
      }
    },
    filterByStatus() {
      if (this.selectedStatus === '') {
        this.filteredCharacters = this.characters;
      } else {
        this.filteredCharacters = this.characters.filter(
          character => character.status === this.selectedStatus
        );
      }
    },
    async loadMore() {
      try {
        this.currentPage++;
        const response = await api.getCharacters(this.currentPage);
        this.characters = [...this.characters, ...response.data.results];
        this.filterByStatus(); 
      } catch (error) {
        console.error('Error loading more characters:', error);
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 'Alive':
          return 'bg-green-500 text-white';
        case 'Dead':
          return 'bg-red-500 text-white';
        default:
          return 'bg-gray-500 text-white';
      }
    }
  },
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}
</style>
