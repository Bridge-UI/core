// ** Local Imports
import { useStepper } from "@/Components/Stepper/hooks/useStepper";
import type { StepperProps } from "@/Components/Stepper/stepper.types";
import { StepperContext } from "@/Components/Stepper/StepperContext";

const stepperLibDefaults = {
  size: "md",
  linear: true,
  color: "primary",
  orientation: "horizontal",
} as const;

function Stepper(props: StepperProps) {
  const { children, listBind, rootBind, contextValue } = useStepper(
    props,
    stepperLibDefaults,
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <nav {...rootBind}>
        <ol {...listBind}>{children}</ol>
      </nav>
    </StepperContext.Provider>
  );
}

export default Stepper;
