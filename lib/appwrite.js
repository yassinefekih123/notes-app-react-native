import "react-native-url-polyfill/auto";
import {
  Client,
  TablesDB,
  Account,
  ID,
  Query,
  Permission,
  Role,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://fra.cloud.appwrite.io/v1",
  projectId: "6ac564f600188e056b37",
  databaseId: "6ac566bb001ef4bbb2ee",
  tableId: "6ac566c3001e909c9c07",
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform("com.notesapp");

export const tablesDB = new TablesDB(client);
export const account = new Account(client);
export { ID, Query, Permission, Role };