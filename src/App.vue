<template>
<v-app id="inspire">
  <component :is="layout">
    <router-view/>
  </component>
</v-app>
</template>

<script>
import EmptyLayout from '@/layouts/EmptyLayout'
import MainLayout from '@/layouts/MainLayout'

export default {
  computed: {
    layout(){
      return (this.$route.meta.layout || 'main') + '-layout'
    }
  },
  components: {
    EmptyLayout,MainLayout
  }
 

};
</script>
