<template>
  <Layout>
    <!-- TODO this page is a feed and for now there won't be any detail pages -->
    <div class="flex flex-wrap justify-center sm:w-full md:w-full lg:w-full xl:w-full">
      <div
        v-for="product in products"
        :key="product._id"
        class="sm:w-full md:w-full lg:w-2/5 xl:w-2/5 m-3 rounded shadow-lg overflow-hidden"
      >
        <!-- TODO check the other project for components such as SanityImage to break the code down -->
        <!-- Rename HeroImage as something else -->
        <!-- hook up each image to a lightbox, other version of Nfolio had this -->
        <img v-if="product.heroImage" :src="imageUrlFor(product.heroImage).ignoreImageParams()" />
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ product.title }}</div>
          <!-- TODO don't like the name blurb, so wish to spend time on naming decisions -->
          <!-- should work like tweets and work like a micro-blog -->
          <!-- TODO the text also needs conversion from block format -->
          <!-- Refer to the nfolio.4 project for guidance.... -->
          <p class="text-gray-700 text-base">{{ product.blurb }}</p>
        </div>
        <div class="px-6 py-4">
          <span
            class="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >Location taken</span>
        </div>
        <!-- TODO the tags should be dynamic and will lead to filters by subject -->
        <div class="px-6 py-4">
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
        <!-- TODO buy button, just A4 prints for now, maybe display a modal in the future? -->
      </div>
    </div>
  </Layout>
</template>

<script>
import sanity from "../sanity";
import imageUrlBuilder from "@sanity/image-url";
const imageBuilder = imageUrlBuilder(sanity);

// TODO - How do I order this by updated in descending order?
// Filter out entries with no heroImage
// probably want a load more feature and how best to implement that?
const query = `*[_type == "product"] {
  _id,
  heroImage,
  blurb,
  title}[0...10]`;

export default {
  data() {
    return {
      loading: true,
      formData: {},
      products: []
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: "fetchData"
  },

  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
    },
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },

    fetchData() {
      this.error = this.post = null;
      this.loading = true;
      sanity.fetch(query).then(
        products => {
          this.loading = false;
          this.products = products;
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

