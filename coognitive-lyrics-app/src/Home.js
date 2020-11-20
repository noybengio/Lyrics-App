import React, { Component } from 'react'
import { Tabs, Tab, AppBar } from "@material-ui/core";
import Lyrics from './Lyrics'
import FavoritesList from './FavoritesList'
import axios from 'axios';

const apiKey = 'b7325758b583496ae99042082d2421dc';
const music = require('musicmatch')({ apikey: apiKey });

export class Home extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onFavoriteClicked = this.onFavoriteClicked.bind(this);
        this.onDeleteFavorite = this.onDeleteFavorite.bind(this);
        this.onAddToFavoritesClicked = this.onAddToFavoritesClicked.bind(this);
        this.onSearchClicked = this.onSearchClicked.bind(this);

        this.state = {
            selectedTab: props.selectedTab ? props.selectedTab : 0,
            lyrics: '',
            songToDisplay: '',
            user: props.user
        }
    }

    handleChange(event, newValue) {
        this.setState({ selectedTab: newValue })
    };

    onDeleteFavorite(index) {
        let newFavorites = this.props.user.favorites;
        newFavorites.splice(index, 1);
        let updatdUser = {
            username: this.props.user.username,
            password: this.props.user.password,
            favorites: newFavorites,
            id: this.props.user._id
        }

        //add to favorites in db
        axios.post('http://localhost:4000/update', updatdUser)
            .then(res => {
                console.log("lyrics update req: ", res.data)
            });

        this.setState({ user: updatdUser });
    }

    onFavoriteClicked(index) {
        const song = this.props.user.favorites[index];
        this.setState({ songToDisplay: song, selectedTab: 0 });
        music.matcherLyrics({ q_track: song.songTitle, q_artist: song.artist })
            .then((data) => {
                const lyrics = data.message.body.lyrics.lyrics_body;
                console.log(lyrics);
                this.setState({ lyrics: lyrics });
            }).catch(function (err) {
                window.alert("error in getting lyrics: ", err);
            })
    }

    onSearchClicked(songTitle, artist) {
        const songToDisplay = { songTitle: songTitle, artist: artist };
        this.setState({ songToDisplay: songToDisplay });
        console.log(songTitle, artist);
        music.matcherLyrics({ q_track: songTitle, q_artist: artist })
            .then((data) => {
                const lyrics = data.message.body.lyrics.lyrics_body;
                console.log(lyrics);
                if (lyrics === null) {
                    window.alert("Lyrics Not Found");
                } else {
                    this.setState({ lyrics: lyrics });
                }

            }).catch(function (err) {
                window.alert("error in getting lyrics: ", err);
            })
    }

    onAddToFavoritesClicked() {
        const favoriteSong = {
            songTitle: this.state.songToDisplay.songTitle,
            artist: this.state.songToDisplay.artist,
        }
        let newFavorites = this.props.user.favorites;
        newFavorites.push(favoriteSong);
        let updatdUser = {
            username: this.props.user.username,
            password: this.props.user.password,
            favorites: newFavorites,
            id: this.props.user._id
        }
        // add to favorites in db
        axios.post('http://localhost:4000/update', updatdUser)
            .then(res => {
                console.log("lyrics update req: ", res.data);
            });
        window.alert("Song Added To Favorites");
    }

    render() {
        return (
            <>
                <AppBar position="static">
                    <Tabs value={this.state.selectedTab} onChange={this.handleChange} selectionFollowsFocus >
                        <Tab label="Lyrics" />
                        <Tab label="Favorites" />
                    </Tabs>
                </AppBar>

                { this.state.selectedTab === 0 && <Lyrics lyrics={this.state.lyrics}
                    user={this.props.user}
                    song={this.state.songToDisplay}
                    onAddToFavoritesClicked={this.onAddToFavoritesClicked}
                    onSearchClicked={this.onSearchClicked}
                />}
                { this.state.selectedTab === 1 && <FavoritesList user={this.props.user}
                    onFavoriteClicked={this.onFavoriteClicked}
                    onDeleteFavorite={this.onDeleteFavorite}
                />}
            </>

        )
    }
}

export default Home
