// ** External Imports
import { useRef, useState } from "react";

// ** Local Imports
import { Listbox } from "@/Components/Listbox";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

function ListboxDemo({ initialOpen = true }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={anchorRef} data-cy="anchor">
        Anchor
      </div>

      <Listbox
        show={open}
        options={options}
        anchorEl={anchorRef}
        onShowChange={setOpen}
        listboxId="cy-listbox"
      />
    </div>
  );
}

test("it should render options when open", () => {
  cy.mount(<ListboxDemo />);

  cy.get('[role="listbox"]').should("exist");
  cy.contains("Apple").should("be.visible");
  cy.contains("Banana").should("be.visible");
});

test("it should select an option on click", () => {
  const onSelect = cy.stub().as("onSelect");

  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          options={options}
          onSelect={onSelect}
          anchorEl={anchorRef}
          listboxId="cy-listbox"
        />
      </div>
    );
  }

  cy.mount(<Host />);

  cy.contains("Banana").click();
  cy.get("@onSelect").should("have.been.calledOnce");
});

test("it should show empty message when there are no options", () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          options={[]}
          anchorEl={anchorRef}
          listboxId="cy-listbox"
        />
      </div>
    );
  }

  cy.mount(<Host />);

  cy.contains("No options").should("be.visible");
});
