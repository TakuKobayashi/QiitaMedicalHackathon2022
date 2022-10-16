import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { VitalCreate } from './sensor-vital-create';

//const dataProvider = jsonServerProvider("http://localhost:3000/dev");
const dataProvider = jsonServerProvider("https://p2e3m40ce5.execute-api.ap-northeast-1.amazonaws.com/production");

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="admin/user_info/list" list={ListGuesser} />
    <Resource name="admin/user_vital/list" list={ListGuesser} create={VitalCreate} />
  </Admin>
);

export default App;