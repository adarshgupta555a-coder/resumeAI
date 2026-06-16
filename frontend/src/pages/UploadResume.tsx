import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const { user } = useUser();
  const userId = user?.id;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log("object")
    if (!file || !userId) return;

    const formData = new FormData();

    formData.append(
      "document", // backend: upload.single("document")
      file
    );
    console.log(userId)

    formData.append("client_id", userId)

    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/resume",
        formData
      );

      console.log(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
    className="w-2/4 p-20 bg-orange-100 rounded-2xl flex flex-col gap-10 justify-center items-center"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <input
        className="bg-orange-300 rounded"
        type="file"
        accept=".pdf"
        required
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button type="submit" className="w-30 rounded text-white text-2xl font-bold h-10 bg-black">
        Submit
      </button>
    </form>
  );
};

export default UploadForm;