import { Box, Button, Input } from "@mui/material";
import { useCv } from "@/hooks/useCv";

const ExportCv = () => {
    const cv = useCv()
  const handleDownload = () => {
    // 1. Your JSON object
    const dataToDownload ={
        summary: cv.summary,
        workExperience: cv.workExperience,
        education:cv.education,
        personalDetails:cv.personalDetails,
        order: cv.order,
        skills: cv.skills
    }
    // 2. Convert JSON object to a string
    const jsonString = JSON.stringify(dataToDownload, null, 2);

    // 3. Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });

    // 4. Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // 5. Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = "cvContent.json"; // File name

    // 6. Trigger the download
    link.click();
    // 7. Clean up the URL object
    URL.revokeObjectURL(url);
  };
 const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result;
    if (!result || typeof result !== "string") {
      alert("File is empty or invalid!");
      return;
    }

    try {
      const newState = JSON.parse(result);
      cv.setState(newState);
      alert("State successfully updated!");
    } catch (err) {
      alert("Invalid JSON file!");
      console.error(err);
    }
  };
  reader.readAsText(file);
};

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button variant="contained" onClick={handleDownload}>
        Download Zustand State
      </Button>

      <Input
        type="file"
        inputProps={{ accept: "application/json" }}
        onChange={handleUpload}
      />
    </Box>
  );
};

export default ExportCv;