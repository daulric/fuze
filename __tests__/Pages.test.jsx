import { render } from "@testing-library/react";

import VideoPage from "../src/app/page";
import HomePage from "../src/app/page";
import ProfilePage from "../src/app/profile/ProfileDisplay";
import SettingsPage from "../src/app/settings/page";
import UploadPage from "../src/app/upload/page";

describe("Rendering All Pages", () => {

    it("should render the home page", () => {
        render(<HomePage />);
    })

    it("should render video page", () => {
        render(<VideoPage />);
    })

    it("should render the profile page", () => {
        render(<ProfilePage username={"testing"} />);
    })

    it("should render the settings page", () => {
        render(<SettingsPage />);
    })

    it("should render the upload page", () => {
        render(<UploadPage />);
    })
})