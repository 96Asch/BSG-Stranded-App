import React, {useEffect, useState} from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip } from 'recharts';
import {Flex} from './../Flex';


export default function Graph({taskData}) {
    const [charData, setCharData] = useState([]); 
    const [chartTitle, setChartTitle] = useState("");
    
    useEffect(() => {
        const characters = [];
        taskData.content.forEach(data => {
            const charIndex = characters.findIndex(element => element.name === data.character);

            if (charIndex < 0)
            {
                characters.push({
                    name : data.character,
                    count : 1,
                    color : data.color,
                    ratio : 1
                });
            }
            else
            {
                characters[charIndex].count += 1;
            }

        });
        setCharData(characters);
        setChartTitle(taskData.name);
    }, [taskData, setChartTitle]);

    const CustomizedLabelB = ({ kapi, metric, viewBox }) => {
        return (
            <text
                x={0}
                y={0}
                dx={-200}
                dy={40}
                textAnchor="start"
                width={180}
                transform="rotate(-90)"
                // If I uncomment the next line, then the rotation stops working.
                // scaleToFit={true}
            >            
                Number of times picked
            </text>
        );
    };
    return (
        <Flex container flexDirection="column">
        <h3>{chartTitle}</h3>
        <BarChart 
            data={charData}  
            height={300} 
            width={400} 
            margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis allowDecimals={false} label={<CustomizedLabelB/>} />
            <Tooltip/>
            <Bar dataKey="count">
            {
                charData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))
            }
            </Bar>
        </BarChart>
        </Flex>
    )
}
