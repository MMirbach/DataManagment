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
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useLayoutEffect, useRef, useState } from "react";
import axios from "axios";

export interface Poll {
    poll_id: string;
    question: string;
    answers: Array<string>;
}

export interface FilterData {
    poll_id: string;
    question: string;
    answerIndex: string;
    answer: string;
}

interface FiltersProps {
    filters: Array<FilterData>;
    onAddFilter: (poll: Poll, answerIndex: string) => void;
    onRemoveFilter: (index: number) => void;
    on401: () => void;
}

const Filters: React.FC<FiltersProps> = ({
    filters,
    onAddFilter,
    onRemoveFilter,
    on401,
}) => {
    const [selectedPoll, setSelectedPoll] = useState<Poll>({
        poll_id: "",
        question: "",
        answers: [],
    });
    const [polls, setPolls] = useState<Array<Poll>>([]);

    const getPolls = async (): Promise<Array<Poll>> => {
        try {
            const res = await axios.get(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/polls`
            );
            return res.data;
        } catch (error: any) {
            if (error.response.status === 401) on401();
            return [];
        }
    };

    useLayoutEffect(() => {
        getPolls().then(res => setPolls(res));
        return () => {
            setPolls([]);
        };
    }, []);

    const handleChangeQuestion = (event: SelectChangeEvent) => {
        setSelectedPoll(
            polls.filter((poll: Poll) => poll.poll_id === event.target.value)[0]
        );
    };

    const handleChangeAnswer = (event: SelectChangeEvent) => {
        console.log(event);
        console.log(event.target);
        onAddFilter(selectedPoll, event.target.value);
        setSelectedPoll({ poll_id: "", question: "", answers: [] });
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
                    <InputLabel id="question-label">Question</InputLabel>
                    <Select
                        labelId="question-label"
                        id="question-helper"
                        value={selectedPoll.poll_id}
                        label="Question"
                        onChange={handleChangeQuestion}
                    >
                        {polls.map((poll: Poll) => (
                            <MenuItem key={poll.poll_id} value={poll.poll_id}>
                                {poll.question}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="answer-label">Answer</InputLabel>
                    <Select
                        labelId="answer-label"
                        id="answer-label"
                        value={""}
                        label="Answer"
                        readOnly={selectedPoll.poll_id === ""}
                        onChange={handleChangeAnswer}
                    >
                        {selectedPoll.answers.map(
                            (answer: string, index: number) => (
                                <MenuItem key={index} value={index}>
                                    {answer}
                                </MenuItem>
                            )
                        )}
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
                                            <IconButton
                                                edge="start"
                                                onClick={() =>
                                                    onRemoveFilter(index)
                                                }
                                            >
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
