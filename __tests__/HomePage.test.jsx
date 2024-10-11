import HomePage from "../src/app/page";
import { render } from "@testing-library/react";

describe("HomePage", () => {
    it("should render the home page", () => {
        render(<HomePage />);
    })
})