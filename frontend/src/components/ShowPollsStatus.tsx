import { LoadingButton } from "@mui/lab";
import {
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Button,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface PollStatus {
    poll_id: number;
    question: string;
    num_answered: number;
    num_pending: number;
    recipients: number;
    active: boolean;
}

interface ShowPollsStatusProps {
    on401: () => void;
}

const ShowPollsStatus: React.FC<ShowPollsStatusProps> = ({ on401 }) => {
    const [pollsStatus, setPollsStatus] = useState<Array<PollStatus>>([]);
    const [closingPollId, setClosingPollId] = useState<number>(-1);

    const getPollsStatus = async (): Promise<Array<PollStatus>> => {
        try {
            const res = await axios.get(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/polls/status`,
                {
                    headers: {
                        Authorization: `Basic ${localStorage.getItem("user")}`,
                    },
                }
            );
            return res.data;
        } catch (error: any) {
            if (error.response.status === 401) on401();
            return [];
        }
    };

    const closePoll = async (
        question: string,
        poll_id: number
    ): Promise<void> => {
        setClosingPollId(poll_id);
        try {
            await axios.put(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/polls`,
                { question: question, poll_id: poll_id },
                {
                    headers: {
                        Authorization: `Basic ${localStorage.getItem("user")}`,
                    },
                }
            );
            var polls = [...pollsStatus];
            const index = polls.indexOf(
                polls.filter((poll: PollStatus) => poll.poll_id === poll_id)[0]
            );
            polls[index].active = false;
            polls[index].num_pending = 0;
            setPollsStatus(polls);
        } catch (error: any) {
            if (error.response.status === 401) on401();
        } finally {
            setClosingPollId(-1);
        }
    };

    useEffect(() => {
        getPollsStatus().then(res => setPollsStatus(res));

        return () => setPollsStatus([]);
    }, []);

    const handleClosePoll = (question: string, poll_id: number): void => {
        closePoll(question, poll_id).then(res => {});
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "20px" }}></TableCell>
                        <TableCell variant="head">Question</TableCell>
                        <TableCell variant="head">Answered</TableCell>
                        <TableCell variant="head">Answers Pending</TableCell>
                        <TableCell variant="head">
                            Terminated Interactions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pollsStatus.map(
                        (pollStatus: PollStatus, index: number) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <LoadingButton
                                        onClick={() =>
                                            handleClosePoll(
                                                pollStatus.question,
                                                pollStatus.poll_id
                                            )
                                        }
                                        loading={
                                            closingPollId === pollStatus.poll_id
                                        }
                                        disabled={!pollStatus.active}
                                        variant="contained"
                                    >
                                        {pollStatus.active
                                            ? "Close Poll"
                                            : "Closed"}
                                    </LoadingButton>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {pollStatus.question}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {pollStatus.num_answered} |{" "}
                                    {(100 * pollStatus.num_answered) /
                                        pollStatus.recipients}
                                    %
                                </TableCell>
                                <TableCell>
                                    {pollStatus.num_pending} |{" "}
                                    {(100 * pollStatus.num_pending) /
                                        pollStatus.recipients}
                                    %
                                </TableCell>
                                <TableCell>
                                    {pollStatus.recipients -
                                        pollStatus.num_answered -
                                        pollStatus.num_pending}{" "}
                                    |{" "}
                                    {(100 *
                                        (pollStatus.recipients -
                                            pollStatus.num_answered -
                                            pollStatus.num_pending)) /
                                        pollStatus.recipients}
                                    %
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ShowPollsStatus;
