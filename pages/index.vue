<template>
  <Layout>
    <div class="flex flex-wrap justify-center sm:w-full md:w-full lg:w-full xl:w-full py-2 px-4">
    <button
      v-on:click="fetchData"
      class="bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >Refresh</button>
    </div>
    <!-- TODO this page is a feed and for now there won't be any detail pages -->
    <div class="flex flex-wrap justify-center sm:w-full md:w-full lg:w-full xl:w-full">
      <div
        v-for="post in posts"
        :key="post._id"
        class="bg-background-tertiary sm:w-full md:w-full lg:w-2/5 xl:w-2/5 m-3 rounded-lg shadow-lg overflow-hidden"
      >
        <!-- TODO check the other project for components such as SanityImage to break the code down -->
        <!-- Rename mainImage as something else -->
        <!-- hook up each image to a lightbox, other version of Nfolio had this -->
        <!-- We may later wish to show videos -->
        <!-- Gallery posts will be different to single image posts, have a think -->
        <img
          v-if="post.mainImage"
          :src="imageUrlFor(post.mainImage).ignoreImageParams().width(640)"
          class="justify-center"
        />
        <!--<div class="px-6 py-4">
          <span
            class="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >Location taken</span>
        </div>-->
        <!-- TODO the tags should be dynamic and will lead to filters by subject -->
        <!-- TODO tags don't yet exist for the post type needs adding to the schema -->
        <div class="px-6 py-4">
          {{ post.tags }}
          <span
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >#photography</span>
          <span
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >#travel</span>
          <span
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
          >#winter</span>
        </div>

        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ post.title }}</div>
          <!-- TODO don't like the name blurb, so wish to spend time on naming decisions -->
          <!-- should work like tweets and work like a micro-blog -->
          <!-- TODO the text also needs conversion from block format -->
          <!-- Refer to the nfolio.4 project for guidance.... -->
          <!-- TODO I think the text can be corrected via the UI -->
          <!--<p class="text-gray-700 text-base">{{ post.excerpt }}</p>-->
          <div class="body" v-html="excerptHtml(post)" />
        </div>
        <!-- TODO buy button, just A4 prints for now, maybe display a modal in the future? -->
      </div>
    </div>
  </Layout>
</template>

<script>
import sanity from "../sanity";
import imageUrlBuilder from "@sanity/image-url";
import blocksToHtml from "@sanity/block-content-to-html";
import queue from "p-queue";
//import PullTo from "vue-pull-to"
//import VuePullRefresh from 'vue-pull-refresh'
const imageBuilder = imageUrlBuilder(sanity);

// TODO - How do I order this by updated in descending order?
// Filter out entries with no mainImage
// probably want a load more feature and how best to implement that?
const query = `*[_type == "product"] | order(_updatedAt desc) {
  _id,
  heroImage,
  blurb,
  title}[0...50]`;

const blogQuery = `*[_type == "post" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
  _id,
  mainImage,
  excerpt,
  tags,
  title}[0...50]`;

export default {
  components: {
    //'vue-pull-refresh': VuePullRefresh
  },
  data() {
    return {
      loading: true,
      formData: {},
      posts: []
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: "fetchData"
  },
  computed: {},
  methods: {
    bodyHtml(post) {
      if (!post || !post.body) {
        return "…";
      }
      return blocksToHtml({
        blocks: post.body,
        dataset: sanity.clientConfig.dataset,
        projectId: sanity.clientConfig.projectId
      });
    },
    excerptHtml(post) {
      console.log(post);
      if (!post || !post.excerpt) {
        return "…";
      }
      return blocksToHtml({
        blocks: post.excerpt,
        dataset: sanity.clientConfig.dataset,
        projectId: sanity.clientConfig.projectId
      });
    },
    encode(data) {
      return Object.keys(data)
        .map(
          key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
    },
    imageUrlFor(source) {
      // the below works
      //sanity.create({ _type: "category", title: "Basingstoke"}).then(console.log)
      // TODO remove the categories for Basingstoke
      // TODO implement a views counter
      return imageBuilder.image(source);
    },

    fetchData() {
      this.error = this.post = null;
      this.loading = true;
      sanity.fetch(blogQuery).then(
        posts => {
          this.loading = false;
          this.posts = posts;
        },
        error => {
          this.error = error;
        }
      );
    },

    handleSubmit(e) {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.encode({
          "form-name": e.target.getAttribute("name"),
          ...this.formData
        })
      })
        .then(() => this.$router.push("/success"))
        .catch(error => alert(error));
    }
  },

  metaInfo: {
    title: "Home"
  }
};
</script>

