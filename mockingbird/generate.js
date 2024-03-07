import {
  presetSchemas,
  TinybirdGenerator,
} from "@tinybirdco/mockingbird";
 
const schema = presetSchemas["Web Analytics Starter Kit"];

const tinybFilePath = '../tinybird/.tinyb'

const tbToken = retrieveTinybirdToken(tinybFilePath)
 
const tbGenerator = new TinybirdGenerator({
  schema,
  endpoint: "us_gcp",
  datasource: "test",
  token: tbToken,
  eps: 1,
  limit: -1,
});

async function retrieveTinybirdToken(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON file. Status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData || !jsonData.token) {
      throw new Error('Token not found in JSON file.');
    }

    return jsonData.token;
  } catch (error) {
    console.error('Error retrieving token:', error.message);
    return null;
  }
}
 
await tbGenerator.generate();