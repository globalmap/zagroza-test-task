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
	const searchInputRef = useRef<HTMLInputElement>(null);

	const { isOpen, toggle, close, dropdownRef } = useDropdown();

	// Фільтр опцій
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
		}
	}, [isOpen]);

	const handleSelect = (option: T) => {
    onChange(option);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'Escape') {
      close();
    }
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
							id="dropdown-search-input"
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="dropdown-search-input"
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
              filteredOptions.map((option: T, index: number) => (
                <div
                  key={getOptionKey(option, index)}
                  className={`dropdown-option ${value === option ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={value === option}
                >
                  {getOptionDisplay(option)}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
	)
}