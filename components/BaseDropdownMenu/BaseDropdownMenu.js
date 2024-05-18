import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import styles from './BaseDropdownMenu.module.css';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import Link from 'next/link';

const BaseDropdownMenu = ({ options, unwantedOption }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [dropdownOptions, setDropdownOptions] = useState([]); // Initialize empty dropdownOptions
  const router = useRouter(); // Get router object

  // Fetch initial selected option and populate dropdownOptions on mount
  useEffect(() => {
    const currentUrl = router.asPath; // Use router.asPath for SSR compatibility
    const urlOption = currentUrl.split('/').pop();

    const filteredOptions = options.filter((option) => option !== unwantedOption);
    setDropdownOptions(filteredOptions); // Set dropdown options

    const matchingOption = filteredOptions.find((option) => option.toLowerCase() === urlOption);

    if (matchingOption) {
      setSelectedOption(matchingOption);
    } else if (filteredOptions.includes(urlOption)) {
      setSelectedOption(urlOption);
    }
  }, [router.asPath]); // Re-run on URL changes

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className={styles.dropdownTrigger} variant="bordered">{selectedOption}</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Options">
        {dropdownOptions.map((option, index) => (
          <DropdownItem
            className={styles.dropdownItem}
            key={index}
            onClick={() => handleOptionChange(option)}
          >
            {['All', 'NBA', 'NHL', 'MLB'].includes(option) ? (
              <Link href={`/leagues/${option.toLowerCase()}`} className={styles.dropdownLink}>{option}</Link>
            ) : (
              option
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default BaseDropdownMenu;
