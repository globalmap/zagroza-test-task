import { useState } from "react";
import { Dropdown } from "./components/Dropdown";

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cities: string[] = [
    'Київ',
    'Харків',
    'Одеса',
    'Дніпро',
    'Донецьк',
    'Запоріжжя',
    'Львів',
    'Кривий Ріг'
  ];
  return (
    <>
      <Dropdown<string>
        options={cities}
        value={selectedCity}
        onChange={setSelectedCity}
        placeholder="Оберіть ваше місто"
        name="city-select"
      />
    </>
  )
}

export default App;
