import React, { useState } from 'react'
import { Tabs, Tab, AppBar } from "@material-ui/core";
import Lyrics from './Lyrics'
import FavoritesList from './FavoritesList'
import axios from 'axios';

const apiKey = "b7325758b583496ae99042082d2421dc";
 
const music = require('musicmatch')({ apikey: apiKey });

export default function Home(props) {

    const [selectedTab, setSelectedTab] = useState(props.selectedTab ? props.selectedTab : 0);
    const [songToDisplay, setSongToDisplay] = useState('');
    const [lyrics, setLyrics] = useState("");
    const [user, setUser] = useState(props.user);

    
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const onDeleteFavorite = (index) => {
        let newFavorites = user.favorites;
        newFavorites.splice(index, 1);
        let updatdUser = {
            username: user.username,
            password: user.password,
            favorites: newFavorites,
            id: user._id
        }

        //add to favorites in db
        axios.post('http://localhost:4000/update', updatdUser)
            .then(res => {
                console.log("lyrics update req: ", res.data)
            });

            setUser(updatdUser);
    }

    const onFavoriteClicked = (index) => {
        const song = props.user.favorites[index];
        setSongToDisplay(song);
        setSelectedTab(0);
        music.matcherLyrics({ q_track: song.songTitle, q_artist: song.artist })
            .then((data) => {
                const lyrics = data.message.body.lyrics.lyrics_body;
                setLyrics(lyrics);
            }).catch(function (err) {
                window.alert("error in getting lyrics: ", err);
            })
    }

    const onSearchClicked = (songTitle, artist) => {
        const songToDisplay = { songTitle: songTitle, artist: artist };
        setSongToDisplay(songToDisplay);
        music.matcherLyrics({ q_track: songTitle, q_artist: artist })
            .then((data) => {
                const lyrics = data.message.body.lyrics.lyrics_body;
                if (lyrics === null) {
                    window.alert("Lyrics Not Found");
                } else {
                    setLyrics(lyrics);
                }

            }).catch(function (err) {
                window.alert("error in getting lyrics: ", err);
            })
    }

    const onAddToFavoritesClicked = () => {
        const favoriteSong = {
            songTitle: songToDisplay.songTitle,
            artist: songToDisplay.artist,
        }
        let newFavorites = props.user.favorites;
        newFavorites.push(favoriteSong);
        let updatdUser = {
            username: props.user.username,
            password: props.user.password,
            favorites: newFavorites,
            id: props.user._id
        }
        // add to favorites in db
        axios.post('http://localhost:4000/update', updatdUser)
            .then(res => {
                console.log("lyrics update req: ", res.data);
            });
        window.alert("Song Added To Favorites");
    }

    return (
        <>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleChange} selectionFollowsFocus >
                    <Tab label="Lyrics" />
                    <Tab label="Favorites" />
                </Tabs>
            </AppBar>

            { selectedTab === 0 && <Lyrics lyrics={lyrics}
                user={props.user}
                song={songToDisplay}
                onAddToFavoritesClicked={onAddToFavoritesClicked}
                onSearchClicked={onSearchClicked}
            />}
            { selectedTab === 1 && <FavoritesList user={props.user}
                onFavoriteClicked={onFavoriteClicked}
                onDeleteFavorite={onDeleteFavorite}
            />}
        </>

    )
}


