import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect, useLayoutEffect } from "react";

enum ChartTypes {
    Pie,
    XY,
}

interface PollData {
    question: string;
    answers: Array<{ answer: string; count: number }>;
}

interface ChartsProps {}

const Charts: React.FC<ChartsProps> = () => {
    const [polls, setPolls] = useState<Array<PollData>>([]);
    const [chartType, setChartType] = useState<ChartTypes>(ChartTypes.Pie);

    const getPolls = async (): Promise<Array<PollData>> => {
        const res = await axios.get(
            `http://localhost:${process.env.REACT_APP_SERVER_PORT}/results`
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

        return () => {
            setPolls([]);
        };
    }, [chartType]);

    useEffect(() => {
        let root = am5.Root.new("graphs");
        root.setThemes([am5themes_Animated.new(root)]);
        var chartContainer = root.container.children.push(
            am5.Container.new(root, {
                layout: root.verticalLayout,
                width: am5.percent(100),
                height: am5.percent(100),
                x: chartType === ChartTypes.Pie ? 0 : am5.percent(25),
                verticalScrollbar: am5.Scrollbar.new(root, {
                    orientation: "vertical",
                }),
            })
        );

        polls.map((poll: PollData) => {
            chartType === ChartTypes.Pie
                ? addPieChart(root, chartContainer, poll)
                : addXYChart(root, chartContainer, poll);
        });
        return () => {
            root.dispose();
        };
    }, [polls]);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newChartType: ChartTypes
    ) => {
        setChartType(newChartType);
    };

    return (
        <React.Fragment>
            <ToggleButtonGroup
                color="primary"
                value={chartType}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton value={ChartTypes.Pie}>Pie Charts</ToggleButton>
                <ToggleButton value={ChartTypes.XY}>Bar Charts</ToggleButton>
            </ToggleButtonGroup>

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

export default Charts;
