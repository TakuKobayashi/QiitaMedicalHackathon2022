import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("https://p2e3m40ce5.execute-api.ap-northeast-1.amazonaws.com/production/admin");

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="user_info/list" list={ListGuesser} />
    <Resource name="user_vital/list" list={ListGuesser} />
  </Admin>
);

export default App;