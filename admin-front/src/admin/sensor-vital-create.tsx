import * as React from "react";
import { Create, SimpleForm, TextInput, SelectField, required, NumberInput} from 'react-admin';

export const VitalCreate = () => (
  <Create resource="sensors/vital/record">
      <SimpleForm>
          <NumberInput source="vital_type" validate={[required()]} defaultValue="1" fullWidth />
          <NumberInput source="value" validate={[required()]} defaultValue="0" fullWidth />
      </SimpleForm>
  </Create>
);