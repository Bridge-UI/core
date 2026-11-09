// ** External Imports
import { useState } from "react";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Popover } from "@/Components/Popover";
import { TextField } from "@/Components/TextField";

function ControlledPopover({ arrow = false }: { arrow?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 80 }}>
      <Popover
        show={open}
        arrow={arrow}
        title="Edit name"
        onShowChange={setOpen}
        classes={{ arrow: "popover-arrow" }}
        slots={{ trigger: <Button>Open</Button> }}
      >
        <TextField label="Name" />
      </Popover>

      <button type="button">After</button>
    </div>
  );
}

test("it should not render the content when show is false", () => {
  cy.mount(
    <Popover show={false} slots={{ trigger: <Button>Open</Button> }}>
      Popover body
    </Popover>,
  );

  cy.get('[role="dialog"]').should("not.exist");
});

test("it should open on click and focus the first field", () => {
  cy.mount(<ControlledPopover />);

  cy.contains("button", "Open").click();

  cy.get('[role="dialog"]').should("be.visible");
  cy.focused().should("match", "input");
});

test("it should keep Home and End inside the text field", () => {
  cy.mount(<ControlledPopover />);

  cy.contains("button", "Open").click();

  cy.focused().type("Bridge{home}X");
  cy.focused().should("have.value", "XBridge");
});

test("it should close on Escape and return focus to the trigger", () => {
  cy.mount(<ControlledPopover />);

  cy.contains("button", "Open").click();
  cy.get('[role="dialog"]').should("be.visible");

  cy.focused().type("{esc}");

  cy.get('[role="dialog"]').should("not.exist");
  cy.focused().should("have.attr", "aria-haspopup", "dialog");
});

test("it should close on click outside", () => {
  cy.mount(<ControlledPopover />);

  cy.contains("button", "Open").click();
  cy.get('[role="dialog"]').should("be.visible");

  cy.contains("button", "After").click();

  cy.get('[role="dialog"]').should("not.exist");
});

test("it should render a positioned arrow", () => {
  cy.mount(<ControlledPopover arrow />);

  cy.contains("button", "Open").click();

  cy.get('[role="dialog"] .popover-arrow')
    .should("exist")
    .and("have.attr", "style")
    .and("match", /top|left/);
});
