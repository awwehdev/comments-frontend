<template>
  <div>
    <comment-grid baseURL="http://localhost:8000/" apiKey="PKn5wcfBmhGpbKFHyDQLxSW0sOzfGVjDKzi3ru7l8952ffde" nodeName="topic"></comment-grid> 
  </div>
</template>

<script>
  import Comments from "./comments/Comments.vue";
  export default {
    name: "fullscreenDemo",
    components: {
      CommentGrid: Comments
    }
  };
</script>

<style>

</style>
