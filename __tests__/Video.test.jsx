import { render } from "@testing-library/react";
import VideoPage from "../src/app/page";

describe("Video Page", () => {
    it("should render video page", () => {
        render(<VideoPage />)
    })
})