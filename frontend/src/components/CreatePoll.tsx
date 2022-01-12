import { LoadingButton } from "@mui/lab";
import { Box, Grid, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";
import FeedbackAlert, { AlertProps } from "./FeedbackAlert";
import axios, { AxiosResponse } from "axios";
import Filters, { FilterData, Poll } from "./Filters";

interface CreatePollState {
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    loading: boolean;
    alert: AlertProps;
}

const CreatePoll = () => {
    const [pollState, setPollState] = useState<CreatePollState>({
        question: "",
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
        loading: false,
        alert: { ok: true, msg: "" },
    });
    const [activeFilters, setActiveFilters] = useState<Array<FilterData>>([]);

    const handleChange =
        (prop: keyof CreatePollState) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setPollState({ ...pollState, [prop]: event.target.value });
        };

    const handleSubmit = async (): Promise<void> => {
        setPollState({
            ...pollState,
            loading: true,
        });
        if (!pollState.question) {
            setPollState({
                ...pollState,
                loading: false,
                alert: { ok: false, msg: "A poll must have a question" },
            });
            return;
        }
        var answers: Array<string> = [
            pollState.answer1,
            pollState.answer2,
            pollState.answer3,
            pollState.answer4,
        ];
        answers = answers.filter(answer => answer);
        if (answers.length < 2) {
            setPollState({
                ...pollState,
                loading: false,
                alert: {
                    ok: false,
                    msg: "A poll must have at least 2 answers",
                },
            });
            return;
        }
        const filters = activeFilters.map((filter: FilterData) => ({
            [filter.poll_id]: filter.answerIndex,
        }));
        try {
            const res = await axios.post(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/polls`,
                {
                    question: pollState.question,
                    answers: answers,
                    poll_filters: filters,
                }
            );
            setPollState({
                ...pollState,
                question: "",
                answer1: "",
                answer2: "",
                answer3: "",
                answer4: "",
                loading: false,
                alert: {
                    ok: true,
                    msg: res.data,
                },
            });
            setActiveFilters([]);
        } catch (error: AxiosResponse<any, any> | any) {
            setPollState({
                ...pollState,
                loading: false,
                alert: {
                    ok: false,
                    msg: error.response.data,
                },
            });
        }
    };

    const handleAddFilter = (poll: Poll, answerIndex: string): void => {
        const newFilter: FilterData = {
            poll_id: poll.poll_id,
            question: poll.question,
            answerIndex: answerIndex,
            answer: poll.answers[parseInt(answerIndex)],
        };
        var filters = [...activeFilters];
        filters.push(newFilter);
        setActiveFilters(filters);
    };

    const handleRemoveFilter = (index: number): void => {
        const filters = activeFilters.filter(
            (f: FilterData, i: number) => i !== index
        );
        setActiveFilters(filters);
    };

    return (
        <Grid
            container
            component="form"
            sx={{
                "& .MuiTextField-root": {
                    m: 1,
                },
            }}
            autoComplete="off"
        >
            <Box sx={{ width: "100%" }}>
                <FeedbackAlert
                    alert={pollState.alert}
                    onClose={() => {
                        setPollState({
                            ...pollState,
                            alert: { ...pollState.alert, msg: "" },
                        });
                    }}
                ></FeedbackAlert>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    ml: 5,
                    mr: 5,
                    mt: 2,
                }}
            >
                <TextField
                    sx={{ width: "45ch" }}
                    id="outlined-required"
                    label="Question"
                    value={pollState.question}
                    onChange={handleChange("question")}
                />
                <TextField
                    sx={{ width: "25ch" }}
                    id="outlined-required"
                    label="Answer 1"
                    value={pollState.answer1}
                    onChange={handleChange("answer1")}
                />
                <TextField
                    sx={{ width: "25ch" }}
                    id="outlined-required"
                    label="Answer 2"
                    value={pollState.answer2}
                    onChange={handleChange("answer2")}
                />
                <TextField
                    sx={{ width: "25ch" }}
                    id="outlined-required"
                    label="Answer 3"
                    value={pollState.answer3}
                    onChange={handleChange("answer3")}
                />
                <TextField
                    sx={{ width: "25ch" }}
                    id="outlined-required"
                    label="Answer 4"
                    value={pollState.answer4}
                    onChange={handleChange("answer4")}
                />
                <LoadingButton
                    onClick={handleSubmit}
                    endIcon={<SendIcon />}
                    loading={pollState.loading}
                    loadingPosition="end"
                    variant="contained"
                    sx={{ width: "15ch", m: 1 }}
                >
                    Submit
                </LoadingButton>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Filters
                    filters={activeFilters}
                    onAddFilter={handleAddFilter}
                    onRemoveFilter={handleRemoveFilter}
                ></Filters>
            </Box>
        </Grid>
    );
};

export default CreatePoll;
