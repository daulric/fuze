import VideoDisplay from "./VideoDisplay"

// Main Video Component For Displaying Videos
export default function VideoIDDisplay({VideoData}) {
    return (
        <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <VideoDisplay VideoData={VideoData} />
        </div>
    );
}