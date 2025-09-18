import type { ReactNode } from 'react';

// Базові типи для опцій
export interface OptionWithId {
  id: string | number;
  label?: string;
  name?: string;
  [key: string]: any;
}

export interface OptionWithValue {
  value: string | number;
  label?: string;
  name?: string;
  [key: string]: any;
}

export type OptionType = string | OptionWithId | OptionWithValue | Record<string, any>;

// Тип для функції пошуку
export type SearchFunction<T extends OptionType> = (
  searchTerm: string,
  options: T[]
) => Promise<T[]> | T[];

// Пропси для компонента
export interface DropdownProps<T extends OptionType> {
  options: T[];
  value: T | null;
  onChange: (option: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  renderOption?: (option: T) => ReactNode;
  renderSelected?: (option: T) => ReactNode;
  searchFunction?: SearchFunction<T>;
  className?: string;
  disabled?: boolean;
  name?: string;
}

// Типи для хука
export interface UseDropdownReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}