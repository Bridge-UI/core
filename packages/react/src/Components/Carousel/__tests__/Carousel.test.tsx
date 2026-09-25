// ** External Imports
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide } from "@/Components/CarouselSlide";

afterEach(() => {
  cleanup();
});

function slideOf(name: string) {
  return screen.getByText(name).closest("[data-part='slide']");
}

function Photos({
  index,
  autoPlay,
  indicators,
  loop = false,
  onIndexChange,
}: {
  autoPlay?: number | boolean;
  index?: number;
  indicators?: boolean;
  loop?: boolean;
  onIndexChange?: (index: number) => void;
}) {
  return (
    <Carousel
      loop={loop}
      index={index}
      autoPlay={autoPlay}
      aria-label="Photos"
      indicators={indicators}
      onIndexChange={onIndexChange}
    >
      <CarouselSlide>One</CarouselSlide>
      <CarouselSlide>Two</CarouselSlide>
      <CarouselSlide>Three</CarouselSlide>
    </Carousel>
  );
}

test("it should place previous and next beside the viewport", () => {
  render(<Photos />);

  const viewport = document.querySelector("[data-part='viewport']");
  const controls = document.querySelector("[data-part='controls']");

  expect(viewport?.contains(controls)).toBe(false);
  expect(controls?.className).toContain("items-center");
  expect(controls?.className).not.toContain("flex-col");
  expect(controls?.parentElement?.className).toContain("px-14");
});

test("it should place previous and next above and below a vertical viewport", () => {
  render(
    <Carousel aria-label="Photos" orientation="vertical">
      <CarouselSlide>One</CarouselSlide>
      <CarouselSlide>Two</CarouselSlide>
    </Carousel>,
  );

  const controls = document.querySelector("[data-part='controls']");

  expect(controls?.className).toContain("flex-col");
  expect(controls?.parentElement?.className).toContain("py-14");
});

test("it should show the first slide and disable previous", () => {
  render(<Photos />);

  expect(slideOf("One")?.getAttribute("aria-hidden")).toBeNull();
  expect(slideOf("Two")?.getAttribute("aria-hidden")).toBe("true");
  expect(slideOf("Two")?.hasAttribute("inert")).toBe(true);
  expect(screen.getByRole("button", { name: "Previous slide" })).toHaveProperty(
    "disabled",
    true,
  );
  expect(
    screen
      .getByRole("region", { name: "Photos" })
      .getAttribute("aria-roledescription"),
  ).toBe("carousel");
  expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(
    3,
  );
});

