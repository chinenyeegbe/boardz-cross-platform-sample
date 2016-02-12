import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {Configuration} from '../../app-config';
import {Logger} from '../logging/logger';

// Only for testing purposes:
import {GAMES} from './games_100';

export class Packshot {
    frontImageUrl: string;
    topImageUrl: string;
    leftImageUrl: string;
    rightImageUrl: string;
    bottomImageUrl: string;
}

export class Game {
    id: string;
    name: string;
    description: string;
    packshot: Packshot;
    userName: string;
}

@Injectable()
export class GamesService {

    private baseUrl: string;

    constructor(private _logger: Logger, private _http: Http, config: Configuration) {
        this.baseUrl = config.apiEndpoint + 'api/BoardGames/';
    }

    private fetchGames(): Observable<Game[]> {
        return this._http.get(this.baseUrl + 'List').map(response => (<Game[]>response.json()));
    }

    public getGames() : Promise<Game[]> {
        // return Promise.resolve(<Game[]>GAMES);

        return this.fetchGames().toPromise();
    }

    public getGamesCount(): Promise<number> {
        // return Promise.resolve(GAMES.length);

        return this.fetchGames()
            .map(games => games.length)
            .toPromise();
    }

    public getGame(id: string): Promise<Game> {
        /*
        for (let i = 0; i < GAMES.length; i++) {
            if (GAMES[i].id === id)
                return Promise.resolve(GAMES[i]);
        }
        return Promise.reject(Error('Game with id ' + id + ' not found.'));
        */
        return this._http.get(this.baseUrl + 'Single?id=' + id)
            .map(response => <Game>response.json())
            .toPromise();
    }

    public saveOrUpdateGame(game: Game) {
        let result: Promise<string>;

        if (game.id === null) {
            result = this.addGame(game);
        } else {
            result = this.updateGame(game);
        }

        result.then(id => this._logger.logInfo('game updated: ' + id));
    }

    public addGame(game: Game): Promise<string> {
        return this._http.put(this.baseUrl + 'Add', JSON.stringify(game))
            .map(response => <string>response.text())
            .toPromise()
    }

    public updateGame(game: Game): Promise<string> {
        return this._http.put(this.baseUrl + 'Update', JSON.stringify(game))
            .map(response => game.id)
            .toPromise()
    }

}