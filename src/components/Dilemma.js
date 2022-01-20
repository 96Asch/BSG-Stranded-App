import React, {useEffect, useState} from 'react'
import Graph from './Graph';
import {Flex} from './../Flex';

export default function Dilemma({dilemmaData}) {

    const [taskData, setTaskData] = useState([]); 

    useEffect(() => {
        const tasks = [];
        dilemmaData.content.forEach(data => {
            const taskIndex = tasks.findIndex(element => element.name === data.task);
            console.log(data);
            if (taskIndex < 0)
            {
                tasks.push({
                    name : data.task,
                    ideal : data.ideal,
                    content : [data]
                });
            }
            else
            {
                tasks[taskIndex].content.push(data);
            }
        });

        setTaskData(tasks)
    }, [dilemmaData])

    return (
        <Flex >
            <h2>Chapter: {dilemmaData.name}</h2>
            <Flex container flexDirection="row" margin="5px" flexWrap="wrap">
                {taskData.map((data, index)=> 
                    <Graph key={index} taskData={data} />
                )}
            </Flex>
            <hr/>

        </Flex>
    )
}
