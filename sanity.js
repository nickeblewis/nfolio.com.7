import sanityClient from "@sanity/client";

export default sanityClient({
  // Find your project ID and dataset in `sanity.json` in your studio project
  projectId: "85cmsqr4",
  dataset: "production",
  useCdn: true
  // token: 'skpwk6ICsOiuL8yEKbbvCdBPYtvPioRHPDUsDlYJk7JlmmCFNuzbEf2YyBuy8SHNgEXodYcQIHzSQMpMZVRqYt7JD02OH4moxKaq33iTgLDrIQA75k6TtVuA76DFoOs3ahU4FQfghRA36zQ4RuVVOfx6eXVBiB1oCCk1O37NcidG3QccHLq8'
  // useCdn == true gives fast, cheap responses using a globally distributed cache.
  // Set this to false if your application require the freshest possible
  // data always (potentially slightly slower and a bit more expensive).
});