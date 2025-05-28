import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:8000/generate-talking-avatar/", formData, {
        responseType: "blob",
      });

      console.log("Response status:", response.status);
      if (response.status !== 200) {
        console.error("Error generating video:", response.status, response.statusText);
        setError(
          "Failed to generate video. Your AI assistant could not identify any face in the uploaded image. Please try again."
        );
        setMsg(null);
      } else {
        setError(null);
        setMsg("Your animated avatar is created!");
        const videoBlob = new Blob([response.data], { type: "video/mp4" });
        setVideoUrl(URL.createObjectURL(videoBlob));
      }
    } catch (err) {
      console.error("Error during API request:", err);
      setError(
        "Failed to generate video. Your AI assistant could not identify any face in the uploaded image. Please try again."
      );
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setText("");
    setFile(null);
    setVideoUrl(null);
    setImagePreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
    }
    setVideoUrl(null);
    setError(null);
    setMsg(null);
  };

  return (
    <div style={{ padding: 10 }}>
      <h1>🤗 Talking Avatar Generator 🤗</h1>
      <p className="mt-1 text-sm/6 text-blue-600">Share a picture and input a paragraph. AI will make it animated.</p>
      <br />

      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="w-full flex">
            {/* Image Upload & Preview */}
            <div className="w-1/2 mt-2 flex justify-center rounded-lg  border-gray-900/25 px-6 py-10">
              <div className="text-center">
                {imagePreviewUrl ? (
                  <img src={imagePreviewUrl} alt="Preview" className="mx-auto h-60 rounded shadow-md mb-4" />
                ) : (
                  <svg
                    className="mx-auto size-12 text-blue-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 1MB</p>
              </div>
            </div>

            {/* Video Result */}
            <div className="w-1/2 mt-2 flex justify-center rounded-lg border-gray-900/25 px-6 py-10">
              {videoUrl ? (
                <div>
                  <h2 className="mb-2 font-medium text-sm">Generated Video</h2>
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="h-64 max-w-lg rounded-lg shadow-lg border border-gray-300"
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-100 border border-dashed border-gray-400 rounded-lg w-full">
                  <span className="text-gray-500 text-sm">Generated Video is shown here.</span>
                </div>
              )}
            </div>
          </div>
          {/* Text Area */}
          <div className="w-full flex">
            <textarea
              name="about"
              id="about"
              rows="3"
              className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
              placeholder="Write a few sentences..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            ></textarea>
          </div>
          {error && (
            <div
              class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <span class="font-medium">{error}</span>
            </div>
          )}
          {msg && (
            <div
              class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              <span class="font-medium">You animated avatar is created!</span>
            </div>
          )}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="!bg-orange-200 text-gray-700 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="!bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
