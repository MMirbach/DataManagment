import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";
import FeedbackAlert, { AlertProps } from "./FeedbackAlert";
import axios, { AxiosResponse } from "axios";

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
        try {
            await axios.post(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/polls`,
                {
                    question: pollState.question,
                    answers: answers,
                    poll_filters: {},
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
                    msg: "Sent poll",
                },
            });
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

    return (
        <Box
            component="form"
            sx={{
                "& .MuiTextField-root": {
                    m: 1,
                    display: "flex",
                    flexDirection: "column",
                },
            }}
            autoComplete="off"
        >
            <FeedbackAlert
                alert={pollState.alert}
                onClose={() => {
                    setPollState({
                        ...pollState,
                        alert: { ...pollState.alert, msg: "" },
                    });
                }}
            ></FeedbackAlert>
            <div>
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
            </div>
        </Box>
    );
};

export default CreatePoll;
