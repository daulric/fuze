"use client"
import VideoEditPage from "./EditVideo";

export default function EditVideo() {

    function onSave() {
        console.log("saving!")
    }

    function onClose() {
        window.location.href = "/dashboard";
    }

    const video = {
        title: "renvjkne",
        description: "kcernviqei",
        visibility: "public",
        tags: ["tag1", "tag2"],
        thumbnail: "https://example.com/thumbnail.jpg",
        allowComments: true,
        allowRatings: true,
    }



    return (<>
        <VideoEditPage video={video} onClose={onClose} onSave={onSave} />
    </>)
}