test("it should move to the next slide", () => {
  const onIndexChange = vi.fn();

  render(<Photos onIndexChange={onIndexChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

  expect(onIndexChange).toHaveBeenCalledWith(1);
  expect(slideOf("Two")?.getAttribute("aria-hidden")).toBeNull();
  expect(slideOf("One")?.getAttribute("aria-hidden")).toBe("true");
});

test("it should move on the first click after focus", () => {
  const onIndexChange = vi.fn();

  render(<Photos onIndexChange={onIndexChange} />);

  const next = screen.getByRole("button", { name: "Next slide" });

  fireEvent.focus(next);

  expect(screen.getByRole("button", { name: "Next slide" })).toBe(next);

  fireEvent.click(next);

  expect(onIndexChange).toHaveBeenCalledWith(1);
  expect(slideOf("Two")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should hide controls when every slide is removed", () => {
  function Harness() {
    const [items, setItems] = useState(["One", "Two"]);

    return (
      <>
        <button type="button" onClick={() => setItems([])}>
          Clear
        </button>
        <Carousel aria-label="Photos">
          {items.map((item) => (
            <CarouselSlide key={item}>{item}</CarouselSlide>
          ))}
        </Carousel>
      </>
    );
  }

  render(<Harness />);

  fireEvent.click(screen.getByRole("button", { name: "Clear" }));

  expect(screen.queryByRole("button", { name: "Next slide" })).toBeNull();
});

test("it should wrap when loop is on", () => {
  render(<Photos loop />);

  fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));

  expect(slideOf("Three")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should stay on the last slide when loop is off", () => {
  render(<Photos />);

  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

  expect(slideOf("Three")?.getAttribute("aria-hidden")).toBeNull();
  expect(screen.getByRole("button", { name: "Next slide" })).toHaveProperty(
    "disabled",
    true,
  );
});

test("it should show one indicator per snap", () => {
  render(
    <Carousel slidesPerView={3} aria-label="Photos">
      <CarouselSlide>One</CarouselSlide>
      <CarouselSlide>Two</CarouselSlide>
      <CarouselSlide>Three</CarouselSlide>
      <CarouselSlide>Four</CarouselSlide>
      <CarouselSlide>Five</CarouselSlide>
    </Carousel>,
  );

  expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(
    3,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go to slide 3" }));

  expect(slideOf("Five")?.getAttribute("aria-hidden")).toBeNull();
  expect(slideOf("One")?.getAttribute("aria-hidden")).toBe("true");
  expect(slideOf("Three")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should hide indicators when every slide fits", () => {
  render(
    <Carousel slidesPerView={3} aria-label="Photos">
      <CarouselSlide>One</CarouselSlide>
      <CarouselSlide>Two</CarouselSlide>
      <CarouselSlide>Three</CarouselSlide>
    </Carousel>,
  );

  expect(screen.queryByRole("button", { name: /Go to slide/ })).toBeNull();
});

test("it should select a slide from an indicator", () => {
  render(<Photos />);

  fireEvent.click(screen.getByRole("button", { name: "Go to slide 3" }));

  expect(slideOf("Three")?.getAttribute("aria-hidden")).toBeNull();
  expect(
    screen
      .getByRole("button", { name: "Go to slide 3" })
      .getAttribute("aria-current"),
  ).toBe("true");
});

test("it should move with the arrow keys", () => {
  render(<Photos />);

  fireEvent.keyDown(screen.getByRole("region", { name: "Photos" }), {
    key: "ArrowRight",
  });

  expect(slideOf("Two")?.getAttribute("aria-hidden")).toBeNull();

  fireEvent.keyDown(screen.getByRole("region", { name: "Photos" }), {
    key: "Home",
  });

  expect(slideOf("One")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should move on a horizontal swipe", () => {
  render(<Photos />);

  const viewport = document.querySelector("[data-part='viewport']");

  fireEvent.pointerDown(viewport!, {
    button: 0,
    clientY: 20,
    clientX: 220,
    pointerId: 1,
    pointerType: "touch",
  });
  fireEvent.pointerUp(viewport!, {
    clientX: 40,
    clientY: 24,
    pointerId: 1,
    pointerType: "touch",
  });

  expect(slideOf("Two")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should ignore a short swipe", () => {
  render(<Photos />);

  const viewport = document.querySelector("[data-part='viewport']");

  fireEvent.pointerDown(viewport!, {
    button: 0,
    clientX: 80,
    clientY: 20,
    pointerId: 1,
    pointerType: "touch",
  });
  fireEvent.pointerUp(viewport!, {
    clientX: 70,
    clientY: 20,
    pointerId: 1,
    pointerType: "touch",
  });

  expect(slideOf("One")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should keep a controlled index until the parent updates", () => {
  const onIndexChange = vi.fn();

  render(<Photos index={0} onIndexChange={onIndexChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

  expect(onIndexChange).toHaveBeenCalledWith(1);
  expect(slideOf("One")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should follow a controlled index", () => {
  function Controlled() {
    const [index, setIndex] = useState(0);

    return <Photos index={index} onIndexChange={setIndex} />;
  }

  render(<Controlled />);

  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

  expect(slideOf("Two")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should hide indicators", () => {
  render(<Photos indicators={false} />);

  expect(screen.queryByRole("button", { name: /Go to slide/ })).toBeNull();
});

test("it should announce a slide change", () => {
  render(<Photos />);

  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

  expect(document.querySelector("[data-part='live']")?.textContent).toBe(
    "Slide 2 of 3",
  );
});

test("it should reveal the next slide and stop when the page is full", () => {
  render(
    <Carousel slidesPerView={2} aria-label="Photos">
      <CarouselSlide>One</CarouselSlide>
      <CarouselSlide>Two</CarouselSlide>
      <CarouselSlide>Three</CarouselSlide>
    </Carousel>,
  );

  expect(slideOf("One")?.getAttribute("aria-hidden")).toBeNull();
  expect(slideOf("Two")?.getAttribute("aria-hidden")).toBeNull();
  expect(slideOf("Three")?.getAttribute("aria-hidden")).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

  expect(slideOf("Three")?.getAttribute("aria-hidden")).toBeNull();
  expect(screen.getByRole("button", { name: "Next slide" })).toHaveProperty(
    "disabled",
    true,
  );
});

test("it should move a vertical carousel with the down arrow", () => {
  render(
    <Carousel aria-label="Photos" orientation="vertical">
      <CarouselSlide>One</CarouselSlide>
      <CarouselSlide>Two</CarouselSlide>
    </Carousel>,
  );

  expect(
    screen
      .getByRole("region", { name: "Photos" })
      .getAttribute("data-orientation"),
  ).toBe("vertical");

  fireEvent.keyDown(screen.getByRole("region", { name: "Photos" }), {
    key: "ArrowDown",
  });

  expect(slideOf("Two")?.getAttribute("aria-hidden")).toBeNull();
});

test("it should auto-advance and pause while hovered", async () => {
  vi.useFakeTimers();

  try {
    const onIndexChange = vi.fn();

    render(<Photos autoPlay={400} onIndexChange={onIndexChange} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(onIndexChange).toHaveBeenCalledWith(1);

    fireEvent.mouseEnter(screen.getByRole("region", { name: "Photos" }));
    onIndexChange.mockClear();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    expect(onIndexChange).not.toHaveBeenCalled();
  } finally {
    vi.useRealTimers();
  }
});
