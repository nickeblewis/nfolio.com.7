<template>
  <Layout>
    <div class="flex flex-wrap justify-center sm:w-full md:w-full lg:w-4/5 xl:w-4/5">
      <div
        v-for="product in products"
        :key="product._id"
        class="sm:w-full md:w-full lg:w-2/5 xl:w-2/5 m-3 rounded shadow-lg overflow-hidden"
      >
        <!-- <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" /> -->
        
        
        <img
        v-if="product.heroImage"
        :src="imageUrlFor(product.heroImage).ignoreImageParams()" />
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ product.title }}</div>
          <p
            class="text-gray-700 text-base"
          >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.</p>
        </div>
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
      </div>
    </div>
    <!-- {{ product.title }}
      <img
        v-if="product.heroImage"
        :src="imageUrlFor(product.heroImage).ignoreImageParams().width(240)"
    />-->
    
   
  </Layout>
</template>

<script>
import sanity from "../sanity";
import imageUrlBuilder from "@sanity/image-url";
const imageBuilder = imageUrlBuilder(sanity);

const query = `*[_type == "product"] {
  _id,
  heroImage,
  title}[0...50]`;

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

