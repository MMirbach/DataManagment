import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import axios from "axios";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Features, { FeatureTypes } from "./Features";
import Navbar from "./Navbar";

interface PollData {
    question: string;
    answers: Array<{ answer: string; count: number }>;
}

interface MainProps {
    onLogOut: () => void;
}

const Main: React.FC<MainProps> = ({ onLogOut }) => {
    const [feature, setFeature] = useState<FeatureTypes>(FeatureTypes.None);
    const [polls, setPolls] = useState<Array<PollData>>([]);

    const getPolls = async (): Promise<Array<PollData>> => {
        const res = await axios.get(
            `http://localhost:${process.env.REACT_APP_SERVER_PORT}/polls`
        );
        return res.data;
    };

    const addPieChart = (
        root: am5.Root,
        chartContainer: am5.Container,
        poll: PollData
    ): void => {
        let chart = chartContainer.children.push(
            am5percent.PieChart.new(root, {
                radius: 70,
            })
        );
        let numAnswers = poll.answers.reduce((total, answer) => {
            return total + answer.count;
        }, 0);
        chart.children.push(
            am5.Label.new(root, {
                text: poll.question + ` (${numAnswers} answers)`,
                fontSize: 25,
                x: am5.percent(50),
                centerX: am5.percent(50),
            })
        );
        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
                //name: "Series",
                categoryField: "answer",
                valueField: "count",
                alignLabels: true,
            })
        );
        series.ticks.template.set("visible", false);
        series.data.setAll(poll.answers);
    };

    const addXYChart = (
        root: am5.Root,
        chartContainer: am5.Container,
        poll: PollData
    ): void => {
        let chart = chartContainer.children.push(
            am5xy.XYChart.new(root, {
                width: am5.percent(50),
            })
        );
        let numAnswers = poll.answers.reduce((total, answer) => {
            return total + answer.count;
        }, 0);
        chart.children.push(
            am5.Label.new(root, {
                text: poll.question + ` (${numAnswers} answers)`,
                fontSize: 25,
                x: am5.percent(50),
                centerX: am5.percent(50),
            })
        );
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
            })
        );
        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
                categoryField: "answer",
            })
        );
        xAxis.data.setAll(poll.answers);
        let series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "count",
                categoryXField: "answer",
            })
        );
        series.columns.template.setAll({
            width: 50,
        });
        series.data.setAll(poll.answers);
    };

    useLayoutEffect(() => {
        getPolls().then(res => setPolls(res));

        return () => {};
    }, []);

    useEffect(() => {
        let root = am5.Root.new("graphs");
        root.setThemes([am5themes_Animated.new(root)]);
        var chartContainer = root.container.children.push(
            am5.Container.new(root, {
                layout: root.verticalLayout,
                width: am5.percent(100),
                height: am5.percent(100),
                verticalScrollbar: am5.Scrollbar.new(root, {
                    orientation: "vertical",
                }),
            })
        );

        polls.map(poll => {
            addXYChart(root, chartContainer, poll);
        });
        return () => {
            root.dispose();
        };
    }, [polls]);

    const handleShowAdmin = (): void => {
        setFeature(FeatureTypes.ShowAdmins);
    };

    const handleAddingAdmin = (): void => {
        setFeature(FeatureTypes.AddAdmin);
    };

    const handleCreatingPoll = (): void => {
        setFeature(FeatureTypes.CreatePoll);
    };

    const handleClose = (): void => {
        setFeature(FeatureTypes.None);
    };

    return (
        <React.Fragment>
            <Navbar
                onShowAdmins={handleShowAdmin}
                onAddAdmin={handleAddingAdmin}
                onCreatePoll={handleCreatingPoll}
                onLogOut={onLogOut}
            ></Navbar>
            <Features type={feature} onClose={handleClose}></Features>
            <div
                id="graphs"
                style={{
                    width: "100%",
                    height: (polls.length * 45).toString() + "vh",
                }}
            ></div>
        </React.Fragment>
    );
};

export default Main;
