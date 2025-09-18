import React, { useState } from "react";
import type { ReactNode } from "react";
import { type SearchFunction, Dropdown } from "./components/Dropdown";

// Типи для демо-даних
interface City {
  id: number;
  name: string;
  population: number;
}

interface Color {
  id: number;
  name: string;
  value: string;
  label: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCityObj, setSelectedCityObj] = useState<City | null>(null);

  // Простий список міст (рядки)
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

  // Міста як об'єкти
  const citiesWithData: City[] = [
    { id: 1, name: 'Київ', population: 2797553 },
    { id: 2, name: 'Харків', population: 1421125 },
    { id: 3, name: 'Одеса', population: 1017022 },
    { id: 4, name: 'Дніпро', population: 980948 },
  ];

  // Об'єкти з кольорами
  const colors: Color[] = [
    { id: 1, name: 'Червоний', value: '#ff0000', label: 'Червоний' },
    { id: 2, name: 'Синій', value: '#0000ff', label: 'Синій' },
    { id: 3, name: 'Зелений', value: '#00ff00', label: 'Зелений' },
    { id: 4, name: 'Жовтий', value: '#ffff00', label: 'Жовтий' },
  ];

  // Користувачі для асинхронного пошуку
  const users: User[] = [
    { id: 1, name: 'Олексій Петренко', email: 'oleksii@example.com', role: 'Admin' },
    { id: 2, name: 'Марія Іваненко', email: 'maria@example.com', role: 'User' },
    { id: 3, name: 'Андрій Коваленко', email: 'andrii@example.com', role: 'Moderator' },
    { id: 4, name: 'Тетяна Мельник', email: 'tetiana@example.com', role: 'User' },
  ];

  // Кастомний рендер для кольорів
  const renderColorOption = (color: Color): ReactNode => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '16px',
          height: '16px',
          backgroundColor: color.value,
          borderRadius: '3px',
          border: '1px solid #ccc'
        }}
      />
      {color.label}
    </div>
  );

  // Кастомний рендер вибраного кольору
  const renderSelectedColor = (color: Color): ReactNode => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '16px',
          height: '16px',
          backgroundColor: color.value,
          borderRadius: '3px',
          border: '1px solid #ccc'
        }}
      />
      {color.label}
    </div>
  );

  // Кастомний рендер для міст з популяцією
  const renderCityOption = (city: City): ReactNode => (
    <div>
      <div style={{ fontWeight: '500' }}>{city.name}</div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        Населення: {city.population.toLocaleString()}
      </div>
    </div>
  );

  // Асинхронна функція пошуку користувачів
  const searchUsers: SearchFunction<User> = async (searchTerm: string, allUsers: User[]) => {
    // Імітуємо затримку API
    await new Promise(resolve => setTimeout(resolve, 500));

    return allUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Кастомний рендер користувачів
  const renderUserOption = (user: User): ReactNode => (
    <div>
      <div style={{ fontWeight: '500' }}>{user.name}</div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        {user.email} • {user.role}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ marginBottom: '20px', color: '#1f2937' }}>
        Dropdown
      </h1>

      <div style={{ display: 'grid', gap: '15px', maxWidth: '600px' }}>
        {/* Простий dropdown */}
        <div>
          <h3 style={{ marginBottom: '10px', color: '#374151' }}>Простий список:</h3>
          <Dropdown<string>
            options={cities}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Оберіть ваше місто"
            name="city-select"
          />
          {selectedCity && (
            <p style={{ marginTop: '10px', color: '#6b7280' }}>
              Вибране місто: <strong>{selectedCity}</strong>
            </p>
          )}
        </div>

        {/* Dropdown з об'єктами */}
        <div>
          <h3 style={{ marginBottom: '10px', color: '#374151' }}>Список об'єктів (міста з даними):</h3>
          <Dropdown<City>
            options={citiesWithData}
            value={selectedCityObj}
            onChange={setSelectedCityObj}
            placeholder="Оберіть місто"
            renderOption={renderCityOption}
            renderSelected={(city) => `${city.name} (${city.population.toLocaleString()})`}
            name="city-obj-select"
          />
          {selectedCityObj && (
            <p style={{ marginTop: '10px', color: '#6b7280' }}>
              Вибране місто: <strong>{selectedCityObj.name}</strong>
              (населення: {selectedCityObj.population.toLocaleString()})
            </p>
          )}
        </div>

        {/* Dropdown з кастомним рендерингом */}
        <div>
          <h3 style={{ marginBottom: '10px', color: '#374151' }}>З кастомним рендерингом (кольори):</h3>
          <Dropdown<Color>
            options={colors}
            value={selectedColor}
            onChange={setSelectedColor}
            placeholder="Оберіть колір"
            renderOption={renderColorOption}
            renderSelected={renderSelectedColor}
            name="color-select"
          />
          {selectedColor && (
            <p style={{ marginTop: '10px', color: '#6b7280' }}>
              Вибраний колір: <strong>{selectedColor.label}</strong> ({selectedColor.value})
            </p>
          )}
        </div>

        {/* Dropdown з асинхронним пошуком */}
        <div>
          <h3 style={{ marginBottom: '10px', color: '#374151' }}>З асинхронним пошуком (користувачі):</h3>
          <Dropdown<User>
            options={users}
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder="Оберіть користувача"
            searchPlaceholder="Введіть ім'я, email або роль..."
            searchFunction={searchUsers}
            renderOption={renderUserOption}
            renderSelected={(user) => user.name}
            name="user-select"
          />
          {selectedUser && (
            <div style={{ marginTop: '10px', color: '#6b7280' }}>
              <p><strong>Користувач:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Роль:</strong> {selectedUser.role}</p>
            </div>
          )}
        </div>

        {/* Відключений dropdown */}
        <div>
          <h3 style={{ marginBottom: '10px', color: '#374151' }}>Відключений dropdown:</h3>
          <Dropdown<string>
            options={cities}
            value={null}
            onChange={() => { }}
            placeholder="Цей dropdown відключений"
            disabled={true}
            name="disabled-select"
          />
        </div>
      </div>
    </div>
  );
};

export default App;