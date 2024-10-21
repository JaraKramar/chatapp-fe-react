import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

const LoadingDots = () => {
  const theme = useTheme();
  return (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.dark,
          animation: "dot 1.5s infinite ease-in-out",
          margin: "0 4px",
        }}
      />
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.dark,
          animation: "dot 1.5s infinite ease-in-out 0.3s",
          margin: "0 4px",
        }}
      />
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.dark,
          animation: "dot 1.5s infinite ease-in-out 0.6s",
          margin: "0 4px",
        }}
      />
      <style>
        {`
                    @keyframes dot {
                        0%, 20%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.5);
                        }
                    }
                `}
      </style>
    </Box>
  );
};

const TextMsgUser = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={"end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
          maxWidth: "100%", // Prevents the Box from exceeding the screen width
        }}
      >
        <Typography
          variant="body2"
          color={"#fff"}
          sx={{
            wordBreak: "break-word", // Breaks long words into multiple lines
            overflowWrap: "break-word", // Ensures proper wrapping in older browsers
            whiteSpace: "pre-wrap",
          }}
        >
          {el.content}
        </Typography>
      </Box>
      {menu}
    </Stack>
  );
};

const TextMsgAssistant = ({ el, references, menu }) => {
  const theme = useTheme();
  // Function to format the documents as a table-like structure
  const formatTable = (reference) => {
    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {reference.map((doc, index) => (
            <tr key={index}>
              <td
                style={{
                  borderBottom: "1px solid #ccc",
                  paddingRight: "2px",
                  padding: "0px",
                }}
              >
                {index + 1}.
              </td>
              <td style={{ borderBottom: "1px solid #ccc", padding: "4px" }}>
                {doc.document_name}
                <br />
                <span style={{ paddingLeft: "0px" }}>{doc.document_path}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  return (
    <Stack direction="row" justifyContent="start">
      <Box
        p={1.5}
        sx={{
          backgroundColor: theme.palette.primary.dark,
          borderRadius: 1.5,
          width: "max-content",
          maxWidth: "100%", // Prevents the Box from exceeding the screen width
        }}
      >
        <Typography
          component={"span"}
          variant="body2"
          color={"#fff"}
          sx={{
            wordBreak: "break-word", // Breaks long words into multiple lines
            overflowWrap: "break-word", // Ensures proper wrapping in older browsers
            whiteSpace: "pre-wrap", // Maintains whitespace and newlines
          }}
        >
          {el.content}

          {references.length >= 1 ? "\n\n\nReference:\n" : ""}
          {/* Replace el.content with formatted table */}
          {formatTable(references)}
        </Typography>
      </Box>
      {menu}
    </Stack>
  );
};

const TimeLine = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {el.text}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

// should not be default export, because we need to export multiple things
export { TimeLine, TextMsgAssistant, TextMsgUser, LoadingDots };
