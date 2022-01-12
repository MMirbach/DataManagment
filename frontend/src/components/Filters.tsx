import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";

interface FilterData {
    pollId: number;
    question: string;
    answerIndex: number;
    answer: string;
}

interface FiltersProps {
    filters: Array<FilterData>;
}

const Filters: React.FC<FiltersProps> = ({ filters }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setQuestion(event.target.value);
    };

    const handleChange2 = (event: SelectChangeEvent) => {
        setAnswer(event.target.value);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <Typography variant="h5">Filter Recipients:</Typography>
            <Box>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                        Question
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={question}
                        label="Question"
                        onChange={handleChange}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-helper-label2">
                        Answer
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label2"
                        id="demo-simple-select-helper2"
                        value={answer}
                        label="Answer"
                        onChange={handleChange2}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Typography variant="h6">Active filters:</Typography>
            <Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell>Answer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filters.map(
                                (filter: FilterData, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <IconButton edge="start">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                {filter.question}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{filter.answer}</TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Filters;
