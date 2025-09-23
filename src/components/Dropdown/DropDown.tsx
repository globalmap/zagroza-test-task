import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDropdown } from "./hooks/useDropdown";
import type { DropdownProps, OptionType } from './Dropdown.types';

export function Dropdown<T extends OptionType>({
  options = [],
  value = null,
  onChange,
  placeholder = "Оберіть ваше місто",
  searchPlaceholder = "Пошук...",
  renderOption,
  renderSelected,
  searchFunction,
  className = "",
  disabled = false,
  name,
}: DropdownProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
  const [loading, setLoading] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { isOpen, toggle, close, dropdownRef } = useDropdown();

  // Фільтрація опцій
  useEffect(() => {
    const filterOptions = async () => {
      if (!searchTerm) {
        setFilteredOptions(options);
        return;
      }

      if (searchFunction) {
        setLoading(true);
        try {
          const results = await searchFunction(searchTerm, options);
          setFilteredOptions(results);
        } catch (error) {
          console.error('Search error:', error);
          setFilteredOptions([]);
        } finally {
          setLoading(false);
        }
      } else {
        // Дефолтна функція пошуку
        const filtered = options.filter((option: T) => {
          const searchableText = typeof option === 'string' 
            ? option 
            : (option as any).label || (option as any).name || '';
          return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredOptions(filtered);
      }
    };

    filterOptions();
  }, [searchTerm, options, searchFunction]);

  // Фокус на пошук при відкритті
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Скидання пошуку при закритті
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Скидання highlighted index при зміні опцій
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  const handleSelect = (option: T, index?: number) => {
    onChange(option);
    close();
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        toggle();
      } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex], highlightedIndex);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        toggle();
        // Після відкриття встановлюємо перший елемент
        setTimeout(() => {
          if (filteredOptions.length > 0) {
            setHighlightedIndex(0);
            scrollToOption(0);
          }
        }, 0);
      } else if (filteredOptions.length > 0) {
        // Циклічна навігація вниз
        const nextIndex = highlightedIndex === -1 
          ? 0 
          : (highlightedIndex + 1) % filteredOptions.length;
        setHighlightedIndex(nextIndex);
        scrollToOption(nextIndex);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen && filteredOptions.length > 0) {
        // Циклічна навігація вгору
        const prevIndex = highlightedIndex === -1 
          ? filteredOptions.length - 1
          : highlightedIndex === 0 
            ? filteredOptions.length - 1 
            : highlightedIndex - 1;
        setHighlightedIndex(prevIndex);
        scrollToOption(prevIndex);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (isOpen && filteredOptions.length > 0) {
        setHighlightedIndex(0);
        scrollToOption(0);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      if (isOpen && filteredOptions.length > 0) {
        const lastIndex = filteredOptions.length - 1;
        setHighlightedIndex(lastIndex);
        scrollToOption(lastIndex);
      }
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        const nextIndex = highlightedIndex === -1 
          ? 0 
          : (highlightedIndex + 1) % filteredOptions.length;
        setHighlightedIndex(nextIndex);
        scrollToOption(nextIndex);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        const prevIndex = highlightedIndex === -1 
          ? filteredOptions.length - 1
          : highlightedIndex === 0 
            ? filteredOptions.length - 1 
            : highlightedIndex - 1;
        setHighlightedIndex(prevIndex);
        scrollToOption(prevIndex);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex], highlightedIndex);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setHighlightedIndex(0);
        scrollToOption(0);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        const lastIndex = filteredOptions.length - 1;
        setHighlightedIndex(lastIndex);
        scrollToOption(lastIndex);
      }
    }
  };

  const scrollToOption = (index: number) => {
    const option = optionRefs.current[index];
    if (option) {
      option.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  };

  const handleMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  const getDisplayValue = (): string => {
    if (!value) return placeholder;
    if (renderSelected) return renderSelected(value) as string;
    return typeof value === 'string' 
      ? value 
      : (value as any).label || (value as any).name || String(value);
  };

  const getOptionDisplay = (option: T): ReactNode => {
    if (renderOption) return renderOption(option);
    return typeof option === 'string' 
      ? option 
      : (option as any).label || (option as any).name || String(option);
  };

  const getOptionKey = (option: T, index: number): string => {
    if (typeof option === 'object' && option !== null) {
      const obj = option as any;
      if (obj.id !== undefined) return String(obj.id);
      if (obj.value !== undefined) return String(obj.value);
    }
    return `option-${index}`;
  };

  return (
    <div 
      className={`dropdown-container ${className}`}
      ref={dropdownRef}
    >
      <div
        className={`dropdown-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={disabled ? undefined : toggle}
        onKeyDown={disabled ? undefined : handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={name}
      >
        <span className="dropdown-value">{getDisplayValue()}</span>
        <span className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-search">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="dropdown-search-input"
              role="combobox"
              aria-expanded={isOpen}
              aria-activedescendant={highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined}
              aria-autocomplete="list"
            />
          </div>

          <div className="dropdown-options" role="listbox">
            {loading ? (
              <div className="dropdown-option loading">Завантаження...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="dropdown-option no-results">
                {searchTerm ? 'Немає результатів' : 'Немає опцій'}
              </div>
            ) : (
              filteredOptions.map((option: T, index: number) => {
                const isSelected = value === option;
                const isHighlighted = index === highlightedIndex;
                
                return (
                  <div
                    key={getOptionKey(option, index)}
                    ref={el => {
                      optionRefs.current[index] = el
                    }}
                    id={`option-${index}`}
                    className={`dropdown-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                    onClick={() => handleSelect(option, index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {getOptionDisplay(option)}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}