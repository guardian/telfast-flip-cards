<template lang="pug">
article
  nav.filters(role="navigation")
    .container
      ul.toggle(
          v-bind:class="{ 'nav-mobile-open': showMobileNav }"
        )
        li.title(v-on:click="toggleNav") Where do you live?
        li(v-for="region in regionOptions" v-on:click="filterRegion(region)")
          a(:class="{'active': selectedRegion === region}") {{ region.toUpperCase() }}

  section.container
    .cards.row(v-bind:class="{ 'loaded': isLoaded }")
      transition-group(name="scale-fade")
        card(
          v-for="(card, index) in filteredCards",
          :key="index",
          v-bind:card="card"
        )

    .row
      .disclaimer.column
        p
          b Disclaimer:
          |  Always read the label. Use only as directed. If symptoms persist see your healthcare professional. CHCANZ.CFEX.17.08.1194
</template>

<script>
// vue components
import Card from './components/card.vue'
//card data
import cards from './card-data.js'
//region date
const regionOptions = ['nsw', 'vic', 'sa', 'wa', 'qld', 'tas', 'nt', 'act']

export default {
  components: {
    Card,
  },

  data() {
    return {
      cards,
      regionOptions,
      selectedRegion: 'nsw',
      isLoaded: false,
      showMobileNav: false
    }
  },

  methods: {
    filterRegion(region) {
      this.selectedRegion = this.selectedRegion === region ? null : region
    },
    toggleNav() {
      this.showMobileNav = !this.showMobileNav
    }
  },

  computed: {
    filteredCards() {
      //if no regions, return all cards
      if (!this.selectedRegion) return cards
      //return all cards that have a state in the selected regions
      return cards.filter(card => {
        return card.states.some(state => {
          return this.selectedRegion === state
        })
      })
    },
  },

  mounted: function () {
    setTimeout( () => {
      this.isLoaded = true
    }, 800)
  }
}
</script>
