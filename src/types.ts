export interface Results {
    exercise_name: string;
    time: string
    in_time: boolean,
    results: any
}

type Resource = 'episode' | 'location' | 'character';

export interface CharResult {
    char: string,
    count: number,
    name?: string,
    resource: Resource    
}

export interface EpisodeResult {
    name: string;
    episode: string,
    locations: Array<string>
}