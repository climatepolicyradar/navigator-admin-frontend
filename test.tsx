
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Select, ChakraStylesConfig } from 'chakra-react-select'


const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

const flavorOptions = [
  {
    value: "coffee",
    label: "Coffee",
  },
  {
    value: "chocolate",
    label: "Chocolate",
  },
  {
    value: "strawberry",
    label: "Strawberry",
  },
  {
    value: "cherry",
    label: "Cherry",
  },
];

const chakraStyles: ChakraStylesConfig = {
  container: (provided, _state) => ({
    ...provided,
    background: 'lightblue',
  }),
}


root.render(
  <StrictMode>
    <ChakraProvider>
    <Select
        chakraStyles={chakraStyles}
        isClearable={false}
        isMulti={true}
        isSearchable={true}
        options={flavorOptions}

      />
    </ChakraProvider>
  </StrictMode>
);
