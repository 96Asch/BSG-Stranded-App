import React, {useEffect, useState} from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip } from 'recharts';


export default function Graph({taskData}) {
    const [charData, setCharData] = useState([]); 
    
    useEffect(() => {
        const characters = [];
        taskData.content.forEach(data => {
            const charIndex = characters.findIndex(element => element.name === data.character);
            console.log(data.color)
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
    }, [taskData]);

    return (
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
            <YAxis/>
            <Tooltip/>
            <Bar dataKey="count" >
            {
                charData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))
            }
            </Bar>
        </BarChart>
    )
}
