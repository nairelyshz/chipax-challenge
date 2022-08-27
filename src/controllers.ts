import { Response , Request} from "express"
import { CharResult, EpisodeResult, Results } from "./types"
import * as services from "./services";
import { time, timeEnd } from "console";
export function test (req: Request,res: Response) {
    res.send('Test Chanllengue online')
}
export async function tasks(req: Request, res: Response) {
       
    let time = performance.now();
    let responseCharCounter: Results = {
        exercise_name :"Char counter",
        time : "0",
        in_time: true,
        results: []
    };
    /** Get all characters */
    console.info("Get all characters")
    const allCharacters: any[] = [];
    const response = await services.getByUrl("https://rickandmortyapi.com/api/character");
    allCharacters.push(...response.data.results);
    let next = response.data.info.next;
    while (next!==null) {
        const response = await services.getByUrl(next);
        allCharacters.push(...response.data.results);

        next = response.data.info.next;
        next ? console.info(next, "cargando..."): console.info("carga de characters finalizada");
    }

    /** evaluting all characters */
    const resultChar: CharResult = {
        char: 'c',
        resource: "character",
        count: 0,
    }
    
    allCharacters.map((character: {name:string}) => {
        resultChar.count += countOccurrs(character.name, 'c');
    })
    responseCharCounter.results.push(resultChar);

    /** Get all locations */
    const allLocations: any[] = [];
    const responseLocation = await services.getByUrl("https://rickandmortyapi.com/api/location");
    allLocations.push(...responseLocation.data.results);
    let nextLocation = responseLocation.data.info.next;
    
    while (nextLocation!==null) {
        const response = await services.getByUrl(nextLocation);
        allLocations.push(...response.data.results);
        nextLocation = response.data.info.next;
        nextLocation ? console.info(nextLocation, "cargando..."): console.info("carga de locations finalizada");

    }

    const resultLocation: CharResult = {
        char: 'l',
        resource: "location",
        count: 0
    }
    /** evaluting all characters */
    allLocations.map((location: {name:string}) => {

    
        resultLocation.count += countOccurrs(location.name, 'l');

    })
    responseCharCounter.results.push(resultLocation);


     /** Get all episodes */
     const allEpisodes: any[] = [];
     const responseEpisode = await services.getByUrl("https://rickandmortyapi.com/api/episode");
     allEpisodes.push(...responseEpisode.data.results);
     let nextEpisode = responseEpisode.data.info.next;
     while (nextEpisode!==null) {
         const response = await services.getByUrl(nextEpisode);
         allEpisodes.push(...response.data.results);
         nextEpisode = response.data.info.next;
         nextEpisode ? console.info(nextEpisode, "cargando..."): console.info("carga de episodes finalizada");
     }


    /** evaluting all characters */
    const resultEpisode: CharResult = {
        char: 'e',
        resource: "episode",
        count: 0
    }
    allEpisodes.map((episode: {name:string}) => {

        resultEpisode.count += countOccurrs(episode.name, 'e');
    })
    responseCharCounter.results.push(resultEpisode);

    let timeEnd = (performance.now() - time)/1000;
    responseCharCounter.time = timeEnd + 's';
    responseCharCounter.in_time = timeEnd <= 3;

    // /** Episode Locations */
    time = performance.now();
    let responseEpisodes: Results = {
        exercise_name :"Episode locations",
        time : "0",
        in_time: true,
        results: []
    };
    allEpisodes.map((episode: {episode: string, characters: []}) => {
        
        // every characteer
        episode.characters.map(async (character: string) => {
            const parts = character.split('/')
            const index = parts[parts.length - 1];
            const result = allCharacters.find((char: {id: number})=> char.id == +index);
            allLocations.map((location) => {

                const characterFound = location.residents.find((resident:string) => resident === result.url);
                if(characterFound) {
                    let resultEpisode: EpisodeResult;
                    resultEpisode = {    
                        name: result.name,
                        episode: episode.episode,
                        locations: [result.location.name]
                    }
                    if(!resultEpisode.locations.find((locationName) => locationName === result.origin.name) ){
                        resultEpisode.locations.push(result.origin.name)
                    }   
                    if(!resultEpisode.locations.find((locationName) => locationName === result.location.name)) {
                        resultEpisode.locations.push(result.location.name)
                    }   
                    responseEpisodes.results.push(resultEpisode);
        
                }
            })
        })
    })

    timeEnd = (performance.now() - time)/1000;
    responseEpisodes.time = timeEnd + 's';
    responseEpisodes.in_time = timeEnd <= 3;

    res.send([responseCharCounter, responseEpisodes])
}


/** utils */

function countOccurrs(strToEvaluate: string, find: string) {
    const indexes = [];
    for(let i = 0; i < strToEvaluate.length; i++) {
      if (strToEvaluate[i].toLowerCase() === find) indexes.push(i);
    }
    return indexes.length;
}