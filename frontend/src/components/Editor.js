import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import { TextField } from "@mui/material";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another

export default function CodeEditor({ code, setCode }) {
  return (
    <TextField
      label="Paste HTML Code"
      multiline
      rows={6}
      value={code}
      onChange={setCode}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
  );
}
