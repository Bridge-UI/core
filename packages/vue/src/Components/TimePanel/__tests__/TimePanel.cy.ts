// ** External Imports
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { TimePanel } from "@/Components/TimePanel";

const TimePanelHarness = defineComponent({
  setup() {
    const value = ref(new Date(2021, 4, 21, 14, 30));

    return () => {
      return h(TimePanel, {
        value: value.value,
        onChange: (next: Date | null) => {
          if (next) {
            value.value = next;
          }
        },
      });
    };
  },
});

test("it should render time columns", () => {
  cy.mount(TimePanel, { props: { value: new Date(2021, 4, 21, 14, 30) } });

  cy.get("button").should("have.length.greaterThan", 24);
});

test("it should highlight the selected hour", () => {
  cy.mount(TimePanel, { props: { value: new Date(2021, 4, 21, 14, 30) } });

  cy.get('button[aria-label="Hour 14"]').should(
    "have.attr",
    "aria-pressed",
    "true",
  );
});

test("it should scroll a column and select a time", () => {
  cy.mount(TimePanelHarness);

  cy.get('button[aria-label="Hour 23"]').click();
  cy.get('button[aria-label="Hour 23"]').should(
    "have.attr",
    "aria-pressed",
    "true",
  );
});
