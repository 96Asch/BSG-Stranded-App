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
                console.log(event.message);
                switch (event.message.flag) {
                    case "START_GAME":
                    case "INIT_CHANNEL":
                        break;
                    case "SEND_GAME_DATA":

                        event.message.data.forEach((d) => {

                            const data = {
                                dilemma : d.dilemma,
                                task : d.task,
                                character : d.character,
                                ideal : d.ideal
                            }
                            dataDispatch({type : "add", data : data});
                        });
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
    }, [strandedData])

    return (
        <div className="panel" id="main-dashboard">
            <h3>Welkom op de Stranded Web App pagina!</h3>
            <li>
                <ul>Klik op 'Start een nieuw Spel' om een lobby aan te maken.</ul>
                <ul>Voer de gegeven pin code in, in het Stranded spel en klik op 'Gereed'.</ul>
                <ul>Wacht totdat elke speler het bericht krijgt om te wachten totdat het spel start en klik op 'Begin Spel' om het spel te starten.</ul>
                <ul>Na elke ronde verschijnen er grafieken met de beslissingen van elke speler voor elk probleem.</ul>
                <ul>Deze grafieken geven aan hoeveel keer een personage is gekozen.</ul>
                <ul>De meest ideale keuze voor een probleem wordt in groen ge-highlight.</ul>
                <ul>Als laatstse, klik op weer op 'Start een nieuw Spel' om het bord leeg te halen en een nieuw spel te spelen.</ul>
                <ul>Veel plezier!.</ul>
            </li>
            <hr/>
            {strandedData.map((data, index) => 
                <Dilemma key={index} dilemmaData={data}  /> 
                )}
        </div>
    )
}
