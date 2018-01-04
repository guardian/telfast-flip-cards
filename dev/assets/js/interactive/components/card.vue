<template lang="pug">
  .card.column(
    v-on:click="flipCard"
    v-bind:class="{ 'flipped': isFlipped }"
  )
    .card__wrapper
      .card__front
        header
          h2 {{ card.title }}
        footer
          ul
            li
              b Latin name:
              span.name {{ card.latin }}
            li
              b Family name:
              span.family {{ card.family }}
            li
              b Life cycle:
              span.lifecycle {{ card.lifecycle }}
        .image
          img(:src="card.image" width="214px", height="325px")
      .card__back
        header
          h3 {{ card.title }}

        p {{ card.description }}
        h4 Commonly found:
        p {{ card.found }}
</template>

<script>
export default {
  props: ['card'],

  data: function() {
    return {
      isFlipped: false,
    }
  },

  methods: {
    flipCard: function() {
      this.isFlipped = !this.isFlipped
    },
  },
}
</script>
