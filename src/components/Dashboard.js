import { usePubNub} from 'pubnub-react';
import React, {useEffect} from 'react'
import Dilemma from './Dilemma';


const LOCAL_STORAGE_DATA_KEY = 'stranded.data'

export default function Dashboard({strandedData, dataDispatch, channel, setUserCount}) {

    const pubnub = usePubNub();

    useEffect(() => {
        const storedData = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_DATA_KEY));
        if (storedData) dataDispatch({type : "retrieveLocal", data : storedData});
    },[dataDispatch]);

    useEffect(() => {
        const handlePresence = event => {
            pubnub.hereNow(
                {
                    channels: [event.channel],
                    includeUUIDs: false
                }
            ).then((res) => {
                console.log(res);
                const occupancy = Math.max(res.totalOccupancy - 1, 0);
                    setUserCount(occupancy);
            });
        };

        const handleMessage = event => {
            if (event.message.hasOwnProperty("flag")) 
            {
                switch (event.message.flag) {
                    case "START_GAME":
                    case "INIT_CHANNEL":
                        break;
                    case "SEND_GAME_DATA":
                        const data = {
                            dilemma : event.message.dilemma,
                            task : event.message.task,
                            character : event.message.character
                        }
                        dataDispatch({type : "add", data : data});
                        break;
                    default:
                        break;
                }
            }
        };

        pubnub.addListener(
            { 
                message: handleMessage,
                presence : handlePresence 
            });
        // eslint-disable-next-line 
        }, [pubnub]);

    useEffect(() => {
        sessionStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(strandedData));
        console.log(strandedData);
    }, [strandedData])

    return (
        <div className="panel" id="main-dashboard">
            <h3>Welcome to the Stranded Web App!</h3>
            <li>
                <ul>Click on the 'Create Room' button to start a room.</ul>
                <ul>Enter the pin code into the Stranded login screen.</ul>
                <ul>When everyone has entered, then start the game using the 'Start Game' button.</ul>
                <ul>Data will appear after each round in the game.</ul>
                <ul>Click on 'Clear Data' to remove all received data.</ul>
            </li>

            {strandedData.map((data, index) => 
                <Dilemma key={index} dilemmaData={data}  /> 
                )}
        </div>
    )
}
