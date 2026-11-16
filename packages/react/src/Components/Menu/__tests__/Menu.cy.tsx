// ** External Imports
import { useState } from "react";

// ** Local Imports
import { Button } from "@/Components/Button";
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";
import { Menu } from "@/Components/Menu";

test("it should not render menu when show is false", () => {
  cy.mount(
    <Menu show={false} slots={{ trigger: <Button>Open</Button> }}>
      Menu body
    </Menu>,
  );

  cy.get('[role="menu"]').should("not.exist");
});

test("it should render menu when show is true", () => {
  cy.mount(
    <Menu show slots={{ trigger: <Button>Open</Button> }}>
      Menu body
    </Menu>,
  );

  cy.get('[role="menu"]').should("be.visible");
  cy.contains("Menu body").should("be.visible");
});

test("it should call onShowChange when the trigger is clicked", () => {
  cy.mount(
    <Menu
      show={false}
      slots={{ trigger: <Button>Open</Button> }}
      onShowChange={cy.stub().as("onShowChange")}
    >
      Menu body
    </Menu>,
  );

  cy.get('[aria-haspopup="menu"]').click();

  cy.get("@onShowChange").should("have.been.calledWith", true);
});

test("it should call onShowChange when the trigger is clicked again", () => {
  cy.mount(
    <Menu
      show
      slots={{ trigger: <Button>Open</Button> }}
      onShowChange={cy.stub().as("onShowChange")}
    >
      Menu body
    </Menu>,
  );

  cy.get('[aria-haspopup="menu"]').click();

  cy.get("@onShowChange").should("have.been.calledWith", false);
});

test("it should render List and ListItem inside the menu panel", () => {
  cy.mount(
    <Menu show slots={{ trigger: <Button>Open</Button> }}>
      <List dense>
        <ListItem interactive role="menuitem" primary="Item one" />
      </List>
    </Menu>,
  );

  cy.get('[role="menu"]').should("be.visible");
  cy.get('[role="menuitem"]').should("be.visible");
  cy.contains("Item one").should("be.visible");
});

function TwoMenus() {
  const [open, setOpen] = useState<"a" | "b" | null>("a");

  return (
    <div className="flex gap-2">
      {(["a", "b"] as const).map((name) => (
        <Menu
          key={name}
          show={open === name}
          slots={{ trigger: <Button>{name.toUpperCase()}</Button> }}
          onShowChange={(show) => {
            setOpen((current) =>
              show ? name : current === name ? null : current,
            );
          }}
        >
          {`Menu ${name.toUpperCase()}`}
        </Menu>
      ))}
    </div>
  );
}

test("it should switch to another menu in one click", () => {
  cy.mount(<TwoMenus />);

  cy.contains("Menu A").should("be.visible");
  cy.contains("button", "B").click();
  cy.contains("Menu B").should("be.visible");
  cy.contains("Menu A").should("not.exist");
});
