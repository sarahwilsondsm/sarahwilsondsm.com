const contentful = require("contentful");

const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN,
});

async function main() {
  const response = await client.getEntries({
    limit: 1,
    order: "sys.updatedAt",
  });
  const lastUpdatedMs = new Date(response.items?.[0].sys.updatedAt).getTime();
  console.log(parseInt(lastUpdatedMs / 1000));
};
main()
