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
      <List dense padding="none">
        <ListItem interactive role="menuitem" primary="Item one" />
      </List>
    </Menu>,
  );

  cy.get('[role="menu"]').should("be.visible");
  cy.get('[role="menuitem"]').should("be.visible");
  cy.contains("Item one").should("be.visible");
});
